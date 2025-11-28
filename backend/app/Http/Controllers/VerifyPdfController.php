<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Operation;
use App\Models\Certificate; 
use App\Models\Document;  
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File; 

class VerifyPdfController extends Controller
{
  /**
  * Verifies a document or certificate ID against the blockchain file.
  * @param string $id The document or certificate ID.
  * @return \Illuminate\Http\JsonResponse
  */
  public function verifyById($id)
  {
    try {
      $cleanUrlId = preg_replace('/[^a-zA-Z0-9]/', '', trim(str_replace(' ', '', $id)));
      
      $blockchainPath = storage_path('app/blockchain/txt.txt');

      if (!file_exists($blockchainPath)) {
        return response()->json(['message' => 'Blockchain file not found.'], 500);
      }

      $blockchainContent = \Illuminate\Support\Facades\File::get($blockchainPath);
      
      $blockchainContent = str_replace("\r", '', $blockchainContent);
      $blockchainContent = iconv("ISO-8859-1", "UTF-8//IGNORE", $blockchainContent);

      $lines = array_filter(explode("\n", trim($blockchainContent)));
      
      if (empty($lines)) {
        return response()->json(['message' => 'Blockchain file is empty or unreadable after encoding/cleaning.'], 500);
      }

      $foundMatch = false;
      $blockchainData = null;

      foreach ($lines as $line) {
        $clean_line = trim($line); 
        if (empty($clean_line)) continue;
        
        $parts = explode('_', $clean_line);
        
        $parts = array_filter($parts, function($part) {
          return $part !== '';
        });
        $parts = array_values($parts); 
        
        if (count($parts) < 5) continue; 

        $cleanFileId = preg_replace('/[^a-zA-Z0-9]/', '', trim($parts[2]));
        
        if ($cleanFileId === $cleanUrlId) {
          $foundMatch = true;
          
          $blockchainData = [
            'operation_id' => trim($parts[0] ?? ''),
            'school_id' => trim($parts[1] ?? ''), 
            'file_id' => trim($parts[2] ?? ''),         
            'original_hash' => trim($parts[3] ?? ''),   
            'processed_hash' => trim($parts[4] ?? '')
          ];
          break;
        }
      }

      // --- Database and Response Logic ---
      
      if (!$foundMatch) {
        return response()->json([
          'message' => 'This ID is not in our system at all'
        ], 404);
      }

      $idLength = strlen($cleanUrlId);
      $fileId = $cleanUrlId;
      $downloadType = 'document';

      if ($idLength === 8) {
        $response = [
          'message' => 'Verification successful.',
          'status' => 200,
          'blockchain_data' => $blockchainData
        ];
        
        $operation = Operation::where('certificate_id', $fileId)
          ->where('type', 'insert_certificate')
          ->first();

        if ($operation) {
          $downloadType = 'certificate';
          $response['document_type'] = 'Certificate';
        } else {
          $operation = Operation::where('doc_id', $fileId)
            ->where('type', 'insert_document')
            ->first();
          
          if ($operation) {
            $downloadType = 'document';
            $response['document_type'] = 'Document';
          }
        }
        
        if ($operation) {
          $response['message'] = 'This PDF file exists in our system and it\'s active';
          $response['download_links'] = [
            'original' => url("/api/download/{$downloadType}/original/" . $fileId),
            'updated' => url("/api/download/{$downloadType}/updated/" . $fileId)
          ];
          return response()->json($response, 200);
        }
        
        return response()->json([
          'message' => 'This file was in our system but is currently inactive (deleted or revoked).',
          'file_id' => $fileId,
          'blockchain_data' => $blockchainData
        ], 404);

      } else {
        return response()->json([
          'message' => 'Invalid ID format provided.'
        ], 400); 
      }

    } catch (\Exception $e) {
      Log::error('ID verification failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
      return response()->json(['message' => 'An error occurred during ID verification.'], 500);
    }
  }


  /**
  * Verifies a PDF file's hash against the blockchain file.
  * @param \Illuminate\Http\Request $request
  * @return \Illuminate\Http\JsonResponse
  */
  public function verifyPdf(Request $request)
  {
    try {
      $request->validate(['file' => 'required|file|mimes:pdf']);

      $file = $request->file('file');
      $uploadedHash = strtolower(hash_file('sha256', $file->getRealPath()));

      $blockchainPath = storage_path('app/blockchain/txt.txt');

      if (!file_exists($blockchainPath)) {
        return response()->json(['message' => 'Blockchain file not found.'], 500);
      }

      $blockchainContent = File::get($blockchainPath);
      $blockchainContent = str_replace("\r", '', $blockchainContent); 
      $blockchainContent = iconv("ISO-8859-1", "UTF-8//IGNORE", $blockchainContent);
      $lines = array_filter(explode("\n", trim($blockchainContent)));
      
      if (empty($lines)) {
        return response()->json(['message' => 'Blockchain file is empty or unreadable.'], 500);
      }

      $foundMatch = false;
      $blockchainData = null;

      foreach ($lines as $line) {
        $clean_line = trim($line);
        if (empty($clean_line)) continue;
        
        $parts = explode('_', $clean_line);
        
        $parts = array_filter($parts, function($part) {
          return $part !== '';
        });
        $parts = array_values($parts);

        if (count($parts) < 5) continue; 
        
        $originalHash = trim($parts[3] ?? '');
        $processedHash = trim($parts[4] ?? '');

        if (strtolower($originalHash) === $uploadedHash || strtolower($processedHash) === $uploadedHash) {
          $foundMatch = true;
          
          $blockchainData = [
            'operation_id' => trim($parts[0] ?? ''),
            'school_id' => trim($parts[1] ?? ''), 
            'file_id' => trim($parts[2] ?? ''),         
            'original_hash' => $originalHash,
            'processed_hash' => $processedHash
          ];
          break;
        }
      }
      
      // --- Database and Response Logic ---
      
      if (!$foundMatch) {
        return response()->json([
          'message' => 'The hash of this file does not match any entry in our blockchain.',
          'uploaded_hash' => $uploadedHash
        ], 404);
      }
      
      $fileId = $blockchainData['file_id'];
      $idLength = strlen($fileId);
      $responseMessage = 'Verification successful. The file is active in our system.';
      $statusCode = 200;
      $fileType = 'Unknown';
      $downloadType = 'document';

      if ($idLength === 8) {
        
        $operation = null;
        
        $certOperation = Operation::where('certificate_id', $fileId)
          ->where('type', 'insert_certificate')
          ->first();

        if ($certOperation) {
          $fileType = 'certificate';
          $operation = $certOperation;
        } 
        
        $docOperation = Operation::where('doc_id', $fileId)
          ->where('type', 'insert_document')
          ->first();
        
        if (!$operation && $docOperation) {
          $fileType = 'document';
          $operation = $docOperation;
        }
        
        if (!$operation) {
          $responseMessage = ($fileType === 'Unknown' ? 'File' : $fileType) . ' found historically but is currently inactive (deleted or revoked).';
          $statusCode = 404; 
        }
        
        $downloadType = ($fileType === 'certificate' ? 'certificate' : 'document');

        return response()->json([
          'message' => ($statusCode === 200 ? $responseMessage : 'File not active: ' . $responseMessage),
          'file_id' => $fileId,
          'file_type' => $fileType,
          'blockchain_data' => $blockchainData,
          'download_links' => [
            'original' => url("/api/download/{$downloadType}/original/" . $fileId),
            'updated' => url("/api/download/{$downloadType}/updated/" . $fileId)
          ]
        ], $statusCode);

      } else {
        return response()->json([
          'message' => 'Invalid ID format in blockchain (File ID length mismatch).',
          'file_id' => $fileId,
          'blockchain_data' => $blockchainData
        ], 500);
      }

    } catch (\Exception $e) {
      Log::error('PDF verification failed', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);

      return response()->json([
        'message' => 'An error occurred while verifying the PDF'
      ], 500);
    }
  }
}