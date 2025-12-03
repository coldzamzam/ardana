<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\User;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Temukan pengguna superadmin
        $superAdmin = User::where('email', 'superadmin@ardana.com')->first();

        // Lanjutkan hanya jika superadmin ditemukan
        if ($superAdmin) {
            $faqs = [
                [
                    'question' => 'Bagaimana cara login ke sistem?',
                    'answer' => 'Terdapat dua metode login: Google OAuth dan login menggunakan Email sebagai username. Pilih tombol Google untuk SSO atau isi email dan kata sandi untuk login lokal.',
                ],
                [
                    'question' => 'Bagaimana alur pengajuan dari mahasiswa sampai disetujui?',
                    'answer' => 'Mahasiswa membuat TOR → submit → Admin/Sekjur/Kajur melakukan validasi/verifikasi/penyetujuan sesuai peran → bila disetujui berpindah status ke "disetujui". Jika butuh perbaikan, status menjadi "revisi" dengan catatan.',
                ],
                [
                    'question' => 'Apa yang dimaksud Riwayat Submisi?',
                    'answer' => 'Riwayat Submisi mencatat setiap pengiriman/revisi/status change, siapa yang mengubah, timestamp, dan catatan/komentar terkait supaya audit trail jelas.',
                ],
                [
                    'question' => 'Bagaimana sistem menangani revisi yang diminta?',
                    'answer' => 'Reviewer memberikan catatan revisi. Status dokumen berubah menjadi "revisi" dan pengaju memperbaiki dokumen lalu melakukan submit ulang; semua langkah tercatat di riwayat submisi.',
                ],
                [
                    'question' => 'Bagaimana cara menambahkan anggota tim pada TOR/LPJ?',
                    'answer' => 'Di form TOR/LPJ ada fitur "Tambah Anggota Tim" untuk memasukkan nama, peran, dan kontak anggota. Setelah disimpan, anggota tampil pada detail dokumen.',
                ],
            ];

            foreach ($faqs as $faqData) {
                Faq::updateOrCreate(
                    ['question' => $faqData['question']],
                    [
                        'answer' => $faqData['answer'],
                        'user_id' => $superAdmin->id,
                    ]
                );
            }
        }
    }
}