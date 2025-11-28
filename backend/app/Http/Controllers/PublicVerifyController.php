<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VerificationAttempt;
use App\Models\Operation;
use App\Models\Certificate;
use App\Models\Document;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class PublicVerifyController extends Controller
{
/**
     * Verifies a document or certificate ID against the blockchain file.
     * @param string $id The document or certificate ID.
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyById($id)
    {
        try {
            $ipAddress = request()->ip();

            if (VerificationAttempt::hasExceededRateLimit($ipAddress, 'id')) {
                return response()->json([
                    'message' => 'Rate limit exceeded. Please try again later.',
                    'error' => 'RATE_LIMIT_EXCEEDED'
                ], 429);
            }

            $cleanUrlId = preg_replace('/[^a-zA-Z0-9]/', '', trim(str_replace(' ', '', $id)));

            $attempt = VerificationAttempt::recordAttempt($ipAddress, 'id', $id);

            $blockchainData = $this->getBlockchainData($cleanUrlId);
            
            $fileType = null;
            $fileRecord = null;
            $idColumn = null;

            $anyOperation = Operation::where('certificate_id', $cleanUrlId)
                ->orWhere('doc_id', $cleanUrlId)
                ->orderBy('created_at', 'asc')
                ->first();

            if (!$anyOperation) {
                return response()->json([
                    'message' => 'Certificate ID not found in our system.',
                    'error' => 'NOT_FOUND'
                ], 404);
            }
            
            $fileType = $anyOperation->certificate_id === $cleanUrlId ? 'Certificate' : 'Document'; 
            $idColumn = ($fileType === 'Certificate') ? 'certificate_id' : 'doc_id';
            
            $fileTypeSlug = strtolower($fileType);

            $deleteOperation = Operation::where($idColumn, $cleanUrlId)
                ->whereIn('type', ['delete_file', 'delete_document'])
                ->where('created_at', '>=', $anyOperation->created_at)
                ->first();
            
            if ($deleteOperation) {
                return response()->json([
                    'message' => 'File found in the system (hash matched), but its status is currently set to inactive (deleted or revoked).',
                    'file_type' => $fileType, 
                    'file_id' => $cleanUrlId, 
                    'status' => 'Inactive',
                    'blockchain_data' => $blockchainData,
                    'download_links' => [], 
                ], 200); 
            }

            if ($fileType === 'Certificate') {
                $fileRecord = Certificate::where('certificate_id', $cleanUrlId)->first();
            } else {
                $fileRecord = Document::where('doc_id', $cleanUrlId)->first();
            }

            if ($fileRecord) {
                $downloadLinks = [
                    'original' => url("/api/download/{$fileTypeSlug}/original/{$cleanUrlId}"),
                    'updated' => url("/api/download/{$fileTypeSlug}/updated/{$cleanUrlId}"), 
                ]; 
                
                return response()->json([
                    'message' => 'Verification successful. This file is 100% authentic and active.',
                    'file_type' => $fileType,
                    'file_id' => $cleanUrlId,
                    'status' => 'Active', 
                    'download_links' => $downloadLinks, 
                    'blockchain_data' => $blockchainData,
                    'file_details' => $fileRecord->toArray(),
                ], 200);
            } else {
                return response()->json([
                    'message' => 'File found in the system (hash matched), but its status is currently set to inactive (live record missing).',
                    'file_type' => $fileType, 
                    'file_id' => $cleanUrlId, 
                    'status' => 'Inactive', 
                    'blockchain_data' => $blockchainData,
                    'download_links' => [], 
                ], 200); 
            }

        } catch (\Exception $e) {
            Log::error('Public Verification Error (verifyById)', ['error' => $e->getMessage(), 'id' => $id]);
            return response()->json(['message' => 'An unexpected server error occurred during verification. Please check server logs.'], 500);
        }
    }

    /**
     * Verifies an uploaded PDF file's hash against the blockchain (Most secure method).
     */
    public function verifyPdf(Request $request)
    {
        try {
            $request->validate(['file' => 'required|file|mimes:pdf']);

            $uploadedFile = $request->file('file');
            $uploadedHash = hash_file('sha256', $uploadedFile->getRealPath());

            $ipAddress = request()->ip();
            if (VerificationAttempt::hasExceededRateLimit($ipAddress, 'hash')) {
                return response()->json(['message' => 'Rate limit exceeded. Please try again later.', 'error' => 'RATE_LIMIT_EXCEEDED'], 429);
            }

            $attempt = VerificationAttempt::recordAttempt($ipAddress, 'hash', substr($uploadedHash, 0, 20));

            $blockchainData = $this->getFileDataByHash($uploadedHash);

            if (!$blockchainData) {
                $attempt->update(['was_successful' => false]);
                return response()->json(['message' => 'The hash of this file is not in our system. The file may be fraudulent or modified.'], 404);
            }

            $fileId = trim($blockchainData['file_id']);
            $idLength = strlen($fileId);
            $operation = null;
            $fileType = null;

            if ($idLength === 8) {
                $operation = Operation::where('certificate_id', $fileId)
                    ->where('type', 'insert_certificate')
                    ->first();
                if ($operation) {
                    $fileType = 'certificate';
                }
            }
            
            if (!$operation) {
                $docOperation = Operation::where('doc_id', $fileId)
                    ->where('type', 'insert_document')
                    ->first();
                if ($docOperation) {
                    $operation = $docOperation;
                    $fileType = 'document';
                }
            }

            if (!$operation) {
                $attempt->update(['was_successful' => false]);
                return response()->json([
                    'message' => 'File found in the system (hash matched), but it is currently inactive (e.g., deleted or revoked).',
                    'blockchain_data' => $blockchainData,
                ], 404);
            }

            // Determine the slug for the URL based on file type
            $fileTypeSlug = $fileType; 
            
            // Construct download links using the existing /api/download/ routes
            $downloadLinks = [
                'original' => url("/api/download/{$fileTypeSlug}/original/{$fileId}"),
                'updated' => url("/api/download/{$fileTypeSlug}/updated/{$fileId}")
            ];

            $attempt->update(['was_successful' => true]);
            return response()->json([
                'message' => 'Verification SUCCESSFUL. This file is 100% authentic and active.',
                'hash_match' => $uploadedHash, 
                'blockchain_data' => $blockchainData,
                'file_type' => $fileType,
                'file_id' => $fileId,
                'download_links' => $downloadLinks 
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error in public verify PDF', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['message' => 'An error occurred while processing your request'], 500);
        }
    }
    /**
     * Searches the blockchain log (txt.txt) specifically by the File Hash.
     */
    private function getFileDataByHash(string $fileHash): ?array
    {
        $blockchainPath = storage_path('app/blockchain/txt.txt');

        if (!File::exists($blockchainPath)) {
            Log::error("Blockchain file not found at: " . $blockchainPath);
            return null;
        }

        $content = File::get($blockchainPath);

        $content = str_replace("\r", '', $content);
        $content = iconv("ISO-8859-1", "UTF-8//IGNORE", $content);

        $lines = array_filter(array_map('trim', explode("\n", $content)));

        $fileHash = trim($fileHash);
        $cleanFileHash = preg_replace('/[^a-fA-F0-9]/', '', $fileHash);

        foreach ($lines as $line) {
            $parts = explode('_', $line);

            $parts = array_filter($parts, function($part) {
                return $part !== '';
            });
            $parts = array_values($parts); 
            
            if (count($parts) >= 5) { 

                $originalHash = trim($parts[3] ?? ''); 
                $processedHash = trim($parts[4] ?? ''); 
                $fileId = trim($parts[2] ?? ''); 

                $cleanOriginalHash = preg_replace('/[^a-fA-F0-9]/', '', $originalHash);
                $cleanProcessedHash = preg_replace('/[^a-fA-F0-9]/', '', $processedHash);

                if (strtolower($cleanOriginalHash) === strtolower($cleanFileHash) || strtolower($cleanProcessedHash) === strtolower($cleanFileHash)) {
                    
                    return [
                        'operation_id' => trim($parts[0] ?? ''),
                        'school_id' => trim($parts[1] ?? ''), 
                        'file_id' => $fileId,
                        'original_hash' => $originalHash,
                        'processed_hash' => $processedHash,
                    ];
                }
            }
        }
        return null;
    }

    /**
     * Searches the blockchain log (txt.txt) specifically by the File ID.
     */
    private function getBlockchainData($id)
    {
        $blockchainPath = storage_path('app/blockchain/txt.txt');

        if (!file_exists($blockchainPath)) {
            return [];
        }

        $blockchainContent = File::get($blockchainPath);

        $blockchainContent = str_replace("\r", '', $blockchainContent);
        $blockchainContent = iconv("ISO-8859-1", "UTF-8//IGNORE", $blockchainContent);

        $lines = array_filter(array_map('trim', explode("\n", $blockchainContent)));

        $cleanInputId = preg_replace('/[^a-zA-Z0-9]/', '', trim(str_replace(' ', '', $id)));

        foreach ($lines as $line) {
            $clean_line = trim($line);
            if (empty($clean_line)) continue;

            $parts = explode('_', $clean_line);

            $parts = array_filter($parts, function($part) {
                return $part !== '';
            });
            $parts = array_values($parts); 
            $partsCount = count($parts);

            if ($partsCount >= 5) {
                $fileIdInLog = trim($parts[2]); 
                $cleanFileIdInLog = preg_replace('/[^a-zA-Z0-9]/', '', $fileIdInLog);

                if ($cleanFileIdInLog === $cleanInputId) {
                    return [
                        'operation_id' => trim($parts[0]),
                        'school_id' => trim($parts[1]), 
                        'file_id' => $cleanInputId,
                        'original_hash' => trim($parts[3]),
                        'processed_hash' => trim($parts[4])
                    ];
                }
             }}

        return [];
    }
}