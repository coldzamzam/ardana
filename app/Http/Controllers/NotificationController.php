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
            ->get()
            ->map(function ($notification) {
                // Pastikan 'data' selalu menjadi array/objek
                if (is_string($notification->data)) {
                    $notification->data = json_decode($notification->data, true);
                }
                return $notification;
            });

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

