<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->string('doc_id')->primary();
            $table->string('operation_id');
            $table->string('school_id');
            $table->string('doc_title');
            $table->string('original_pdf_hash');
            $table->string('updated_pdf_hash')->nullable();
            $table->string('original_pdf_path')->nullable();
            $table->string('updated_pdf_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
