import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PageProps, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'TOR',
		href: '/tor',
	},
];

type Submisi = {
	id: string;
	judul: string;
	jenis_kegiatan: string;
	created_at: string;
	status_submisi: { status: string }[];
};

const jenisKegiatanOptions = [
	'Pelatihan dan Sertifikasi Kompetensi Dosen',
	'Lomba Mahasiswa',
	'Acara Pameran dan Kompetensi',
	'Pengabdian Masyarakat',
	'Acara Kompetisi',
];

export default function TorPage({ tors }: { tors: Submisi[] }) {
	const { flash } = usePage<PageProps<SharedData>>().props;
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data, setData, post, processing, errors, reset } = useForm({
		judul: '',
		jenis_kegiatan: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		post('/tor', {
			onSuccess: () => {
				setIsModalOpen(false);
				reset();
			},
		});
	};

	useEffect(() => {
		if (flash.success) {
			// You can add a toast notification here
			console.log(flash.success);
		}
	}, [flash]);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="TOR" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Halaman TOR</h1>
					<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
						<DialogTrigger asChild>
							<Button>Tambah TOR</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Buat TOR Baru</DialogTitle>
								<DialogDescription>
									Isi form di bawah untuk membuat TOR baru.
								</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<Label htmlFor="judul">Judul</Label>
									<Input
										id="judul"
										value={data.judul}
										onChange={(e) => setData('judul', e.target.value)}
									/>
									{errors.judul && (
										<p className="text-red-500 text-xs mt-1">{errors.judul}</p>
									)}
								</div>
								<div>
									<Label htmlFor="jenis_kegiatan">Jenis Kegiatan</Label>
									<Select
										onValueChange={(value) => setData('jenis_kegiatan', value)}
										value={data.jenis_kegiatan}
									>
										<SelectTrigger>
											<SelectValue placeholder="Pilih jenis kegiatan" />
										</SelectTrigger>
										<SelectContent>
											{jenisKegiatanOptions.map((option) => (
												<SelectItem key={option} value={option}>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.jenis_kegiatan && (
										<p className="text-red-500 text-xs mt-1">
											{errors.jenis_kegiatan}
										</p>
									)}
								</div>
								<div className="flex justify-end">
									<Button type="submit" disabled={processing}>
										{processing ? 'Membuat...' : 'Buat TOR'}
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>

				{tors.length > 0 ? (
					<div className="">
						{tors.map((tor) => (
							<div key={tor.id} className="border rounded-lg p-4">
								<div>
									<h2 className="font-semibold text-lg">{tor.judul}</h2>
								</div>
								<div className="mb- flex justify-between items-center">
									<div className="text-sm text-muted-foreground">
										<p>Dibuat</p>
										<p>{format(new Date(tor.created_at), 'MMMM yyyy')}</p>
									</div>
									<div className="text-sm">
										<p>Jenis Kegiatan</p>
										<p>{tor.jenis_kegiatan}</p>
									</div>
									<div className="text-sm">
										<p>Dana Diajukan</p>
										<p>Rp 0</p> { /* masih dummy */ }
									</div>
									<div className="text-sm font-medium">
										<p>Status</p>
										<p>{tor.status_submisi.length > 0 ? tor.status_submisi[tor.status_submisi.length - 1].status : 'Draft'}</p>
									</div>
									<div className="flex flex-col gap-2">
										<Button variant="outline" disabled>Buat LPJ</Button>
										<Button variant="outline">Detail TOR</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-10">
						<p>Belum ada TOR yang dibuat.</p>
					</div>
				)}
			</div>
		</AppLayout>
	);
}
