<?php

use App\Models\RoleType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('registration screen cannot be rendered by guest', function () {
    $response = $this->get(route('register'));
    $response->assertRedirect(route('login'));
});

test('registration screen can be rendered by superadmin', function () {
    $superadminRole = RoleType::create(['role_name' => 'superadmin']);
    $superadminUser = User::factory()->create();
    $superadminUser->roles()->attach($superadminRole->id, ['id' => \Illuminate\Support\Str::uuid()]);

    $response = $this->actingAs($superadminUser)->get(route('register'));

    $response->assertStatus(200);
});

test('new users can be registered by superadmin', function () {
    $superadminRole = RoleType::create(['role_name' => 'superadmin']);
    $superadminUser = User::factory()->create();
    $superadminUser->roles()->attach($superadminRole->id, ['id' => \Illuminate\Support\Str::uuid()]);

    $adminRole = RoleType::create(['role_name' => 'admin']);

    $response = $this->actingAs($superadminUser)->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role_id' => $adminRole->id,
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
    ]);
    $response->assertRedirect(route('register'));
});
