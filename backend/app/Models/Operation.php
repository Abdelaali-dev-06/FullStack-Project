<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    use HasFactory;

    protected $fillable = [
        'operation_id',
        'school_id',
        'doc_id',
        'certificate_id',
        'type',
        'date_of_operation'
    ];

    protected $primaryKey = 'operation_id';
    public $incrementing = false;

    protected $casts = [
        'date_of_operation' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($operation) {
            if (empty($operation->operation_id)) {
                $operation->operation_id = 'op-' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
            }
        });
    }

    public function school()
    {
        return $this->belongsTo(User::class, 'school_id', 'school_id');
    }

    public function certificate()
    {
        return $this->belongsTo(Certificate::class, 'certificate_id', 'certificate_id');
    }

    public function document()
    {
        return $this->belongsTo(Document::class, 'doc_id', 'doc_id');
    }
} 