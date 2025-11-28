<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OperationController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\VerifyPdfController;
use App\Http\Controllers\FileDownloadController;
use App\Http\Controllers\PublicVerifyController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Authentication Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('forget-password', [AuthController::class, 'forgetPassword']);

// Dashboard Routes (add more routes later based on your needs)
Route::middleware('auth:sanctum')->group(function () {
    // Route to get the user (school) details
    Route::get('account', [DashboardController::class, 'account']);
    
    // Route for creating certificate or document
    Route::post('/certificates', [DashboardController::class, 'createCertificate']);
    Route::post('/documents', [DashboardController::class, 'createDocument']);

    // Route to delete certificate by ID
    // Route::delete('/delete-certificate/{id}', [DashboardController::class, 'deleteCertificate']);
    
    // Route to fetch uploaded history (paginated)
    Route::get('uploaded-history-certificates', [DashboardController::class, 'uploadedHistoryCertificates']);
    Route::get('uploaded-history-documents', [DashboardController::class, 'uploadedHistoryDocuments']);

    // Operation routes
    Route::post('/file/delete', [OperationController::class, 'deleteFile']);
    Route::get('/operation/{id}', [OperationController::class, 'getOperationDetails']);
    Route::get('/history', [OperationController::class, 'history']);

    // Account routes
    Route::post('/account/password/change', [AccountController::class, 'changePassword']);
    Route::get('/account/uploads/count', [AccountController::class, 'getUploadCount']);
    Route::post('/account/save-text', [AccountController::class, 'saveText']);
    Route::get('/account/test-groq', [AccountController::class, 'testGroqApi']);

    // PDF verification route
    Route::post('/file/verify/pdf', [VerifyPdfController::class, 'verifyPdf']);
    Route::get('/file/verify/{id}', [VerifyPdfController::class, 'verifyById']);

});

// File download routes
Route::get('/download/document/{type}/{id}', [FileDownloadController::class, 'downloadDocument'])->where('type', 'original|updated');
Route::get('/download/certificate/{type}/{id}', [FileDownloadController::class, 'downloadCertificate'])->where('type', 'original|updated');

// Public verification routes (no authentication required)
Route::post('/public/verify/pdf', [PublicVerifyController::class, 'verifyPdf']);
Route::get('/public/verify/{id}', [PublicVerifyController::class, 'verifyById']);
