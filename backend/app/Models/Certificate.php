<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_id',
        'operation_id',
        'school_id',
        'name',
        'lname',
        'certificate_title',
        'original_pdf_hash',
        'updated_pdf_hash',
        'original_pdf_path',
        'updated_pdf_path'
    ];

    protected $primaryKey = 'certificate_id';
    public $incrementing = false;

    public function operation()
    {
        return $this->belongsTo(Operation::class, 'operation_id', 'operation_id');
    }

    public function school()
    {
        return $this->belongsTo(User::class, 'school_id', 'school_id');
    }
} 