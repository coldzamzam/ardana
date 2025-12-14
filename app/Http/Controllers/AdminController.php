<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\KegiatanType;
use App\Models\MataKuliah;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        $kegiatanTypes = KegiatanType::all();
        $mataKuliahs = MataKuliah::all();

        return Inertia::render('Admin/Index', [
            'faqs' => $faqs,
            'kegiatanTypes' => $kegiatanTypes,
            'mataKuliahs' => $mataKuliahs,
        ]);
    }
}
