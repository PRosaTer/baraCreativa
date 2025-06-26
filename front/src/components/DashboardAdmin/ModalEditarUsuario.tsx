'use client';

import React, { useState, useEffect } from 'react';
import { Usuario } from '../../app/types/auth';

interface Props {
  usuario: Usuario | null;
  onClose: () => void;
  onGuardar: (usuarioEditado: Usuario) => void;
}

export default function ModalEditarUsuario({ usuario, onClose, onGuardar }: Props) {
  const [form, setForm] = useState<Usuario | null>(usuario);

  useEffect(() => {
    setForm(usuario);
  }, [usuario]);

  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (form) onGuardar(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px] max-w-full">
        <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>


        {form.fotoPerfil && (
          <div className="mb-4 flex justify-center">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/perfiles/${form.fotoPerfil}`}
              alt={`Foto de perfil de ${form.nombreCompleto}`}
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          </div>
        )}

        <label className="block mb-2">
          Nombre:
          <input
            name="nombreCompleto"
            value={form.nombreCompleto}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          Correo:
          <input
            name="correoElectronico"
            value={form.correoElectronico}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          Teléfono:
          <input
            name="telefono"
            value={form.telefono || ''}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          Tipo Usuario:
          <select
            name="tipoUsuario"
            value={form.tipoUsuario || ''}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          >
            <option value="">Escoje una opción</option>
            <option value="Alumno">Alumno</option>
            <option value="Instructor">Instructor</option>
            <option value="Admin">Admin</option>
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1 bg-gray-300 rounded">
            Cancelar
          </button>
          <button
            onClick={() => {
              handleSubmit();
              onClose();
            }}
            className="px-4 py-1 bg-blue-500 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
