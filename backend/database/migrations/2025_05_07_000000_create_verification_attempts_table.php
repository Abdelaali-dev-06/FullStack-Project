<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verification_attempts', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address');
            $table->string('verification_type'); // 'id' or 'pdf'
            $table->string('file_id')->nullable(); // For ID verification
            $table->string('file_hash')->nullable(); // For PDF verification
            $table->boolean('is_authenticated')->default(false);
            $table->string('school_id')->nullable(); // For authenticated users
            $table->timestamp('attempted_at');
            $table->boolean('was_successful')->default(false);
            $table->timestamps();

            // Indexes for faster queries
            $table->index(['ip_address', 'verification_type', 'attempted_at'], 'verify_attempts_ip_type_time');
            $table->index('school_id', 'verify_attempts_school');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_attempts');
    }
}; 