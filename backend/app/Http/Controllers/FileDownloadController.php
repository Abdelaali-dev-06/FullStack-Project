<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Certificate; 
use App\Models\Document; 

class FileDownloadController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except([
            'downloadDocument',
            'downloadCertificate'
        ]);
    }

    public function downloadDocument($type, $id)
    {
        return $this->retrieveAndDownloadFile($type, $id, 'document');
    }

    public function downloadCertificate($type, $id)
    {
        return $this->retrieveAndDownloadFile($type, $id, 'certificate');
    }

/**
 * Retrieves the file path from the database and initiates download.
 */
private function retrieveAndDownloadFile($type, $id, $fileType)
{
    try {
        if ($fileType === 'certificate') {
            $model = Certificate::class;
            $idColumn = 'certificate_id';
            $pathColumn = $type === 'original' ? 'original_pdf_path' : 'processed_pdf_path'; 
            $name = 'Certificate';
            $confirmedPhysicalSegment = 'private/private/certificates/'; 
        } elseif ($fileType === 'document') {
            $model = Document::class;
            $idColumn = 'doc_id';
            $pathColumn = $type === 'original' ? 'original_pdf_path' : 'processed_pdf_path'; 
            $name = 'Document';
            $confirmedPhysicalSegment = 'private/private/documents/'; 
        } else {
            return response()->json(['message' => 'Invalid file type.'], 400);
        }

        $query = $model::where($idColumn, $id);
        if (auth()->check()) {
            $query->where('school_id', auth()->user()->school_id);
        }
        $record = $query->first();

        if (!$record) {
            Log::warning("File record not found for ID/School combination.", ['id' => $id, 'fileType' => $fileType]);
            return response()->json(['message' => $name . ' not found'], 404);
        }

        $relativePath = $record->{$pathColumn};
        if (!$relativePath) {
            Log::error('File path is null in DB', ['id' => $id, 'column' => $pathColumn]);
            return response()->json(['message' => $name . ' file path not found in record.'], 404);
        }
        
        $fileName = basename(str_replace('\\', '/', $relativePath)); 
        $correctSegmentToAppend = $confirmedPhysicalSegment . $fileName; 
        $filePath = storage_path('app'); 
        
        $filePath .= DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $correctSegmentToAppend);

        Log::info('Final Path Check (SUCCESS PATH ATTEMPT):', [
            'ID' => $id, 
            'Path_Segment_Used_Input' => $correctSegmentToAppend, 
            'Full_File_Path_Attempted' => $filePath 
        ]);
        
        if (!file_exists($filePath) || !is_readable($filePath)) {
            Log::error('File not found on server (404 Error - PHYSICAL PATH FAILURE)', [
                'file_path_attempted' => $filePath,
                'path_segment_used_input' => $correctSegmentToAppend
            ]);
            return response()->json(['message' => $name . ' file found in database but cannot be accessed on server. Check file permissions.'], 404);
        }

        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Access-Control-Expose-Headers' => 'Content-Disposition',
            'Content-Length' => filesize($filePath)
        ];

        return response()->download($filePath, $fileName, $headers);

    } catch (\Exception $e) {
        Log::error('File download failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        return response()->json([
            'message' => "Failed to download file: " . $e->getMessage()
        ], 500);
    }
}
}