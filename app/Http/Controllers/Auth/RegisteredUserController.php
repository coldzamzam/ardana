<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RoleType;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $roles = RoleType::whereNotIn('role_name', ['superadmin', 'mahasiswa'])->get();
        return Inertia::render('auth/register', [
            'roles' => $roles,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:role_types,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'email_verified_at' => now(),
        ]);

        $selectedRole = RoleType::find($request->role_id);
        $user->roles()->attach($selectedRole->id, ['id' => Str::uuid()]);

        // Automatically assign 'dosen' role if 'sekjur' or 'kajur' is selected
        if (in_array($selectedRole->role_name, ['sekjur', 'kajur'])) {
            $dosenRole = RoleType::where('role_name', 'dosen')->first();
            if ($dosenRole) {
                $user->roles()->attach($dosenRole->id, ['id' => Str::uuid()]);
            }
        }

        event(new Registered($user));

        return redirect(route('register'))->with('success', 'User created successfully.');
    }
}
