<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            CREATE VIEW ai_sql_view AS
            SELECT 
                c.certificate_id AS cert_id,
                c.school_id,
                c.name,
                c.lname,
                c.certificate_title,
                NULL AS doc_id,
                NULL AS doc_title,
                o.operation_id,
                o.type,
                o.date_of_operation,
                o.certificate_id AS op_cert_id,
                o.doc_id AS op_doc_id
            FROM certificates c
            LEFT JOIN operations o ON c.certificate_id = o.certificate_id
            WHERE c.school_id IS NOT NULL
            UNION ALL
            SELECT 
                NULL AS cert_id,
                d.school_id,
                NULL AS name,
                NULL AS lname,
                NULL AS certificate_title,
                d.doc_id,
                d.doc_title,
                o.operation_id,
                o.type,
                o.date_of_operation,
                o.certificate_id AS op_cert_id,
                o.doc_id AS op_doc_id
            FROM documents d
            LEFT JOIN operations o ON d.doc_id = o.doc_id
            WHERE d.school_id IS NOT NULL
        ");
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS ai_sql_view');
    }
};
