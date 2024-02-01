<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;

use App\Http\Requests\UserRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Log;

use App\Mail\VerifyAccount;
use App\Jobs\MailJob;
use Inertia\Inertia;

class AuthVerifySessionController extends Controller
{
    /**
     * Mostrar la vista del Registro
     */
    public function registerView() {
        if(!auth()->user()){
            return Inertia::render('Auth/Register');
        }
        return redirect('/dashboard');
    }
    /**
     * Crea un nuevo registro de usuario
     */
    public function register(UserRequest $request) {
        try {    
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
            ]);
            MailJob::dispatch(new VerifyAccount($user),$user)->onQueue('default');
            Log::channel('slak')->info('Se registro ' . $user->email);
            return redirect('/login');
            
        } catch (QueryException $e) {
            Log::channel('slack')->error($e->getMessage());
            return redirect()->back()->withErrors([
                'messageError' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.',
                'status'=> 500
                ])->withInput();
        } catch (PDOException $e) {
            Log::error('Error de PDO: ' . $e->getMessage());
            return Redirect::back()->withErrors(['messageError' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.']);
        }
    }

    /**
     * Mostrar la vista del Inicio de Sesion
     */
    public function loginView() {
        if(!auth()->user()){
            return Inertia::render('Auth/Login', [
                'status' => session('status'),
            ]);
        }
        return redirect('/dashboard');
    }

    /**
     * Verifica y crea una nueva sesion autenticada del usuario
     */
    public function login(LoginRequest $request){
        
        try{
            $user = $request->authenticate();
            if($user->rol === 1){
                Log::channel('slack')->warning('Se intento inciar sesion con con la cuenta de Administrador de ' . $user->email. '');
                return redirect('/verify/code/'.strval($user->id));
            }
            Auth::login($user);
            Log::channel('slack')->info('Inicio sesion ' . $user->email);
            return redirect()->intended(RouteServiceProvider::HOME);
        }
        catch (QueryException $e) {
            Log::channel('slack')->error($e->getMessage());
            return redirect()->back()->withErrors([
                'messageError' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.',
                'status'=> 500
                ])->withInput();
        } catch (PDOException $e) {
            Log::error('Error de PDO: ' . $e->getMessage());
            return Redirect::back()->withErrors([
                'messageError' => 'Error interno del servidor. Por favor, inténtelo de nuevo más tarde.',
                'status'=> 500
            ]);
        }
    }


    /**
     * Destruye la sesion autenticada actual del usuario.
     */
    public function lgout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
