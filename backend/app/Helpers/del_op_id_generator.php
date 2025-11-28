<?php

function generateDeleteOperationId($deletedId) {
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    $length = 2; // Only 2 characters for random part
    $prefix = 'op-d-'; // Prefix for delete operations
    
    $id = $prefix . $deletedId . '-';
    for ($i = 0; $i < $length; $i++) {
        $id .= $characters[rand(0, strlen($characters) - 1)];
    }
    
    return $id;
}

// Return the function itself instead of executing it
return 'generateDeleteOperationId'; 