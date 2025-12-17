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

            {/* Animations */}
            <style>{`
                @keyframes floatSlow {
                    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
                    50% { transform: translate3d(18px, -14px, 0) scale(1.05); }
                }
                @keyframes floatSlow2 {
                    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
                    50% { transform: translate3d(-16px, 12px, 0) scale(1.04); }
                }
                @keyframes fadeUp {
                    0% { opacity: 0; transform: translate3d(0, 18px, 0); }
                    100% { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translate3d(0, 6px, 0); }
                    100% { opacity: 1; transform: translate3d(0, 0, 0); }
                }
                @keyframes shine {
                    0% { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
                    15% { opacity: .45; }
                    45% { opacity: 0; }
                    100% { transform: translateX(240%) skewX(-18deg); opacity: 0; }
                }

                .glow-float-1 { animation: floatSlow 10s ease-in-out infinite; }
                .glow-float-2 { animation: floatSlow2 12s ease-in-out infinite; }
                .glow-float-3 { animation: floatSlow 14s ease-in-out infinite; }
                .glow-float-4 { animation: floatSlow2 16s ease-in-out infinite; }

                .enter-1 { animation: fadeUp .75s ease-out both; }
                .enter-2 { animation: fadeUp .75s ease-out .12s both; }
                .enter-3 { animation: fadeUp .75s ease-out .22s both; }
                .enter-4 { animation: fadeIn .7s ease-out .32s both; }

                .btn-shine::after{
                    content:"";
                    position:absolute;
                    inset:-2px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
                    width: 40%;
                    transform: translateX(-120%) skewX(-18deg);
                    opacity: 0;
                    pointer-events:none;
                }
                .btn-shine:hover::after{
                    animation: shine 1.3s ease-out;
                }

                @media (prefers-reduced-motion: reduce) {
                    .glow-float-1,.glow-float-2,.glow-float-3,.glow-float-4,
                    .enter-1,.enter-2,.enter-3,.enter-4,
                    .btn-shine::after { animation: none !important; }
                }
            `}</style>

            <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#FDFDFC] font-['Instrument_Sans'] text-[#1b1b18] dark:bg-[#0a0a0a]">
                {/* Glow bubbles animated */}
                <div className="glow-float-1 pointer-events-none absolute top-[-10%] right-[-5%] h-[520px] w-[520px] rounded-full bg-[#73AD86]/30 blur-[90px]" />
                <div className="glow-float-2 pointer-events-none absolute top-[2%] right-[6%] h-[260px] w-[260px] rounded-full bg-[#73AD86]/25 blur-[50px]" />
                <div className="glow-float-3 pointer-events-none absolute bottom-[-10%] left-[-10%] h-[640px] w-[640px] rounded-full bg-[#427452]/20 blur-[110px]" />
                <div className="glow-float-4 pointer-events-none absolute bottom-[2%] left-[6%] h-[320px] w-[320px] rounded-full bg-[#427452]/18 blur-[60px]" />

                <nav className="relative z-10 flex items-center justify-center px-3 py-3 pt-8 pb-1 lg:px-12">
                    <div className="enter-1 flex items-center gap-3">
                        <img
                            src="/images/logo_sidana.png"
                            alt="Logo"
                            className="h-24 w-auto object-contain"
                        />
                        <span className="text-lg font-semibold tracking-tight text-[#427452] dark:text-white"></span>
                    </div>
                </nav>

                <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center lg:px-8">
                    <h1 className="enter-2 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                        Sistem Manajemen <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-[#427452] to-[#73AD86] bg-clip-text text-transparent">
                            Pengelolaan Dana
                        </span>{' '}
                        Kegiatan Jurusan
                    </h1>

                    <p className="enter-3 mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Memantau realisasi dana kini lebih akurat dan cepat.
                        Sistem manajemen terintegrasi yang dirancang untuk
                        menggantikan proses manual, memperjelas alur birokrasi,
                        dan memastikan setiap kegiatan jurusan berjalan
                        akuntabel.
                    </p>

                    <div className="enter-4 mt-10 flex items-center justify-center gap-x-6">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="btn-shine group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#427452] px-8 py-3 font-medium text-white shadow-lg transition duration-300 hover:bg-[#355C45] hover:shadow-xl"
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
                                    className="btn-shine group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#427452] px-8 py-3 font-medium text-white shadow-lg transition duration-300 hover:bg-[#355C45] hover:shadow-xl"
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
