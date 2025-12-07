<?php

namespace App\Http\Controllers;

use App\Models\DetailSubmisi;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function show(DetailSubmisi $detailSubmisi)
    {
        $detailSubmisi->load('pic');

        return Inertia::render('history/detail', [
            'detailSubmisi' => $detailSubmisi,
        ]);
    }
}
