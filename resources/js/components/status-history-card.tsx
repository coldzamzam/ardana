import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import React from 'react';
import { Submisi } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';

interface StatusHistoryCardProps {
    submisi: Submisi;
}

export default function StatusHistoryCard({ submisi }: StatusHistoryCardProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Pastikan submisi.status_submisi ada dan diurutkan dari terbaru
    const sortedStatusHistory = submisi.status_submisi
        ? [...submisi.status_submisi].sort(
              (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
          )
        : [];

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card className="overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white shadow-sm">
                <CollapsibleTrigger asChild>
                    <CardHeader className="flex cursor-pointer flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-gray-700">
                            Rincian Proses
                        </CardTitle>
                        <Button variant="ghost" size="icon">
                            <ChevronsUpDown className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="">
                        <div className="rounded-md border text-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID Status</TableHead>
                                        <TableHead className="w-[150px]">Tanggal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedStatusHistory.length > 0 ? (
                                        sortedStatusHistory.map((statusEntry) => (
                                            <TableRow key={statusEntry.id}>
                                                <TableCell className="font-medium">
                                                    <Link
                                                        href={`/dashboard/history/${statusEntry.detail_submisi_id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {statusEntry.id.substring(0, 10)}...
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(statusEntry.created_at), 'dd MMM yyyy HH:mm')}
                                                </TableCell>
                                                <TableCell>{statusEntry.status_type?.nama}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {statusEntry.keterangan || '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center">
                                                Tidak ada riwayat status.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
