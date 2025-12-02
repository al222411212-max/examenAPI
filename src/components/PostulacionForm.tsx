'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { Postulación } from '@/types';

export default function PostulacionForm() {
  const [formData, setFormData] = useState<Postulación>({
    id_vacante: 0,
    nombre_postulante: '',
    correo: '',
    teléfono: '',
    cv_url: '',
    fecha_postulación: new Date().toISOString().split('T')[0],
    estatus: 'En revisión',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'id_vacante' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_vacante || !formData.nombre_postulante || !formData.correo || !formData.teléfono || !formData.cv_url) {
      setMessage('Por favor completa todos los campos');
      setMessageType('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setMessage('Por favor ingresa un correo válido');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/postulaciones', formData);
      setMessage('Postulación enviada exitosamente! Revisaremos tu solicitud pronto.');
      setMessageType('success');
      setFormData({
        id_vacante: 0,
        nombre_postulante: '',
        correo: '',
        teléfono: '',
        cv_url: '',
        fecha_postulación: new Date().toISOString().split('T')[0],
        estatus: 'En revisión',
      });
      setTimeout(() => setMessage(''), 5000);
    } catch (error: any) {
      setMessage('Error al enviar la postulación: ' + (error.response?.data?.error || 'Error desconocido'));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Enviar Postulación</h2>
      
      {message && (
        <div className={`mb-4 p-4 rounded-lg border-l-4 ${
          messageType === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Vacante *</label>
            <input
              type="number"
              name="id_vacante"
              value={formData.id_vacante || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
            <input
              type="text"
              name="nombre_postulante"
              value={formData.nombre_postulante}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
            <input
              type="tel"
              name="teléfono"
              value={formData.teléfono}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL del CV *</label>
            <input
              type="url"
              name="cv_url"
              value={formData.cv_url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">Proporciona el enlace donde está alojado tu CV (Google Drive, Dropbox, etc.)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
            <select
              name="estatus"
              value={formData.estatus}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            >
              <option value="En revisión">En revisión</option>
              <option value="Aceptada">Aceptada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Se asignará automáticamente</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            <strong>Información:</strong> Tu postulación será revisada pronto. Nos pondremos en contacto contigo al correo o teléfono proporcionado.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:from-gray-400 disabled:to-gray-400 transform hover:scale-105 disabled:scale-100"
        >
          {loading ? 'Enviando...' : 'Enviar Postulación'}
        </button>
      </form>
    </div>
  );
}
