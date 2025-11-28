<?php

namespace App\Helpers;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class IDGenerator
{
    public static function generateSchoolID()
    {
        $maxAttempts = 10;
        $attempt = 0;
        
        while ($attempt < $maxAttempts) {
            $random = str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);
            $schoolId = "sh-{$random}";
            
            // Check if this school ID already exists
            $exists = User::where('school_id', $schoolId)->exists();
            
            if (!$exists) {
                return $schoolId;
            }
            
            $attempt++;
        }
        
        throw new \Exception('Failed to generate unique school ID after ' . $maxAttempts . ' attempts');
    }

    public static function generateOperationID()
    {
        $random = str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);
        return "op-{$random}";
    }

    public static function generateDocumentID()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $id = '';
        for ($i = 0; $i < 8; $i++) {
            $id .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $id;
    }
} 