<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'school_name' => 'Test User', // <--- FIX: Use the actual column from your migration
            'email' => 'test@example.com',
            'school_id' => 'admin_id',    // <--- You must also provide the primary key!
            'status' => 'active',
        ]);
    }
}
