<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $submisi->judul }}</title>
    <style>
        /*
           RESPONSIVE PDF STRATEGY
           Instead of manual padding, we use strict @page margins.
           DomPDF treats the area inside @page margins as the "viewport".
        */
        @page {
            margin: 2.54cm; /* Standard 1 inch margin on all sides */
            size: A4 portrait;
        }

        /* Reset & Box Sizing */
        * {
            box-sizing: border-box;
        }

        body {
            font-family: "Times New Roman", serif;
            font-size: 11pt;
            line-height: 1.3;
            color: #000;
            margin: 0;
            padding: 0;
            width: 100%; /* Occupy full available width inside margins */
        }

        /* Container for Page Breaks */
        .page-break {
            page-break-after: always;
            width: 100%;
        }

        /* Utils */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }
        .uppercase { text-transform: uppercase; }

        /* Margins Utility */
        .mt-4 { margin-top: 15px; }
        .mb-4 { margin-bottom: 15px; }
        .ml-4 { margin-left: 20px; }
        .leading-relaxed { line-height: 1.5; }

        /*
           FLUID TABLES
           Use table-layout: fixed to strictly respect column widths and 100% total width.
        */
        table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            table-layout: fixed;
        }
        th, td {
            vertical-align: top;
            padding: 4px;
            word-wrap: break-word; /* Prevent long words breaking layout */
            overflow-wrap: break-word;
        }

        /* Bordered Tables */
        .table-border, .table-border th, .table-border td {
            border: 1px solid black;
        }
        .table-border th {
            text-align: left;
            padding: 6px;
        }
        .table-border td {
            padding: 6px;
        }
        .bg-gray { background-color: #e2e8f0; }

        /*
           RESPONSIVE COVER
           No fixed widths. Use max-width for aesthetic centering.
        */
        .cover-wrapper {
            width: 100%;
            /* min-height can be used, but table height 100% is better for vertical center */
        }
        .cover-container {
            width: 100%;
            max-width: 500px; /* Aesthetic cap, but will shrink if margins are huge */
            margin: 0 auto;
            border: 1px solid black;
            padding: 30px;
            text-align: center;
        }

        /* Images - Responsive */
        img {
            max-width: 100%;
            height: auto;
        }

        /* Lists */
        ol { margin-top: 0; padding-left: 25px; }
        li { margin-bottom: 5px; text-align: justify; }

    </style>
</head>
<body>

    <!-- ================= HALAMAN 1: COVER ================= -->
    <div class="page-break">
        <!-- Vertical centering using table behavior -->
        <!-- We use a fixed height approx for A4 content area to force vertical center -->
        <table style="width: 100%; height: 800px;">
            <tr>
                <td style="vertical-align: middle; text-align: center;">

                    <div class="cover-container">
                        <div style="margin-bottom: 40px;">
                            <img src="{{ public_path('images/logo_pnj.jpg') }}" style="height: 120px; width: auto;">
                        </div>

                        <p style="font-size: 18pt; letter-spacing: 1px; margin-bottom: 0;">
                            KERANGKA ACUAN KERJA<br>
                            TAHUN ANGGARAN {{ \Carbon\Carbon::now()->year }}
                        </p>

                        <div style="margin-top: 50px; font-size: 14pt;">
                            <p style="margin-bottom: 5px;">Kegiatan :</p>
                            <p class="font-bold" style="margin-top: 0;">{{ $submisi->judul }}</p>
                            <p style="font-size: 12pt; margin-top: 5px;">
                                {{ $submisi->kegiatan_type->nama ?? '-' }}
                            </p>
                        </div>

                        <div style="margin-top: 50px; font-size: 14pt;">
                            <p style="margin-bottom: 0;">Unit Kerja :</p>
                            <p style="margin-top: 5px;">Jurusan TIK</p>
                        </div>

                        <div style="margin-top: 60px; font-size: 14pt;">
                            <p style="margin-bottom: 5px;">Kementerian Pendidikan Tinggi,</p>
                            <p style="margin-top: 0;">Sains, dan Teknologi</p>
                            <p style="margin-top: 30px;">Tahun {{ \Carbon\Carbon::now()->year }}</p>
                        </div>
                    </div>

                </td>
            </tr>
        </table>
    </div>

    <!-- ================= HALAMAN 2: METADATA & LATAR BELAKANG ================= -->
    <div class="page-break">
        
        <!-- Header Kecil -->
        <div class="text-center mb-4">
            <p class="font-bold" style="font-size: 11pt; margin-bottom: 2px;">KERANGKA ACUAN KERJA</p>
            <p style="font-size: 11pt; margin-top: 0;">Tahun Anggaran {{ \Carbon\Carbon::now()->year }}</p>
        </div>

        <!-- Metadata Table - Use Percentage Widths -->
        <div style="font-size: 11pt; margin-bottom: 30px;">
            <table>
                <tr>
                    <td style="width: 35%;">Kementerian Negara/Lembaga</td>
                    <td style="width: 5%;">:</td>
                    <td style="width: 60%;">Kementerian Pendidikan Tinggi, Sains, dan Teknologi</td>
                </tr>
                <tr>
                    <td>PTN/Kopertis</td>
                    <td>:</td>
                    <td>Politeknik Negeri Jakarta</td>
                </tr>
                <tr>
                    <td>Unit Kerja</td>
                    <td>:</td>
                    <td>Jurusan Teknik Informatika dan Komputer</td>
                </tr>
                <tr>
                    <td>Kegiatan</td>
                    <td>:</td>
                    <td>
                        {{ $submisi->judul }}<br>
                        <span class="italic" style="font-size: 10pt;">{{ $submisi->kegiatan_type->nama ?? '' }}</span>
                    </td>
                </tr>
                <tr>
                    <td>Periode Pelaksanaan</td>
                    <td>:</td>
                    <td>{{ $periode }}</td>
                </tr>
            </table>

            <!-- Program - Indikator Kerja Nested Table -->
            <table style="margin-top: 5px;">
                <tr>
                    <td style="width: 35%;">Program – Indikator Kerja</td>
                    <td style="width: 5%;">:</td>
                    <td style="width: 60%;">
                        <table class="table-border" style="width: 100%; font-size: 10pt;">
                            <tr>
                                <td colspan="3">
                                    <span class="font-bold">Program:</span><br>
                                    {{ $submisi->kegiatan_type->nama ?? '-' }}
                                </td>
                            </tr>
                            <tr>
                                <td style="width: 5px;"></td>
                                <td style="width: 75%;">
                                    <span class="font-bold">Indikator Kinerja:</span> 
                                    {{ $submisi->detailSubmisi->iku ?? '(Belum dipilih)' }}
                                </td>
                                <td class="text-center" style="vertical-align: middle;">
                                    @php
                                        $maxTarget = $submisi->indikatorKinerja->max('target');
                                    @endphp
                                    {{ $maxTarget ? $maxTarget . '%' : '-' }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>

        <!-- A. Latar Belakang -->
        <div class="section">
            <p class="font-bold" style="font-size: 11pt;">A. Latar Belakang</p>
            
            <p class="ml-4 font-bold mt-4">1. Dasar Hukum</p>
            <div class="ml-6 text-justify leading-relaxed" style="font-size: 11pt;">
                <ol type="a" style="margin-left: 20px;">
                    <li>Undang-Undang Nomor 17 Tahun 2003 tentang Keuangan Negara;</li>
                    <li>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;</li>
                    <li>Undang-Undang Nomor 12 Tahun 2012 tentang Pendidikan Tinggi;</li>
                    <li>Peraturan Pemerintah Republik Indonesia Nomor 21 Tahun 2004 tentang Penyusunan Rencana Kerja dan Anggaran Kementerian Negara/Lembaga;</li>
                    <li>Peraturan Pemerintah Nomor 90 Tahun 2010 tentang Penyusunan RKA-K/L;</li>
                    <li>Peraturan Pemerintah Nomor 17 Tahun 2010 tentang Pengelolaan dan Penyelenggaraan Pendidikan;</li>
                    <li>Peraturan Pemerintah Nomor 4 Tahun 2014 tentang Penyelenggaraan Pendidikan Tinggi dan Pengelolaan Perguruan Tinggi;</li>
                    <li>Peraturan Pemerintah Nomor 9 Tahun 2018 tentang Penerimaan Negara Bukan Pajak;</li>
                    <li>Rencana Strategis Politeknik Negeri Jakarta Tahun 2020–2024.</li>
                </ol>
            </div>

            <p class="ml-4 font-bold mt-4">2. Gambaran Umum</p>
            <div class="ml-6 text-justify leading-relaxed" style="font-size: 11pt;">
                {!! $submisi->detailSubmisi->gambaran_umum ?? '<p class="italic">(Belum diisi)</p>' !!}
            </div>

            <p class="ml-4 font-bold mt-4">3. Tujuan</p>
            <div class="ml-6 text-justify leading-relaxed" style="font-size: 11pt;">
                {!! $submisi->detailSubmisi->tujuan ?? '<p class="italic">(Belum diisi)</p>' !!}
            </div>

            <p class="ml-4 font-bold mt-4">4. Manfaat</p>
            <div class="ml-6 text-justify leading-relaxed" style="font-size: 11pt;">
                {!! $submisi->detailSubmisi->manfaat ?? '<p class="italic">(Belum diisi)</p>' !!}
            </div>
        </div>
    </div>

    <!-- ================= HALAMAN 3: STRATEGI ================= -->
    <div class="page-break">
        <p class="font-bold" style="font-size: 11pt;">B. Strategi Pencapaian Keluaran</p>

        <p class="ml-4 font-bold mt-4">1. Metode Pelaksanaan</p>
        <div class="ml-6 text-justify leading-relaxed" style="font-size: 11pt;">
            {!! $submisi->detailSubmisi->metode_pelaksanaan ?? '<p class="italic">(Belum diisi)</p>' !!}
        </div>

        <p class="ml-4 font-bold mt-4">2. Waktu Pelaksanaan</p>
        <div class="ml-6 text-justify leading-relaxed" style="font-size: 11pt;">
             {!! $submisi->detailSubmisi->waktu_pelaksanaan ?? '<p class="italic">(Belum diisi)</p>' !!}
        </div>

        <p class="ml-4 font-bold mt-4">C. Indikator Kinerja</p>
        <div class="ml-6 mt-4">
             <table class="table-border" style="width: 100%; font-size: 10pt;">
                <tr class="bg-gray">
                    <th class="text-center" style="width: 40px;">No</th>
                    <th style="width: 140px;">Bulan</th>
                    <th>Indikator Keberhasilan</th>
                    <th class="text-center" style="width: 80px;">Target</th>
                </tr>
                @forelse($submisi->indikatorKinerja as $index => $iku)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $iku->bulan }}</td>
                    <td>{{ $iku->keberhasilan }}</td>
                    <td class="text-center">{{ $iku->target }}%</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="text-center italic">(Belum ada indikator kinerja)</td>
                </tr>
                @endforelse
             </table>
        </div>

        <p class="ml-4 font-bold mt-4">D. Kurun Waktu Pelaksanaan</p>
        <div class="ml-6 text-justify leading-relaxed" style="font-size: 11pt;">
             Kegiatan ini dilaksanakan pada periode: <strong>{{ $periode }}</strong>.
        </div>

        <p class="ml-4 font-bold mt-4">E. Biaya Yang Diperlukan</p>
        <div class="ml-6 text-justify leading-relaxed" style="font-size: 11pt;">
            Biaya yang diperlukan untuk pelaksanaan kegiatan ini sebesar <strong>Rp {{ number_format($submisi->total_anggaran, 0, ',', '.') }}</strong>.
        </div>

        <div class="ml-4 mt-4">
             <table class="table-border" style="width: 100%; font-size: 10pt;">
                <tr class="bg-gray">
                    <th style="width: 25%;">Uraian</th>
                    <th style="width: 40%;">Rincian</th>
                    <th class="text-center" style="width: 10%;">Satuan</th>
                    <th class="text-center" style="width: 25%;">Jumlah</th>
                </tr>
                @forelse($submisi->biaya as $b)
                 @php
                    $t = ($b->biaya_satuan ?? 0) * ($b->jumlah_kali ?? 0) * ($b->jumlah_org ?? 0);
                 @endphp
                <tr>
                    <td>{{ $b->deskripsi }}</td>
                    <td>{{ $b->jumlah_org }} ORG x {{ $b->jumlah_kali }} KALI x Rp {{ number_format($b->biaya_satuan, 0, ',', '.') }}</td>
                    <td class="text-center">{{ $b->satuan }}</td>
                    <td class="text-right">Rp {{ number_format($t, 0, ',', '.') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="text-center italic">(Belum ada rincian anggaran)</td>
                </tr>
                @endforelse
                <tr>
                    <td colspan="3" class="text-right font-bold">Total</td>
                    <td class="text-right font-bold">Rp {{ number_format($submisi->total_anggaran, 0, ',', '.') }}</td>
                </tr>
             </table>
        </div>

        <!-- TANDA TANGAN -->
        <div style="margin-top: 50px; text-align: right;">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 60%;"></td>
                    <td style="width: 40%; text-align: right;">
                        <p style="margin-bottom: 5px;">Depok, {{ $detail?->tanggal_mulai ? \Carbon\Carbon::parse($detail->tanggal_mulai)->isoFormat('D MMMM Y') : \Carbon\Carbon::now()->isoFormat('D MMMM Y') }}</p>
                        <p style="margin-top: 0;">Penanggung jawab,</p>
                        
                        <div style="margin: 20px 0; text-align: right;">
                             <img src="{{ public_path('images/ttd_kajur.jpg') }}" style="height: 80px; width: auto; display: inline-block;">
                        </div>

                        <p class="font-bold" style="margin-bottom: 0;">{{ $picName }}</p>
                        <p style="margin-top: 0;">NIP. {{ $picNip }}</p>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <!-- ================= HALAMAN 4: LAMPIRAN ================= -->
    <div class="page-break">
        <p class="font-bold" style="font-size: 11pt;">F. Lampiran</p>

        <p class="ml-4 font-bold mt-4">1. Anggota Tim</p>
        <div class="ml-6 mt-2">
            <table class="table-border" style="width: 100%; font-size: 10pt;">
                <tr class="bg-gray">
                    <th class="text-center" style="width: 40px;">No</th>
                    <th>Nama</th>
                    <th class="text-center" style="width: 150px;">NIM</th>
                    <th class="text-center" style="width: 180px;">Prodi</th>
                </tr>
                @forelse($submisi->anggotaTim as $i => $a)
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td>{{ $a->user->name ?? '-' }}</td>
                    <td class="text-center">{{ $a->user->mahasiswa->nim ?? '-' }}</td>
                    <td class="text-center">{{ $a->user->mahasiswa->prodi ?? '-' }}</td>
                </tr>
                @empty
                 <tr>
                    <td colspan="4" class="text-center italic">(Belum ada anggota tim)</td>
                </tr>
                @endforelse
            </table>
        </div>

        <p class="ml-4 font-bold mt-4">2. Daftar Lampiran File</p>
        <div class="ml-6 mt-2">
            <table class="table-border" style="width: 100%; font-size: 10pt;">
                <tr class="bg-gray">
                    <th class="text-center" style="width: 40px;">No</th>
                    <th>Nama File</th>
                    <th>Deskripsi</th>
                </tr>
                @forelse($submisi->submisiFile as $i => $f)
                <tr>
                    <td class="text-center">{{ $i + 1 }}</td>
                    <td>{{ $f->nama }}</td>
                    <td>{{ $f->deskripsi }}</td>
                </tr>
                @empty
                 <tr>
                    <td colspan="3" class="text-center italic">(Belum ada lampiran file)</td>
                </tr>
                @endforelse
            </table>
        </div>
    </div>

    <!-- ================= LAMPIRAN GAMBAR ================= -->
    @foreach($submisi->submisiFile as $index => $f)
        @php
            $ext = strtolower(pathinfo($f->nama, PATHINFO_EXTENSION));
            $isImage = in_array($ext, ['jpg', 'jpeg', 'png', 'webp']);
            // NOTE: For local env, use storage_path or public_path.
            // Assumption: files are in storage/app/public/[path] -> available via public/storage/[path]
            $imagePath = public_path('storage/' . $f->file_location); 
        @endphp
        
        @if($isImage && file_exists($imagePath))
            <div class="page-break text-center">
                 <p class="font-bold section-title">Lampiran {{ $index + 1 }}: {{ $f->nama }}</p>
                 <p class="italic text-center" style="margin-bottom: 20px;">{{ $f->deskripsi }}</p>
                 
                 <div style="border: 1px solid #ccc; padding: 10px; display: inline-block;">
                     <img src="{{ $imagePath }}" style="max-width: 100%; max-height: 800px; width: auto; height: auto;">
                 </div>
            </div>
        @endif
    @endforeach

</body>
</html>
