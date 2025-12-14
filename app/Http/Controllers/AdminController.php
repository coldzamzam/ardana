<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();

        return Inertia::render('Admin/Index', [
            'faqs' => $faqs,
        ]);
    }
}
