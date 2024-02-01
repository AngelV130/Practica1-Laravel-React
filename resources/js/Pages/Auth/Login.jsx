import { useState, useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import Captcha from '@/Components/Captcha'
import ErrorPage from '@/Components/Errors'
import ErrorMessage from '@/Components/MessageError'

export default function Login({messageError, status, errors:err}) {
    const [statusErros, setStatusError] = useState(err)
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        captchaResponse: ''
    });
    const [recaptchaResponse, setRecaptchaResponse] = useState(data.captchaResponse);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);
    useEffect(() => {
        setData('captchaResponse',recaptchaResponse)
    }, [recaptchaResponse]);
    const submit = (e) => {
        e.preventDefault();

        post(route('login'),{
            onError: (err)=>{
                err != statusErros ? setStatusError(err) : setStatusError('') 
                console.log(err)
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            {status && <div className="mb-4 font-medium text-sm text-green-600">s{status}</div>}
            <ErrorMessage message={statusErros.messageError}/>

            {statusErros.status && <ErrorPage status={statusErros.status}/>}
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />

                </div>
                <div className="my-2">

                    <InputError message={errors.message}/>
                    <Captcha error={statusErros} setData={setRecaptchaResponse}></Captcha>
                    <InputError message={errors.captchaResponse} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    {(
                        <Link
                            href={route('register')}
                            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            Crear Centa
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Inciar Sesion
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
