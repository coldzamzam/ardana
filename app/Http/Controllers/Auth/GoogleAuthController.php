<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RoleType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('google_id', $googleUser->getId())->first();

        if ($user) {
            Auth::login($user);
        } else {
            $name = $googleUser->getName();
            // Remove " Mahasiswa PNJ" if it exists at the end of the name
            if (str_ends_with($name, ' Mahasiswa PNJ')) {
                $name = str_replace(' Mahasiswa PNJ', '', $name);
            }

            $newUser = User::create([
                'name' => $name,
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => bcrypt('password'), // You can set a random password
                'email_verified_at' => now(),
            ]);

            // Assign 'mahasiswa' role
            $mahasiswaRole = RoleType::where('role_name', 'mahasiswa')->first();
            if ($mahasiswaRole) {
                $newUser->roles()->attach($mahasiswaRole->id, ['id' => Str::uuid()]);
            }

            $newUser->markEmailAsVerified();

            Auth::login($newUser);
        }

        return redirect('/dashboard');
    }
}
