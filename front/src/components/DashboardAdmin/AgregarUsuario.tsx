'use client';

import React, { useState } from 'react';
import SelectorFotoPerfil from '@/components/ui/SelectorFotoPerfil';

interface Props {
  onUsuarioCreado: () => void;
}

export default function AgregarUsuario({ onUsuarioCreado }: Props) {
  const [form, setForm] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    tipoUsuario: 'Alumno',
    nombreEmpresa: '',
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append('nombreCompleto', form.nombreCompleto);
      formData.append('correoElectronico', form.correoElectronico);
      formData.append('password', form.password);
      formData.append('telefono', form.telefono);
      formData.append('tipoUsuario', form.tipoUsuario);
      formData.append('nombreEmpresa', form.nombreEmpresa);

      if (foto) {
        formData.append('fotoPerfil', foto);
      }

      const res = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Error al crear usuario');
      }

      setForm({
        nombreCompleto: '',
        correoElectronico: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        tipoUsuario: 'Alumno',
        nombreEmpresa: '',
      });
      setFoto(null);

      onUsuarioCreado();

      alert('Usuario creado con éxito');
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-center">Crear Usuario</h2>

      {error && <div className="text-red-600 font-semibold text-center">{error}</div>}

      <SelectorFotoPerfil onFotoSeleccionada={setFoto} />

      <input
        name="nombreCompleto"
        placeholder="Nombre Completo"
        value={form.nombreCompleto}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="correoElectronico"
        type="email"
        placeholder="Correo Electrónico"
        value={form.correoElectronico}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="telefono"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <select
        name="tipoUsuario"
        value={form.tipoUsuario}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="Alumno">Alumno</option>
        <option value="Empresa">Empresa</option>
        <option value="Admin">Administrador</option>
      </select>

      {form.tipoUsuario === 'Empresa' && (
        <input
          name="nombreEmpresa"
          placeholder="Nombre de la Empresa"
          value={form.nombreEmpresa}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      )}

      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirmar Contraseña"
        value={form.confirmPassword}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={cargando}
        className="bg-black text-white px-4 py-2 rounded hover:bg-red-600 w-full"
      >
        {cargando ? 'Creando...' : 'Crear Usuario'}
      </button>
    </form>
  );
}
