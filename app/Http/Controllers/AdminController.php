<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\KegiatanType;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        $kegiatanTypes = KegiatanType::all();

        return Inertia::render('Admin/Index', [
            'faqs' => $faqs,
            'kegiatanTypes' => $kegiatanTypes,
        ]);
    }
}
