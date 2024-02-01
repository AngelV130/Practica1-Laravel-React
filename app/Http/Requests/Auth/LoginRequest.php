<?php

namespace App\Http\Requests\Auth;
use App\Models\User;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Providers\RouteServiceProvider;
use App\Rules\Recaptcha;

use App\Mail\VerifyCodeAdmin;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'captchaResponse' => ['required',new Recaptcha],
        ];
    }
    /**
     * Mensajes de Validaciom
     */
    public function messages(){
        return [
            'required' => 'El campo  es obligatorio.',
            'string' => 'El campo :attribute debe ser string.',
            'max' => [
                'string' => 'El campo :attribute no debe tener más de :max caracteres.',
            ],
            'min' => [
                'string' => 'El campo :attribute debe tener al menos :min caracteres.',
            ],
            'email' => 'El formato del campo :attribute no es válido.',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate():User
    {
        $email = $this->input('email');
        $password = $this->input('password');
        $user = User::where('email', $email)->first();
        $this->ensureIsNotRateLimited();
        
        if($user && Hash::check($password, $user->password)){
            if(!$user->status)
                throw ValidationException::withMessages([
                    'message' => 'Cuenta no activa',
                ]);
            RateLimiter::clear($this->throttleKey());
            return $user;
        }else{
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'message' => 'Credensiales de email y password incorrectos',
            ]);
        }
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 3)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'message' => 'Demasiados intentos vuelva a intentar en '.strval(ceil($seconds / 60)),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }
}
