<?php

namespace App\Services;

use Web3\Web3;
use Web3\Contract;
use Web3\Providers\HttpProvider;
use Web3\RequestManagers\HttpRequestManager;
use Illuminate\Support\Facades\Log;

class BlockchainService
{
    private $web3;
    private $contract;
    private $contractAddress;
    private $account;

    public function __construct()
    {
        // Connect to local Ganache
        $this->web3 = new Web3(new HttpProvider(new HttpRequestManager('http://localhost:8545')));
        
        // Your contract ABI (we'll create this next)
        $abi = json_decode(file_get_contents(base_path('contracts/CertificateStorage.json')), true);
        
        // Your contract address (we'll get this after deployment)
        $this->contractAddress = env('BLOCKCHAIN_CONTRACT_ADDRESS');
        
        // Create contract instance
        $this->contract = new Contract($this->web3->provider, $abi);
        
        // Get the first account from Ganache (for testing)
        $this->web3->eth->accounts(function ($err, $accounts) {
            if ($err !== null) {
                Log::error('Error getting accounts', ['error' => $err->getMessage()]);
                return;
            }
            $this->account = $accounts[0];
        });
    }

    public function storeMetadata($operationId, $schoolId, $fileId, $originalHash, $updatedHash)
    {
        try {
            $this->contract->at($this->contractAddress)->send('addCertificate', [
                $operationId,
                $schoolId,
                $fileId,
                $originalHash,
                $updatedHash
            ], [
                'from' => $this->account,
                'gas' => 2000000
            ], function ($err, $result) {
                if ($err !== null) {
                    Log::error('Error storing metadata', ['error' => $err->getMessage()]);
                    return;
                }
                Log::info('Metadata stored successfully', ['transaction' => $result]);
            });
            
            return true;
        } catch (\Exception $e) {
            Log::error('Exception in storeMetadata', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    public function verifyMetadata($fileId)
    {
        try {
            $result = null;
            $this->contract->at($this->contractAddress)->call('getCertificate', [
                $fileId
            ], function ($err, $data) use (&$result) {
                if ($err !== null) {
                    Log::error('Error verifying metadata', ['error' => $err->getMessage()]);
                    return;
                }
                $result = $data;
            });
            
            return $result;
        } catch (\Exception $e) {
            Log::error('Exception in verifyMetadata', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }
} 