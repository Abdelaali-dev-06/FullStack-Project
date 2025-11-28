<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class CustomPersonalAccessToken extends SanctumPersonalAccessToken
{
    public static function findToken($token)
    {
        try {
            \Log::info('Token verification started', ['raw_token' => $token]);

            if (empty($token)) {
                \Log::error('Token verification failed: Empty token provided');
                return null;
            }

            // Check if token contains the separator
            if (strpos($token, '|') === false) {
                \Log::error('Token verification failed: Invalid token format', ['token' => $token]);
                return null;
            }

            // Split the token
            [$schoolId, $token] = explode('|', $token, 2);
            
            \Log::info('Token split', [
                'school_id' => $schoolId,
                'token_part' => $token
            ]);

            // Find the user with this school_id
            $user = User::where('school_id', $schoolId)->first();
            if (!$user) {
                \Log::error('Token verification failed: User not found', [
                    'school_id' => $schoolId,
                    'token' => $token
                ]);
                return null;
            }

            \Log::info('User found', [
                'user_id' => $user->id,
                'school_id' => $user->school_id
            ]);
            
            // Find all tokens for this user
            $tokens = static::where('tokenable_id', $user->id)->get();
            \Log::info('User tokens found', [
                'count' => $tokens->count(),
                'token_ids' => $tokens->pluck('id')->toArray()
            ]);

            // Find the matching token
            $tokenInstance = null;
            foreach ($tokens as $t) {
                if (hash('sha256', $token) === $t->token) {
                    $tokenInstance = $t;
                    break;
                }
            }

            if (!$tokenInstance) {
                \Log::error('Token verification failed: Token not found', [
                    'user_id' => $user->id,
                    'school_id' => $schoolId,
                    'token_hash' => hash('sha256', $token),
                    'available_tokens' => $tokens->pluck('token')->toArray()
                ]);
                return null;
            }

            // Log successful token verification
            \Log::info('Token verification successful', [
                'user_id' => $user->id,
                'school_id' => $schoolId,
                'token_id' => $tokenInstance->id
            ]);

            return $tokenInstance;
        } catch (\Exception $e) {
            \Log::error('Token verification error', [
                'error' => $e->getMessage(),
                'token' => $token,
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    public function getTokenAttribute()
    {
        return $this->tokenable->school_id . '|' . $this->attributes['token'];
    }
} 