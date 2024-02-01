import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react';

const UserTable = ({users, auth}) => {
    console.log(users)
    return (

    <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
    >
            <Head title="Users Info" />
      <div className="container mx-auto mt-8">
        <table className="min-w-full bg-zinc-100 border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Correo Electrónico</th>
              <th className="py-2 px-4 border-b">Rol</th>
              <th className="py-2 px-4 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {
                users ?
                users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 text-center">
                    <td className="py-2 px-4 border-b">{user.id}</td>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.roles.name}</td>
                    <td className="py-2 px-4 border-b">{user.status ? 'Activado':'Desactivado'}</td>
                </tr>
                ))
                :
                <p >NO HAY USUARIOS</p>
            }
          </tbody>
        </table>
      </div>

    </AuthenticatedLayout>
    );
  };

export default UserTable;
