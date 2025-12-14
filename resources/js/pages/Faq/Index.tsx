import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';
import { Faq } from '../Admin/Faq/type';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'FAQ',
        href: '/faq',
    },
];

function Index({ faqs }: PageProps<{ faqs: Faq[] }>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="FAQ" />
            <div className="flex h-full flex-1 bg-[#CBEBD5]/70 p-4 md:p-6">
                <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-[#E6F5EC] p-4 md:p-6">
                    {/* HEADER SECTION */}
                    <div className="w-full">
                        <div className="mb-2 flex items-center gap-3">
                            <HelpCircle className="h-8 w-8 text-[#427452]" />
                            <h1 className="text-3xl font-bold text-[#427452]">
                                Frequently Asked Questions
                            </h1>
                        </div>
                        <p className="text-sm text-[#427452]">
                            Temukan jawaban atas pertanyaan umum Anda di bawah
                            ini
                        </p>
                    </div>

                    {/* ACCORDION CONTENT */}
                    <div className="mt-4 flex-1 space-y-2 overflow-y-auto rounded-2xl bg-white p-6 shadow-sm">
                        {faqs.length > 0 ? (
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                {faqs.map((faq) => (
                                    <AccordionItem
                                        key={faq.id}
                                        value={faq.id}
                                        className="border-b border-gray-100 last:border-0"
                                    >
                                        <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-[#427452]">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="leading-relaxed text-gray-700">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <HelpCircle className="mb-3 h-12 w-12 text-gray-300" />
                                <p className="text-gray-500">
                                    Belum ada FAQ yang tersedia
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default Index;
