<?php

namespace App\Http\Controllers;

use App\Events\SubmisiSubmitted;
use App\Models\KegiatanType;
use App\Models\StatusSubmisi;
use App\Models\StatusType;
use App\Models\Submisi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SubmisiController extends Controller
{
    public function index(Request $request, string $type)
    {
        $query = Submisi::with([
            'statusSubmisi' => function ($query) {
                // Urutkan dari yang paling lama ke paling baru, agar di frontend [length - 1] adalah yang terbaru
                $query->orderBy('created_at', 'asc');
            },
            'statusSubmisi.statusType', 'kegiatanType', 'createdBy',
        ])
            ->where('created_by', Auth::id())
            ->where('type', strtoupper($type))
            ->orderBy('created_at', 'desc');

        if (strtoupper($type) === 'TOR') {
            $query->with('generatedLpj');
        } elseif (strtoupper($type) === 'LPJ') {
            $query->with('parentTor');
        }

        $submisis = $query->get();

        $kegiatanTypes = KegiatanType::all();

        // The frontend for tor/index expects 'tors'. Let's keep that for now to avoid breaking the page.
        $propName = strtolower($type).'s'; // 'tors' or 'lpjs'

        $pageData = [
            $propName => $submisis,
        ];

        if (strtoupper($type) !== 'LPJ') {
            $pageData['kegiatanTypes'] = $kegiatanTypes;
        }

        return Inertia::render(strtolower($type).'/index', $pageData);
    }

    public function store(Request $request, string $type)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'kegiatan_type_id' => 'required|uuid|exists:kegiatan_types,id',
        ]);

        Submisi::create([
            'judul' => $request->judul,
            'kegiatan_type_id' => $request->kegiatan_type_id,
            'type' => strtoupper($type),
            'created_by' => Auth::id(),
        ]);

        return Redirect::route('submisi.index', ['type' => $type])->with('success', strtoupper($type).' berhasil dibuat.');
    }

    public function show(Request $request, Submisi $submisi)
    {
        $relationsToLoad = [
            'anggotaTim.user.mahasiswa',
            'statusSubmisi' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'statusSubmisi.statusType',
            'indikatorKinerja',
            'submisiFile',
            'biaya',
            'kegiatanType',
            'createdBy',
            'parentTor.detailSubmisi.pic', // Eager load pic from parent
        ];

        // For LPJ, if it doesn't have its own detail, load the parent TOR's detail as a template.
        // The relationship on the Submisi model will handle getting the latest version.
        if (strtoupper(trim($submisi->type)) === 'LPJ') {
            $submisi->load('detailSubmisi');
            if (! $submisi->detailSubmisi) {
                // Manually set the relation from parent
                $tor = $submisi->parentTor()->with('detailSubmisi.pic')->first();
                if ($tor && $tor->detailSubmisi) {
                    $submisi->setRelation('detail_submisi', $tor->detailSubmisi);
                }
            } else {
                // if it has its own detail, make sure pic is loaded
                $submisi->load('detailSubmisi.pic');
            }
        } else {
            // For TOR, just load its own detail with pic
            $relationsToLoad['detailSubmisi'] = function ($query) {
                $query->with('pic');
            };
        }

        $submisi->load($relationsToLoad);

        Log::info('Final submisi object being sent to frontend:', $submisi->toArray());

        $latestStatus = $submisi->statusSubmisi->first();

        $rolesToInclude = ['dosen', 'sekjur', 'kajur'];
        $dosens = User::whereHas('roles', function ($q) use ($rolesToInclude) {
            $q->whereIn(DB::raw('TRIM(role_name)'), $rolesToInclude);
        })
            ->with('dosen')
            ->get()
            ->map(function ($user) {
                if ($user->dosen) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'nip' => $user->dosen->nip,
                    ];
                }

                return null;
            })->filter()->values();

        $kegiatanTypes = KegiatanType::all();

        $view = strtolower(trim($submisi->type)).'/detail'; // 'tor/detail' or 'lpj/detail'

        return Inertia::render($view, [
            'submisi' => $submisi,
            'dosens' => $dosens,
            'kegiatanTypes' => $kegiatanTypes,
            'latestStatus' => $latestStatus, // Pass latest status to the view
        ]);
    }

    public function update(Request $request, Submisi $submisi)
    {
        $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'kegiatan_type_id' => 'sometimes|required|uuid|exists:kegiatan_types,id',
        ]);

        $submisi->update($request->all());

        return Redirect::back()->with('success', $submisi->type.' berhasil diperbarui.');
    }

    public function updateDetail(Request $request, Submisi $submisi)
    {
        $submisiType = strtoupper(trim($submisi->type));

        if ($submisiType === 'TOR') {
            $validatedData = $request->validate([
                'indikator_kinerja' => 'required|string',
                'tanggal_mulai' => 'required|date',
                'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
                'gambaran_umum' => 'required|string',
                'tujuan' => 'required|string',
                'manfaat' => 'required|string',
                'metode_pelaksanaan' => 'required|string',
                'waktu_pelaksanaan' => 'required|string',
                'pic_id' => 'required|string|exists:users,id',
            ]);

            $dbData = [
                'iku' => $validatedData['indikator_kinerja'],
                'tanggal_mulai' => $validatedData['tanggal_mulai'],
                'tanggal_selesai' => $validatedData['tanggal_selesai'],
                'gambaran_umum' => $validatedData['gambaran_umum'],
                'tujuan' => $validatedData['tujuan'],
                'manfaat' => $validatedData['manfaat'],
                'metode_pelaksanaan' => $validatedData['metode_pelaksanaan'],
                'waktu_pelaksanaan' => $validatedData['waktu_pelaksanaan'],
                'pic_id' => $validatedData['pic_id'],
            ];

        } elseif ($submisiType === 'LPJ') {
            $validatedData = $request->validate([
                'indikator_kinerja' => 'required|string',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
                'gambaran_umum' => 'nullable|string',
                'tujuan' => 'nullable|string',
                'manfaat' => 'nullable|string',
                'metode_pelaksanaan' => 'nullable|string',
                'waktu_pelaksanaan' => 'nullable|string',
                'peserta_kegiatan' => ['required', 'string', function ($attribute, $value, $fail) {
                    if (empty(trim(html_entity_decode(strip_tags($value))))) {
                        $fail('Field peserta kegiatan tidak boleh kosong.');
                    }
                }],
                'hasil_kegiatan' => ['required', 'string', function ($attribute, $value, $fail) {
                    if (empty(trim(html_entity_decode(strip_tags($value))))) {
                        $fail('Field hasil kegiatan tidak boleh kosong.');
                    }
                }],
            ]);

            $dbData = [
                'iku' => $validatedData['indikator_kinerja'],
                'tanggal_mulai' => $validatedData['tanggal_mulai'],
                'tanggal_selesai' => $validatedData['tanggal_selesai'],
                'gambaran_umum' => $validatedData['gambaran_umum'],
                'tujuan' => $validatedData['tujuan'],
                'manfaat' => $validatedData['manfaat'],
                'metode_pelaksanaan' => $validatedData['metode_pelaksanaan'],
                'waktu_pelaksanaan' => $validatedData['waktu_pelaksanaan'],
                'peserta_kegiatan' => $validatedData['peserta_kegiatan'],
                'hasil_kegiatan' => $validatedData['hasil_kegiatan'],
            ];

            $parentTor = $submisi->parentTor()->with('detailSubmisi')->first();
            if ($parentTor && $parentTor->detailSubmisi) {
                $dbData['pic_id'] = $parentTor->detailSubmisi->pic_id;
            }
        } else {
            Log::error('updateDetail failed: Unrecognized submission type.', ['type' => $submisi->type]);

            return Redirect::back()->with('error', 'Tipe submisi tidak dikenal dan tidak bisa disimpan.');
        }

        DB::transaction(function () use ($submisi, $dbData) {
            $submisi->detailSubmisi()->updateOrCreate(
                ['submisi_id' => $submisi->id],
                $dbData
            );
        });

        return Redirect::back()->with('success', 'Detail '.$submisi->type.' berhasil disimpan.');
    }

    public function storeNewVersion(Request $request, Submisi $submisi)
    {
        $submisiType = strtoupper(trim($submisi->type));

        if ($submisiType === 'TOR') {
            $validatedData = $request->validate([
                'indikator_kinerja' => 'required|string',
                'tanggal_mulai' => 'required|date',
                'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
                'gambaran_umum' => 'required|string',
                'tujuan' => 'required|string',
                'manfaat' => 'required|string',
                'metode_pelaksanaan' => 'required|string',
                'waktu_pelaksanaan' => 'required|string',
                'pic_id' => 'required|string|exists:users,id',
            ]);

            $dbData = [
                'iku' => $validatedData['indikator_kinerja'],
                'tanggal_mulai' => $validatedData['tanggal_mulai'],
                'tanggal_selesai' => $validatedData['tanggal_selesai'],
                'gambaran_umum' => $validatedData['gambaran_umum'],
                'tujuan' => $validatedData['tujuan'],
                'manfaat' => $validatedData['manfaat'],
                'metode_pelaksanaan' => $validatedData['metode_pelaksanaan'],
                'waktu_pelaksanaan' => $validatedData['waktu_pelaksanaan'],
                'pic_id' => $validatedData['pic_id'],
            ];

        } elseif ($submisiType === 'LPJ') {
            $validatedData = $request->validate([
                'indikator_kinerja' => 'required|string',
                'tanggal_mulai' => 'nullable|date',
                'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
                'gambaran_umum' => 'nullable|string',
                'tujuan' => 'nullable|string',
                'manfaat' => 'nullable|string',
                'metode_pelaksanaan' => 'nullable|string',
                'waktu_pelaksanaan' => 'nullable|string',
                'peserta_kegiatan' => ['required', 'string', function ($attribute, $value, $fail) {
                    if (empty(trim(html_entity_decode(strip_tags($value))))) {
                        $fail('Field peserta kegiatan tidak boleh kosong.');
                    }
                }],
                'hasil_kegiatan' => ['required', 'string', function ($attribute, $value, $fail) {
                    if (empty(trim(html_entity_decode(strip_tags($value))))) {
                        $fail('Field hasil kegiatan tidak boleh kosong.');
                    }
                }],
            ]);

            $dbData = [
                'iku' => $validatedData['indikator_kinerja'],
                'tanggal_mulai' => $validatedData['tanggal_mulai'],
                'tanggal_selesai' => $validatedData['tanggal_selesai'],
                'gambaran_umum' => $validatedData['gambaran_umum'],
                'tujuan' => $validatedData['tujuan'],
                'manfaat' => $validatedData['manfaat'],
                'metode_pelaksanaan' => $validatedData['metode_pelaksanaan'],
                'waktu_pelaksanaan' => $validatedData['waktu_pelaksanaan'],
                'peserta_kegiatan' => $validatedData['peserta_kegiatan'],
                'hasil_kegiatan' => $validatedData['hasil_kegiatan'],
            ];

            $parentTor = $submisi->parentTor()->with('detailSubmisi')->first();
            if ($parentTor && $parentTor->detailSubmisi) {
                $dbData['pic_id'] = $parentTor->detailSubmisi->pic_id;
            }

        } else {
            Log::error('storeNewVersion failed: Unrecognized submission type.', ['type' => $submisi->type]);

            return Redirect::back()->with('error', 'Tipe submisi tidak dikenal dan tidak bisa disimpan.');
        }

        DB::transaction(function () use ($submisi, $dbData) {
            $submisi->detailSubmisi()->create($dbData);
        });

        return Redirect::back()->with('success', 'Versi revisi baru berhasil disimpan.');
    }

    public function verifikasi()
    {
        $tors = Submisi::with('statusSubmisi.statusType')
            ->where('type', 'TOR')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('verifikasi/index', ['tors' => $tors]);
    }

    public function approveOrReject(Request $request, Submisi $submisi)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        $statusNama = $request->action === 'approve' ? 'Disetujui' : 'Ditolak';
        $statusType = StatusType::where('nama', $statusNama)->firstOrFail();

        StatusSubmisi::create([
            'submisi_id' => $submisi->id,
            'status_type_id' => $statusType->id,
            'created_by' => Auth::id(),
        ]);

        return Redirect::back()->with('success', 'Status TOR berhasil diperbarui.');
    }

    public function submit(Request $request, Submisi $submisi)
    {
        // Use the singular relationship property
        $latestDetail = $submisi->detailSubmisi;

        if (! $latestDetail) {
            return Redirect::back()->with('error', 'Detail '.$submisi->type.' harus diisi lengkap sebelum diajukan.');
        }

        $statusType = StatusType::where('nama', 'Diajukan')->firstOrFail();

        StatusSubmisi::create([
            'submisi_id' => $submisi->id,
            'detail_submisi_id' => $latestDetail->id,
            'status_type_id' => $statusType->id,
            'created_by' => Auth::id(),
        ]);

        // Kirim notifikasi ke reviewer
        SubmisiSubmitted::dispatch($submisi);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user && ($user->hasRole('mahasiswa') || $user->hasRole('dosen'))) {
            return Redirect::route('submisi.index', ['type' => strtolower($submisi->type)])->with('success', $submisi->type.' berhasil diajukan.');
        }

        // Default redirect for other roles (e.g., admin, reviewer)
        return Redirect::route('dashboard')->with('success', $submisi->type.' berhasil diajukan.');
    }

    public function generateLpj(Submisi $tor)
    {
        // 1. Validate
        if ($tor->type !== 'TOR') {
            return Redirect::back()->with('error', 'Hanya TOR yang bisa dijadikan dasar untuk LPJ.');
        }

        $latestStatus = $tor->statusSubmisi()->latest()->first();
        if (! $latestStatus || trim($latestStatus->statusType->nama) !== 'Disetujui') {
            return Redirect::back()->with('error', 'LPJ hanya bisa dibuat dari TOR yang sudah Disetujui.');
        }

        // Check if LPJ already exists for this TOR
        $existingLpj = Submisi::where('parent_tor_id', $tor->id)->first();
        if ($existingLpj) {
            return Redirect::route('submisi.show', $existingLpj->id)->with('info', 'LPJ untuk TOR ini sudah ada.');
        }

        // 2. Replicate
        $lpj = $tor->replicate();

        // 3. Modify
        $lpj->type = 'LPJ';
        $lpj->parent_tor_id = $tor->id;

        // 4. Save
        $lpj->save();

        // 5. Redirect
        return Redirect::back()->with('success', 'LPJ berhasil dibuat dari TOR.');
    }

    public function template(Submisi $submisi)
    {
        $submisi->load([
            'detailSubmisi',
            'kegiatanType',
            'indikatorKinerja',
            'biaya',
            'anggotaTim.user.mahasiswa',
            'submisiFile',
            // kalau PIC itu user/dosen:
            'detailSubmisi.pic', // sesuaikan relasi
        ]);

        return Inertia::render('Tor/detail-template', [
            'submisi' => $submisi,
        ]);
    }
}
