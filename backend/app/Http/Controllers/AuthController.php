<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Register a new school (user)
    public function register(Request $request)
    {
        $request->validate([
            'school_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        // Check if email already exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'email alredy exists login insted'
            ], 409);
        }

        $user = User::create([
            'school_id' => 'SCH-' . uniqid(),
            'school_name' => $request->school_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 'active',
            'number_of_uploads' => 0
        ]);

        return response()->json([
            'message' => 'Login successful',
            'school_id' => $user->school_id,
            'school_name' => $user->school_name
        ]);
    }

    // Login the school
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user is active
        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'please contenct support , your accountis not active'
            ], 403);
        }

        // Delete any existing tokens for this user
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'school_id' => $user->school_id,
            'school_name' => $user->school_name,
            'token' => $user->school_id . '|' . explode('|', $token)[1]
        ]);
    }

    // Logout the school
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    // Forget password endpoint
    public function forgetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        return response()->json([
            'message' => 'Request sent to support successfully'
        ], 200);
    }
}
