<?php

use Illuminate\Support\Facades\Route;
// Keep your existing controller import (important!)
use App\Http\Controllers\VerifyPdfController; 
// You may also need to import FileDownloadController if that route is in here

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Original Welcome Page Route
Route::get('/', function () {
    return view('welcome');
});

