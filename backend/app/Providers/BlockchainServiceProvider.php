<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\BlockchainService;

class BlockchainServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(BlockchainService::class, function ($app) {
            return new BlockchainService();
        });
    }

    public function boot()
    {
        //
    }
} 