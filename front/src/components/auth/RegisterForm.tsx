'use client';

import React, { useState } from 'react';
import SelectorFotoPerfil from '@/components/ui/SelectorFotoPerfil';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const [form, setForm] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    telefono: '',
    tipoUsuario: 'Alumno',
    nombreEmpresa: '',
    password: '',
    confirmPassword: '',
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword((v) => !v);

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

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('nombreCompleto', form.nombreCompleto);
      formData.append('correoElectronico', form.correoElectronico);
      formData.append('telefono', form.telefono);
      formData.append('tipoUsuario', form.tipoUsuario);
      formData.append('nombreEmpresa', form.nombreEmpresa);
      formData.append('password', form.password);

      if (foto) {
        formData.append('fotoPerfil', foto);
      }

      const res = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Error al registrar usuario');
      }

      alert('Registro exitoso');

 
      setForm({
        nombreCompleto: '',
        correoElectronico: '',
        telefono: '',
        tipoUsuario: 'Alumno',
        nombreEmpresa: '',
        password: '',
        confirmPassword: '',
      });
      setFoto(null);


      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden"
      style={{
        backgroundImage: 'url("/bombillo-negro.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Regístrate</h2>

        {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
        <SelectorFotoPerfil fotoPerfilInicial={undefined} onFotoChange={setFoto} />

        <input
          name="nombreCompleto"
          placeholder="Nombre Completo"
          value={form.nombreCompleto}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="correoElectronico"
          type="email"
          placeholder="Correo Electrónico"
          value={form.correoElectronico}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
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
          required
        >
          <option value="Alumno">Alumno</option>
          <option value="Empresa">Empresa</option>
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

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirmar Contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded hover:bg-red-600 transition"
        >
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
