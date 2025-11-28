<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Operation;
use App\Models\Certificate;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Helpers\OpIdGenerator;
use App\Helpers\CertificateIdGenerator;
use App\Helpers\DocIdGenerator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        return response()->json([
            'message' => 'hello'
        ]);
    }

    /**
     * Get the authenticated user's account details
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function account(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'school_id' => $user->school_id,
            'school_name' => $user->school_name,
            'email' => $user->email,
            'status' => $user->status
        ]);
    }

    /**
     * Creates a new certificate record and logs it to the blockchain.
     * MODIFIED: To use frontend fields: 'name', 'lname', 'certificate_title', 'pdf_file'.
     */
    public function createCertificate(Request $request)
    {
        try {
            $request->validate([
                'pdf_file' => 'required|file|mimes:pdf',
                'name' => 'required|string',
                'lname' => 'required|string',
                'certificate_title' => 'required|string',
            ]);

            $user = $request->user();
            $file = $request->file('pdf_file');
            $certificateId = CertificateIdGenerator::generate();
            
            $opId = OpIdGenerator::generate(); 

            $opIdForLog = 'op-' . str_replace('op-', '', $opId);

            $originalHash = hash_file('sha256', $file->getRealPath());
            
            $fileName = $originalHash . '_original.pdf';
            
            $filePath = $file->storeAs('private/certificates', $fileName, 'local'); 
            $processedHash = $originalHash;

            $certificate = Certificate::create([
                'certificate_id' => $certificateId,
                'name' => $request->input('name'), 
                'certificate_title' => $request->input('certificate_title'), 
                'lname' => $request->input('lname'), 
                'grade' => 'N/A', 
                'school_id' => $user->school_id,
                'operation_id' => $opId, 
                'original_pdf_path' => $filePath, 
                'original_pdf_hash' => $originalHash,
                'processed_pdf_path' => $filePath,
                'processed_pdf_hash' => $processedHash,
                'status' => 'active',
            ]);

            Operation::create([
                'operation_id' => $opId,
                'type' => 'insert_certificate',
                'certificate_id' => $certificateId,
                'school_id' => $user->school_id,
                'date_of_operation' => now(),
            ]);

            $timestampParts = now()->format('Y_m_d_H_i_s');

            $blockchainPath = storage_path('app/blockchain/txt.txt');
            $logEntry = $opIdForLog . "_" . $user->school_id . "_" . $certificateId . "_" . $originalHash . "_" . $processedHash . "_" . $timestampParts; 

            File::append($blockchainPath, $logEntry . "\n");

            $user->increment('number_of_uploads');

            return response()->json([
                'message' => 'Certificate created and logged successfully',
                'certificate_id' => $certificateId,
                'original_hash' => $originalHash,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error in createCertificate', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['message' => 'Failed to create certificate.'], 500);
        }
    }


    /**
     * Creates a new document record.
     * MODIFIED: To use frontend fields: 'doc_title' (instead of 'name') and 'pdf_file' (instead of 'file').
     * The 'type' field was removed per front-end structure.
     */
    public function createDocument(Request $request)
    {
        try {
            $request->validate([
                'pdf_file' => 'required|file|mimes:pdf',
                'doc_title' => 'required|string',
            ]);

            $user = $request->user();
            $file = $request->file('pdf_file');
            $docId = DocIdGenerator::generate();

            $opId = OpIdGenerator::generate();
            
            $opIdForLog = 'op-' . str_replace('op-', '', $opId);

            $originalHash = hash_file('sha256', $file->getRealPath());

            $fileName = $originalHash . '_original.pdf';
            $filePath = $file->storeAs('private/documents', $fileName, 'local'); 
            $processedHash = $originalHash;

            $document = Document::create([
                'doc_id' => $docId,
                'doc_title' => $request->input('doc_title'), 
                'type' => 'pdf', 
                'school_id' => $user->school_id,
                'operation_id' => $opId, 
                'original_pdf_path' => $filePath, 
                'original_pdf_hash' => $originalHash,
                'processed_pdf_path' => $filePath,
                'processed_pdf_hash' => $processedHash,
                'status' => 'active', 
            ]);

            Operation::create([
                'operation_id' => $opId,
                'type' => 'insert_document',
                'doc_id' => $docId,
                'school_id' => $user->school_id,
                'date_of_operation' => now(),
            ]);
            
            $timestampParts = now()->format('Y_m_d_H_i_s');

            $blockchainPath = storage_path('app/blockchain/txt.txt');
            $logEntry = $opIdForLog . "_" . $user->school_id . "_" . $docId . "_" . $originalHash . "_" . $processedHash . "_" . $timestampParts; 
            
            File::append($blockchainPath, $logEntry . "\n");

            $user->increment('number_of_uploads');

            return response()->json([
                'message' => 'Document created and logged successfully',
                'document_id' => $docId,
                'original_hash' => $originalHash,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error in createDocument', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['message' => 'Failed to create document.'], 500);
        }
    }


    public function uploadedHistoryCertificates(Request $request)
    {
        try {
            $request->validate([
                'per_page' => 'integer|min:1|max:100',
                'page' => 'integer|min:1',
                'school_id' => 'required|string|exists:users,school_id'
            ]);

            $user = auth()->user();
            
            if ($user->school_id !== $request->school_id) {
                return response()->json([
                    'message' => 'Unauthorized: School ID does not match the authenticated user'
                ], 403);
            }

            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $schoolId = $request->school_id;

            $query = DB::table('ai_sql_view')
                ->select([
                    'cert_id',
                    'name',
                    'lname',
                    'certificate_title',
                    'operation_id',
                    'type',
                    'date_of_operation'
                ])
                ->where('school_id', $schoolId)
                ->whereNotNull('cert_id')  
                ->orderBy('date_of_operation', 'desc');

            $results = $query->paginate($perPage, ['*'], 'page', $page);

            $results->getCollection()->transform(function ($item) {
                return [
                    'certificate_id' => $item->cert_id,
                    'name' => $item->name,
                    'lname' => $item->lname,
                    'certificate_title' => $item->certificate_title,
                    'operation_id' => $item->operation_id,
                    'type' => $item->type,
                    'date_of_operation' => $item->date_of_operation
                ];
            });

            return response()->json([
                'message' => 'Certificate history retrieved successfully',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching certificate history', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'An error occurred while fetching the certificate history'
            ], 500);
        }
    }

    public function uploadedHistoryDocuments(Request $request)
    {
        try {
            $request->validate([
                'per_page' => 'integer|min:1|max:100',
                'page' => 'integer|min:1',
                'school_id' => 'required|string|exists:users,school_id'
            ]);

            $user = auth()->user();
            
            if ($user->school_id !== $request->school_id) {
                return response()->json([
                    'message' => 'Unauthorized: School ID does not match the authenticated user'
                ], 403);
            }

            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $schoolId = $request->school_id;

           $query = DB::table('ai_sql_view')
            ->select([
            'doc_id',
            'doc_title', 
            'operation_id', 
            'type', 
            'date_of_operation' 
            ])
            ->where('school_id', $schoolId)
            ->whereNotNull('doc_id')
            ->orderBy('date_of_operation', 'desc');


            $results = $query->paginate($perPage, ['*'], 'page', $page);

            $results->getCollection()->transform(function ($item) {
                return [
                    'document_id' => $item->doc_id,
                    'document_title' => $item->doc_title,
                    'operation_id' => $item->operation_id,
                    'type' => $item->type,
                    'date_of_operation' => $item->date_of_operation
                ];
            });

            return response()->json([
                'message' => 'Document history retrieved successfully',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching document history', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'An error occurred while fetching the document history'
            ], 500);
        }
    }

    // public function createCertCopy(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'name' => 'required|string',
    //             'lname' => 'required|string',
    //             'certificate_title' => 'required|string',
    //             'pdf_file' => 'required|file|mimes:pdf|max:10240'
    //         ]);

    //         // Generate IDs
    //         $operationId = \App\Helpers\CertCopyOpIdGenerator::generate();
    //         $certId = \App\Helpers\CertificateIdGenerator::generate();
            
    //         // Store original PDF
    //         $originalFile = $request->file('pdf_file');
    //         $originalPath = 'blockchain/' . $certId . '_copy_original_' . time() . '.pdf';
    //         $originalFullPath = base_path($originalPath);
            
    //         // Ensure directory exists
    //         $directory = dirname($originalFullPath);
    //         if (!file_exists($directory)) {
    //             mkdir($directory, 0755, true);
    //         }
            
    //         // Store the file
    //         $originalFile->move($directory, basename($originalFullPath));
            
    //         // Calculate hash of original PDF
    //         $originalHash = hash_file('sha256', $originalFullPath);
            
    //         // Create certificate record first (SET STATUS TO COMPLETED)
    //         $certificate = Certificate::create([
    //             'certificate_id' => $certId,
    //             'operation_id' => $operationId,
    //             'school_id' => auth()->user()->school_id,
    //             'name' => $request->name,
    //             'lname' => $request->lname,
    //             'certificate_title' => $request->certificate_title,
    //             'original_pdf_path' => $originalPath,
    //             'original_pdf_hash' => $originalHash,
    //             // Set processed to original since no processing occurs
    //             'processed_pdf_path' => $originalPath,
    //             'processed_pdf_hash' => $originalHash,
    //             'status' => 'completed',
    //         ]);
            
    //         // Create operation record after certificate exists
    //         $operation = Operation::create([
    //             'operation_id' => $operationId,
    //             'school_id' => auth()->user()->school_id,
    //             'certificate_id' => $certId,
    //             'doc_id' => null,
    //             'type' => 'insert_certificate',
    //             'date_of_operation' => now()
    //         ]);

    //         // Increment user's upload count
    //         $user = auth()->user();
    //         $user->increment('number_of_uploads');
            
            
    //         return response()->json([
    //             'message' => 'Certificate copy created successfully',
    //             'certificate_id' => $certId
    //         ]);
            
    //     } catch (\Exception $e) {
    //         Log::error('Certificate copy creation failed', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
            
    //         return response()->json([
    //             'message' => 'Failed to create certificate copy: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }

}