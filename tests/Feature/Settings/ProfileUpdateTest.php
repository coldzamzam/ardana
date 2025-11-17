<?php

use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\RoleType;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('profile page is displayed', function () {
    $mahasiswaRole = RoleType::create(['role_name' => 'mahasiswa']);
    $user = User::factory()->create();
    $user->roles()->attach($mahasiswaRole->id, ['id' => \Illuminate\Support\Str::uuid()]);
    Mahasiswa::create(['user_id' => $user->id, 'nim' => '1234567890', 'prodi' => 'Teknik Informatika']);

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated for mahasiswa', function () {
    $mahasiswaRole = RoleType::create(['role_name' => 'mahasiswa']);
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);
    $user->roles()->attach($mahasiswaRole->id, ['id' => \Illuminate\Support\Str::uuid()]);
    $mahasiswa = Mahasiswa::create(['user_id' => $user->id, 'nim' => '1234567890', 'prodi' => 'Teknik Informatika']);

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'New Name',
            'prodi' => 'Teknik Multimedia Digital',
            'email' => 'should-not-change@example.com', // Attempt to change email
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    $mahasiswa->refresh();

    expect($user->name)->toBe('New Name');
    expect($user->email)->toBe('test@example.com'); // Email should not change
    expect($mahasiswa->prodi)->toBe('Teknik Multimedia Digital');
});

// test('email verification status is unchanged when the email address is unchanged', function () {
//     $user = User::factory()->create();

//     $response = $this
//         ->actingAs($user)
//         ->patch(route('profile.update'), [
//             'name' => 'Test User',
//             'email' => $user->email,
//         ]);

//     $response
//         ->assertSessionHasNoErrors()
//         ->assertRedirect(route('profile.edit'));

//     expect($user->refresh()->email_verified_at)->not->toBeNull();
// });

// test('user can delete their account', function () {
//     $user = User::factory()->create();

//     $response = $this
//         ->actingAs($user)
//         ->delete(route('profile.destroy'), [
//             'password' => 'password',
//         ]);

//     $response
//         ->assertSessionHasNoErrors()
//         ->assertRedirect(route('home'));

//     $this->assertGuest();
//     expect($user->fresh())->toBeNull();
// });

// test('correct password must be provided to delete account', function () {
//     $user = User::factory()->create();

//     $response = $this
//         ->actingAs($user)
//         ->from(route('profile.edit'))
//         ->delete(route('profile.destroy'), [
//             'password' => 'wrong-password',
//         ]);

//     $response
//         ->assertSessionHasErrors('password')
//         ->assertRedirect(route('profile.edit'));

//     expect($user->fresh())->not->toBeNull();
// });