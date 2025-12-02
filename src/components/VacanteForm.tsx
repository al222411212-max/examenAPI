'use client';

import { useState, FormEvent } from 'react';
import axios from 'axios';
import { Vacante } from '@/types';

export default function VacanteForm() {
  const [formData, setFormData] = useState<Vacante>({
    id_empresa: 0,
    puesto: '',
    descripción: '',
    salario: 0,
    modalidad: '',
    especialidad: '',
    fecha_publicación: new Date().toISOString().split('T')[0],
    estatus: 'Activa',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salario' || name === 'id_empresa' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_empresa || !formData.puesto || !formData.descripción || !formData.salario || !formData.modalidad || !formData.especialidad) {
      setMessage('Por favor completa todos los campos');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/vacantes', formData);
      setMessage('Vacante creada exitosamente');
      setMessageType('success');
      setFormData({
        id_empresa: 0,
        puesto: '',
        descripción: '',
        salario: 0,
        modalidad: '',
        especialidad: '',
        fecha_publicación: new Date().toISOString().split('T')[0],
        estatus: 'Activa',
      });
      setTimeout(() => setMessage(''), 5000);
    } catch (error: any) {
      setMessage('Error al crear la vacante: ' + (error.response?.data?.error || 'Error desconocido'));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Nueva Vacante</h2>
      
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
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Empresa *</label>
            <input
              type="number"
              name="id_empresa"
              value={formData.id_empresa || ''}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Puesto *</label>
            <input
              type="text"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salario (en euros) *</label>
            <input
              type="number"
              name="salario"
              value={formData.salario || ''}
              onChange={handleChange}
              required
              step="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad *</label>
            <select
              name="modalidad"
              value={formData.modalidad}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="">Seleccionar Modalidad</option>
              <option value="Presencial">Presencial</option>
              <option value="Remoto">100% Remoto</option>
              <option value="Híbrido">Híbrido (Presencial + Remoto)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
            <input
              type="text"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estatus *</label>
            <select
              name="estatus"
              value={formData.estatus}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="Activa">Activa</option>
              <option value="Cerrada">Cerrada</option>
              <option value="Pausada">Pausada</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
          <textarea
            name="descripción"
            value={formData.descripción}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Fecha de Publicación:</strong> {formData.fecha_publicación}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:from-gray-400 disabled:to-gray-400 transform hover:scale-105 disabled:scale-100"
        >
          {loading ? 'Creando...' : 'Crear Vacante'}
        </button>
      </form>
    </div>
  );
}
