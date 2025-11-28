<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CreateStorageDirectories extends Command
{
    protected $signature = 'storage:create-directories';
    protected $description = 'Create necessary storage directories for PDFs';

    public function handle()
    {
        $directories = [
            'first_pdfs',
            'up_pdfs'
        ];

        foreach ($directories as $directory) {
            if (!Storage::exists($directory)) {
                Storage::makeDirectory($directory);
                $this->info("Created directory: {$directory}");
            } else {
                $this->info("Directory already exists: {$directory}");
            }
        }

        $this->info('All directories have been created successfully!');
    }
} 