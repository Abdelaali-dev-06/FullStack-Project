<?php

namespace App\Http\Controllers;

use App\Models\Operation;
use App\Models\Certificate;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File; 
use Illuminate\Support\Facades\Storage; 
use Illuminate\Support\Facades\Log; 
use App\Models\User; 
use Carbon\Carbon; 

class OperationController extends Controller
{
public function deleteFile(Request $request)
{
    $operationIdToReturn = null; 

    try {
        $request->validate([
            'id' => 'required|string|min:8|max:9' 
        ]);

        $fileId = trim($request->id);
        $user = auth()->user();
        $userSchoolId = $user->school_id;
        
        $record = Certificate::where('certificate_id', $fileId)
                            ->where('school_id', $userSchoolId)
                            ->first();

        $isCertificate = true;
        $operation = null;

        if ($record) {
             // Certificate found
             $operation = Operation::where('certificate_id', $fileId)->where('school_id', $userSchoolId)->first();
             
        } else {
            $record = Document::where('doc_id', $fileId)
                             ->where('school_id', $userSchoolId)
                             ->first();
            $isCertificate = false;
            
            if ($record) {
                 // Document found
                 $operation = Operation::where('doc_id', $fileId)->where('school_id', $userSchoolId)->first();
            }
        }

        if (!$record || !$operation) {
            return response()->json(['message' => 'File or associated history not found, or you are not authorized to delete it.'], 404);
        }
        
        $operationIdToReturn = $operation->operation_id;
        
        $basePath = dirname(base_path()) . '/blockchain/'; 

        // Delete original file
        if ($record->original_pdf_path) {
            $originalFullPath = $basePath . $record->original_pdf_path;
            if (file_exists($originalFullPath)) {
                unlink($originalFullPath); 
            }
        }

        $record->update([
            'original_pdf_path' => null,
            'processed_pdf_path' => null,
            'updated_pdf_path' => null,
            'hash_original' => null,
            'hash_updated' => null,
        ]);
        
        $operation->update([
            'type' => 'delete_file',
            'date_of_operation' => Carbon::now(),
            'original_pdf_hash' => null, 
            'processed_pdf_hash' => null,
        ]);


        $user->decrement('number_of_uploads');

        return response()->json([
            'message' => 'File deleted successfully and history updated.',
            'operation_id' => $operationIdToReturn 
        ], 200);

    } catch (\Exception $e) {
        // Log the error for debugging
        Log::error('Error in deleteFile', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'request_data' => $request->all()
        ]);
        
        return response()->json([
            'message' => 'Failed to delete file.'
        ], 500);
    }
}

    public function getOperationDetails($id)
{
    try {
        $userSchoolId = auth()->user()->school_id;

        $operation = Operation::where('operation_id', $id)
                              ->where('school_id', $userSchoolId)
                              ->first();

        if (!$operation) {
            return response()->json(['message' => 'Operation not found or unauthorized.'], 404);
        }
        
        $details = $operation->toArray();
        $fileRecord = null;
        $fileType = null;

        if ($operation->certificate_id) {
            $fileType = 'certificate';
            $fileRecord = Certificate::where('certificate_id', $operation->certificate_id)->first();
        } elseif ($operation->doc_id) {
            $fileType = 'document';
            $fileRecord = Document::where('doc_id', $operation->doc_id)->first();
        }

        if ($fileRecord) {
            $details['file_details'] = $fileRecord->toArray();
        } else {
            $details['file_details'] = ['message' => 'Associated file details are missing (possibly deleted).'];
        }

        $details['file_type'] = $fileType;
        
        return response()->json([
            'message' => 'Operation details retrieved successfully',
            'data' => $details
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Error fetching operation details', ['error' => $e->getMessage(), 'id' => $id]);
        return response()->json(['message' => 'Failed to retrieve operation details.'], 500);
    }
}


    public function history(Request $request)
    {
        $schoolId = Auth::user()->school_id;
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1'
        ]);

        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        $operations = Operation::where('school_id', $schoolId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json($operations);
    }
}