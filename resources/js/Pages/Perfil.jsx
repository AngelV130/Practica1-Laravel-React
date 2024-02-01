import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Perfil({user, auth}){
    return (
        <>

        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title='Perfil' />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-10">
                <div class="bg-zinc-700 p-8 rounded shadow-md w-96 text-white">

                    <h2 class="text-2xl font-semibold mb-4">Información del Usuario</h2>

                    <form > 

                        {/* <!-- Nombre --> */}
                        <div class="mb-4">
                            <label for="nombre" class="block text-sm font-medium text-gray-300">Nombre:</label>
                            <p id="nombre" class="mt-1 text-sm ">{user.name}</p>
                        </div>

                        {/* <!-- Correo Electrónico --> */}
                        <div class="mb-4">
                            <label for="correo" class="block text-sm font-medium text-gray-300">Correo Electrónico:</label>
                            <p id="correo" class="mt-1 text-sm ">{user.email}</p>
                        </div>

                        {/* <!-- Fecha de Nacimiento --> */}
                        <div class="mb-4">
                            <label for="fechaNacimiento" class="block text-sm font-medium text-gray-300">Rol:</label>
                            <p id="fechaNacimiento" class="mt-1 text-sm ">{user.roles.name}</p>
                        </div>

                        {/* <!-- Otras secciones de información aquí --> */}

                    </form>

                </div>
            </div>
            </AuthenticatedLayout>
        </>
    )
}