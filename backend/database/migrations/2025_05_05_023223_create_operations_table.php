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
        Schema::create('operations', function (Blueprint $table) {
            $table->string('operation_id')->primary();
            $table->string('school_id');
            $table->string('doc_id')->nullable();
            $table->string('certificate_id')->nullable();
            $table->enum('type', ['insert_certificate', 'insert_document', 'delete_file']);
            $table->timestamp('date_of_operation')->nullable();
            $table->timestamps();

            // Add foreign key constraints
            $table->foreign('school_id')
                  ->references('school_id')
                  ->on('users')
                  ->onDelete('cascade');

            $table->foreign('doc_id')
                  ->references('doc_id')
                  ->on('documents')
                  ->onDelete('set null');

            $table->foreign('certificate_id')
                  ->references('certificate_id')
                  ->on('certificates')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operations');
    }
};
