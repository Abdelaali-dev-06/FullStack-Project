<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_address',
        'verification_type',
        'file_id',
        'file_hash',
        'is_authenticated',
        'school_id',
        'attempted_at',
        'was_successful'
    ];

    protected $casts = [
        'is_authenticated' => 'boolean',
        'was_successful' => 'boolean',
        'attempted_at' => 'datetime'
    ];

    // Check if an IP has exceeded the rate limit
    public static function hasExceededRateLimit($ipAddress, $type = 'id', $limit = 10, $timeWindow = 3600)
    {
        $count = self::where('ip_address', $ipAddress)
            ->where('verification_type', $type)
            ->where('attempted_at', '>=', now()->subSeconds($timeWindow))
            ->count();

        return $count >= $limit;
    }

    // Record a verification attempt
    public static function recordAttempt($ipAddress, $type, $fileId = null, $fileHash = null, $isAuthenticated = false, $schoolId = null)
    {
        return self::create([
            'ip_address' => $ipAddress,
            'verification_type' => $type,
            'file_id' => $fileId,
            'file_hash' => $fileHash,
            'is_authenticated' => $isAuthenticated,
            'school_id' => $schoolId,
            'attempted_at' => now()
        ]);
    }
} 