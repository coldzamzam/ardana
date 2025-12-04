<?php

namespace App\Http\Controllers;

use App\Models\DatabaseNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notifications = DatabaseNotification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        Log::info('Data notifikasi yang diambil dari DB:', $notifications->toArray());

        return Inertia::render('notifikasi', [
            'notifications' => $notifications,
        ]);
    }

    // untuk bekerja dengan tabel `notifications` yang baru.
    public function markRead(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        Auth::user()->notifications()->whereIn('id', $request->ids)->update(['read_at' => now()]);
        return back();
    }

    public function markUnread(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        Auth::user()->notifications()->whereIn('id', $request->ids)->update(['read_at' => null]);
        return back();
    }

    public function destroy(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        Auth::user()->notifications()->whereIn('id', $request->ids)->delete();
        return back();
    }
}

