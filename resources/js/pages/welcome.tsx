import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#FDFDFC] font-['Instrument_Sans'] text-[#1b1b18] dark:bg-[#0a0a0a]">
                <div className="pointer-events-none absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[#73AD86]/20 blur-[100px]" />
                <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#427452]/10 blur-[120px]" />

                <nav className="relative z-10 flex items-center justify-center px-3 py-3 pt-8 pb-1 lg:px-12">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo_sidana.png"
                            alt="Logo"
                            className="h-24 w-auto object-contain"
                        />
                        <span className="text-lg font-semibold tracking-tight text-[#427452] dark:text-white"></span>
                    </div>
                </nav>

                <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center lg:px-8">
                    {/* <div className="mb-6 inline-flex items-center rounded-full border border-[#73AD86]/30 bg-[#73AD86]/10 px-3 py-1 text-sm text-[#427452] dark:text-[#73AD86]">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#427452] animate-pulse"></span>
                        Portal Resmi Kemahasiswaan
                    </div> */}

                    <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                        Sistem Manajemen <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-[#427452] to-[#73AD86] bg-clip-text text-transparent">
                            Pengelolaan Dana
                        </span>{' '}
                        Kegiatan Jurusan
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Memantau realisasi dana kini lebih akurat dan cepat.
                        Sistem manajemen terintegrasi yang dirancang untuk
                        menggantikan proses manual, memperjelas alur birokrasi,
                        dan memastikan setiap kegiatan jurusan berjalan
                        akuntabel.{' '}
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#427452] px-8 py-3 font-medium text-white shadow-lg transition duration-300 hover:bg-[#355C45] hover:shadow-xl"
                            >
                                <span className="mr-2">Akses Dashboard</span>
                                <svg
                                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Link>
                        ) : (
                            <div className="flex gap-4">
                                <Link
                                    href={login()}
                                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#427452] px-8 py-3 font-medium text-white shadow-lg transition duration-300 hover:bg-[#355C45] hover:shadow-xl"
                                >
                                    <span>Mulai Sekarang</span>
                                    <svg
                                        className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative z-10 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Ardana System. Developed
                    by Team Tomodachi.
                </div>
            </div>
        </>
    );
}
