<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\Operation;

class AccountController extends Controller
{
    /**
     * Change user's password
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8'
            ]);

            $user = Auth::user();

            Log::info('Password change attempt', [
                'user_id' => $user->id,
                'school_id' => $user->school_id,
                'current_password_provided' => $request->current_password,
                'stored_password_hash' => $user->password,
                'hash_check_result' => Hash::check($request->current_password, $user->password)
            ]);

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 400);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            $user->tokens()->delete();

            return response()->json([
                'message' => 'Password changed successfully. Please login again.'
            ]);

        } catch (\Exception $e) {
            Log::error('Password change failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to change password: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the number of uploads for the authenticated school
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUploadCount(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Calculate real count based on active operations
            $count = Operation::where('school_id', $user->school_id)
                ->whereIn('type', ['insert_certificate', 'insert_document'])
                ->count();

            // Update the user record to match
            if ($user->number_of_uploads !== $count) {
                $user->number_of_uploads = $count;
                $user->save();
            }
            
            return response()->json([
                'school_id' => $user->school_id,
                'number_of_uploads' => $count
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get upload count', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to get upload count: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save text and generate SQL query using AI
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveText(Request $request)
    {
        try {
            $request->validate([
                'text' => 'required|string'
            ]);

            $user = Auth::user();
            $schoolId = $user->school_id;

            $apiKey = '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';
            
            Log::info('Groq API Key check', [
                'key_length' => strlen($apiKey),
                'key_prefix' => substr($apiKey, 0, 10) . '...',
                'key_exists' => !empty($apiKey)
            ]);

            $prompt = "You are an SQL generator AI.
Your job is to generate safe SELECT-only SQL commands based on the user's request.

RULES:
* Only SELECT queries are allowed.
* Always add WHERE school_id = '{$schoolId}'.
* Never allow INSERT, UPDATE, DELETE, DROP, or any data modification.
* If the user asks for disallowed operations, return only: 11236511
* Return ONLY the SQL command, no text before or after
* If the query is not allowed, return only: 11236511
* If the requested data doesn't exist in our views, return only: 11236511
* Always select specific columns instead of using SELECT *
* Use meaningful column aliases for better readability
* IMPORTANT: Always add ORDER BY date_of_operation DESC when listing items
* Use JOINs when querying related data
* Add appropriate WHERE clauses for filtering
* Use LIKE for text searches with wildcards
* Use BETWEEN for date ranges
* Use IN for multiple values

IMPORTANT NOTES:
1. For any query that lists or shows items (like 'show me all', 'list', 'find all'):
   - Must include ORDER BY date_of_operation DESC
   - Must select specific columns, not SELECT *
2. For search queries:
   - Use LIKE with wildcards (%)
   - Include ORDER BY for consistent results
3. For date-based queries:
   - Use BETWEEN for ranges
   - Format dates as 'YYYY-MM-DD'
   - For 'today' queries, use: date_of_operation >= CURDATE() AND date_of_operation < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
4. For combined conditions:
   - Use AND for multiple conditions
   - Use OR for alternative conditions
   - Use parentheses for complex conditions

Schema:
Table operations(id, operation_id, type, certificate_id, doc_id, school_id, date_of_operation, created_at, updated_at)
Table documents(doc_id, name, type, school_id)
Table certificates(certificate_id, name, grade, school_id)

-- ai_sql_view columns:
cert_id (certificate from certificates table)
school_id
name
lname
certificate_title
doc_id (document from documents table)
doc_title
operation_id
type
date_of_operation
op_cert_id (from operations table)
op_doc_id (from operations table)

Example queries:
1. For listing certificates:
   SELECT cert_id, certificate_title, name, lname, date_of_operation 
   FROM ai_sql_view 
   WHERE school_id = '{$schoolId}' 
   ORDER BY date_of_operation DESC

2. For searching documents:
   SELECT doc_id, doc_title, type, date_of_operation 
   FROM ai_sql_view 
   WHERE school_id = '{$schoolId}' 
   AND doc_title LIKE '%search_term%' 
   ORDER BY date_of_operation DESC

3. For finding certificates by date range:
   SELECT cert_id, certificate_title, name, lname, date_of_operation 
   FROM ai_sql_view 
   WHERE school_id = '{$schoolId}' 
   AND date_of_operation BETWEEN '2024-01-01' AND '2024-12-31' 
   ORDER BY date_of_operation DESC

4. For finding documents by type:
   SELECT doc_id, doc_title, type, date_of_operation 
   FROM ai_sql_view 
   WHERE school_id = '{$schoolId}' 
   AND type IN ('pdf', 'doc') 
   ORDER BY date_of_operation DESC

5. For finding certificates by name:
   SELECT cert_id, certificate_title, name, lname, date_of_operation 
   FROM ai_sql_view 
   WHERE school_id = '{$schoolId}' 
   AND (name LIKE '%search_term%' OR lname LIKE '%search_term%') 
   ORDER BY date_of_operation DESC

6. For finding recent certificates (last 30 days):
   SELECT cert_id, certificate_title, name, lname, date_of_operation 
   FROM ai_sql_view 
   WHERE school_id = '{$schoolId}' 
   AND date_of_operation >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) 
   ORDER BY date_of_operation DESC

7. For finding certificates by multiple conditions:
   SELECT cert_id, certificate_title, name, lname, date_of_operation 
   FROM ai_sql_view 
   WHERE school_id = '{$schoolId}' 
   AND type = 'certificate' 
   AND date_of_operation BETWEEN '2024-01-01' AND '2024-12-31' 
   AND (name LIKE '%john%' OR lname LIKE '%doe%') 
   ORDER BY date_of_operation DESC

8. For finding certificates created today:
   SELECT cert_id, certificate_title, name, lname, date_of_operation 
   FROM ai_sql_view 
   WHERE school_id = '{$schoolId}' 
   AND date_of_operation >= CURDATE() 
   AND date_of_operation < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
   ORDER BY date_of_operation DESC

User query: \"{$request->text}\"";

            Log::info('Making Groq API request', [
                'url' => 'https://api.groq.com/openai/v1/chat/completions',
                'model' => 'llama-3.1-8b-instant',
                'prompt_length' => strlen($prompt),
                'headers' => [
                    'Authorization' => 'Bearer ' . substr($apiKey, 0, 10) . '...',
                    'Content-Type' => 'application/json'
                ]
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'llama-3.1-8b-instant',
                'messages' => [
                    ['role' => 'system', 'content' => $prompt]
                ],
                'temperature' => 0.1,
                'max_tokens' => 100
            ]);

            Log::info('Groq API response', [
                'status' => $response->status(),
                'body' => $response->body(),
                'headers' => $response->headers(),
                'successful' => $response->successful()
            ]);

            if (!$response->successful()) {
                throw new \Exception('Failed to get response from Groq API: ' . $response->body());
            }

            $aiResponse = $response->json()['choices'][0]['message']['content'] ?? '';
            $aiResponse = trim($aiResponse);

            Log::info('AI Response', [
                'response' => $aiResponse,
                'length' => strlen($aiResponse)
            ]);

            if ($aiResponse === '11236511') {
                return response()->json([
                    'success' => false,
                    'answer' => 'Invalid or disallowed operation requested'
                ], 400);
            }

            try {
                $results = DB::select($aiResponse);
                
                $answer = "Found " . count($results) . " certificates:\n";
                foreach ($results as $result) {
                    $date = $result->date_of_operation ? date('Y-m-d', strtotime($result->date_of_operation)) : 'No date';
                    $answer .= "- {$result->certificate_title} ({$result->cert_id}) for {$result->name} {$result->lname} on {$date}\n";
                }

                $formatPrompt = "You are a text formatter AI. Your job is to format the following text in a beautiful, readable way.

FORMATTING RULES:
1. Use emojis and symbols for visual appeal
2. Group certificates by date (Today/Recent/Pending)
3. Use proper spacing and indentation
4. Make dates more readable (e.g., 'May 5, 2025' instead of '2025-05-05')
5. Add section headers with emojis
6. Use bullet points and numbering
7. Highlight important information
8. Keep it concise but informative
9. Use markdown-style formatting
10. Add a summary at the top
11. If no certificates found, show a friendly message with suggestions
12. For today's certificates, show them in a special section
13. Format time in 12-hour format with AM/PM

Example format:
📊 Certificate Summary
Found X certificates in your records

📅 Today's Certificates
1. 🏆 [Certificate Title]
   👤 Recipient: [Name]
   🕒 Time: [Formatted Time]

📅 Recent Certificates (Last 30 days)
1. 🏆 [Certificate Title]
   👤 Recipient: [Name]
   📅 Date: [Formatted Date]

⏳ Pending Certificates
1. 🏆 [Certificate Title]
   👤 Recipient: [Name]
   ⏳ Status: Pending

If no certificates found:
📊 Certificate Summary
Found 0 certificates in your records

**No certificates to display 😊**

However, we can organize your certificates by date and status if you have any records. Please see below:

📅 Recent Certificates (Last 30 days)
* None found 😊

⏳ Pending Certificates
* None found 😊

Here's the text to format:

{$answer}";

                $formatResponse = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.1-8b-instant',
                    'messages' => [
                        ['role' => 'system', 'content' => $formatPrompt]
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 1000
                ]);

                if (!$formatResponse->successful()) {
                    Log::warning('Failed to format results beautifully', [
                        'error' => $formatResponse->body(),
                        'original_text' => $answer
                    ]);
                    $formattedAnswer = $answer;
                } else {
                    $formattedAnswer = $formatResponse->json()['choices'][0]['message']['content'] ?? $answer;
                }
                
                return response()->json([
                    'success' => true,
                    'answer' => $formattedAnswer
                ]);

            } catch (\Exception $e) {
                Log::error('SQL Execution Failed', [
                    'error' => $e->getMessage(),
                    'sql' => $aiResponse
                ]);

                return response()->json([
                    'success' => false,
                    'answer' => 'SQL command didn\'t work'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Failed to process AI request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'success' => false,
                'answer' => 'Failed to process request: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test Groq API connection
     */
    public function testGroqApi()
    {
        try {
            $apiKey = env('GROQ_API_KEY');
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                // **CRITICAL FIX:** Updated decommissioned model to a current one
                'model' => 'llama-3.1-8b-instant', 
                'messages' => [
                    ['role' => 'system', 'content' => 'Say hello']
                ],
                'temperature' => 0.1,
                'max_tokens' => 10
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'API Test Failed',
                    'status' => $response->status(),
                    'body' => $response->body()
                ], 500);
            }

            return response()->json([
                'message' => 'API Test Successful',
                'response' => $response->json()
            ]);

        } catch (\Exception $e) {
            \Log::error('Groq API Test Failed', ['error' => $e->getMessage()]);

            return response()->json([
                'error' => 'Test Failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 