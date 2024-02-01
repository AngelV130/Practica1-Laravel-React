<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthVerifyUserController;
use App\Http\Controllers\Auth\AuthVerifySessionController;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
|
| Rutas de Autenticacion de sesiones y vrificaciones de cueata
|
|
*/

Route::controller(AuthVerifySessionController::class)->group(function () {
    Route::get('register', 'registerView')->name('register');
    Route::post('register', 'register');

    Route::get('login', 'loginView')->name('login');
    Route::post('login', 'login');

    Route::post('logout', 'lgout')->name('logout')->middleware('auth');
})->middleware('guest');

Route::controller(AuthVerifyUserController::class)->group(function () {
    Route::get('verify/email/{id}','activeAccount')->name('active.account')->whereNumber('id')->middleware('signed');
    
    Route::get('verify/code/{id}','sendVerifyCode');
    
    Route::post('verify/code/{id}', 'verifyCode')->name('verify.code')->whereNumber('id')->middleware('signed');
});
