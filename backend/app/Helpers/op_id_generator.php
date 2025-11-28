<?php

namespace App\Helpers;

class OpIdGenerator
{
    public static function generate()
    {
        return 'op-' . str_pad(mt_rand(1, 99999999), 8, '0', STR_PAD_LEFT);
    }
}

class CertCopyOpIdGenerator
{
    public static function generate()
    {
        return 'opcc-' . str_pad(mt_rand(1, 99999999), 8, '0', STR_PAD_LEFT);
    }
}