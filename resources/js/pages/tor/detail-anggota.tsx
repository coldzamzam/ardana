import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Submisi, User } from '@/types';
import { router } from '@inertiajs/react';
import { Loader2, Trash2 } from 'lucide-react';
import React from 'react';

interface DetailAnggotaProps {
	submisi: Submisi;
}

export default function DetailAnggota({ submisi }: DetailAnggotaProps) {
	const [showSearch, setShowSearch] = React.useState(false);
	const [mahasiswaSearch, setMahasiswaSearch] = React.useState('');
	const [mahasiswaResult, setMahasiswaResult] = React.useState<User | null>(
		null,
	);
	const [searchError, setSearchError] = React.useState<string | null>(null);
	const [isSearching, setIsSearching] = React.useState(false);

	const handleSearchMahasiswa = async () => {
		if (!mahasiswaSearch.trim()) {
			setSearchError('NIM tidak boleh kosong.');
			return;
		}

		setIsSearching(true);
		setSearchError(null);
		setMahasiswaResult(null);

		try {
			const res = await fetch(
				`/mahasiswa/search?nim=${mahasiswaSearch}&submisi_id=${submisi.id}`,
			);

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Terjadi kesalahan');
			}

			const data = await res.json();
			setMahasiswaResult(data);
		} catch (error: any) {
			setSearchError(error.message);
		} finally {
			setIsSearching(false);
		}
	};

	const handleAddAnggota = () => {
		if (mahasiswaResult) {
			router.post(
				'/anggota-tim',
				{
					submisi_id: submisi.id,
					anggota_id: mahasiswaResult.id,
				},
				{
					preserveScroll: true,
				},
			);
			setMahasiswaResult(null);
			setMahasiswaSearch('');
			setShowSearch(false);
		}
	};

	const handleDeleteAnggota = (anggotaId: string) => {
		router.delete(`/anggota-tim/${anggotaId}`, {
			preserveScroll: true,
		});
	};

	return (
		<Card className="overflow-hidden rounded-2xl border border-[#73AD86]/40 shadow-sm">
			<CardHeader>
				<CardTitle className="text-xl font-semibold text-[#427452]">
					Anggota Tim
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nama</TableHead>
							<TableHead>NIM</TableHead>
							<TableHead>Prodi</TableHead>
							<TableHead>Aksi</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{submisi.anggota_tim &&
							submisi.anggota_tim.map((anggota) => (
								<TableRow key={anggota.id}>
									<TableCell>{anggota.user.name}</TableCell>
									<TableCell>
										{anggota.user.mahasiswa.nim}
									</TableCell>
									<TableCell>
										{anggota.user.mahasiswa.prodi}
									</TableCell>
									<TableCell>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="destructive"
													size="sm"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Apakah anda yakin ingin menghapus peserta?
													</AlertDialogTitle>
													<AlertDialogDescription>
														Ini akan menghapus peserta dari kegiatan ini. Anda dapat menambahkannya kembali nanti.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Batal
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() =>
															handleDeleteAnggota(
																anggota.id,
															)
														}
													>
														Lanjutkan
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
				<div className="mt-4 flex justify-end">
					<Button onClick={() => setShowSearch(!showSearch)}>
						{showSearch ? 'Batal' : 'Tambah Peserta'}
					</Button>
				</div>

				{showSearch && (
					<div className="space-y-4">
						<div className="my-4 flex items-center gap-2">
							<Input
								value={mahasiswaSearch}
								onChange={(e) =>
									setMahasiswaSearch(e.target.value)
								}
								placeholder="Cari NIM mahasiswa..."
							/>
							<Button onClick={handleSearchMahasiswa}>
								Search
							</Button>
						</div>

						{isSearching ? (
							<div className="mt-4 flex items-center justify-center">
								<Loader2 className="h-6 w-6 animate-spin text-gray-500" />
							</div>
						) : mahasiswaResult ? (
							<Table className="">
								<TableHeader>
									<TableRow>
										<TableHead>Nama</TableHead>
										<TableHead>NIM</TableHead>
										<TableHead>Prodi</TableHead>
										<TableHead>Aksi</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>
											{mahasiswaResult.name}
										</TableCell>
										<TableCell>
											{mahasiswaResult.nim}
										</TableCell>
										<TableCell>
											{mahasiswaResult.prodi}
										</TableCell>
										<TableCell>
											<Button
												size="sm"
												onClick={handleAddAnggota}
											>
												Simpan
											</Button>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						) : (
							searchError && (
								<div className="mt-4 text-center text-red-500">
									{searchError}
								</div>
							)
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
