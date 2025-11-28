<?php

$host = '127.0.0.1';
$dbname = 'cert_management';
$username = 'NG';
$password = 'smi6';
$port = 3306;

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connection successful!\n";
    
    // Test query
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables in database:\n";
    print_r($tables);
    
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
} 