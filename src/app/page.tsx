'use client';

import EmpresaForm from "@/components/EmpresaForm";
import VacanteForm from "@/components/VacanteForm";
import PostulacionForm from "@/components/PostulacionForm";
import ListaEmpresas from "@/components/ListaEmpresas";
import Estadisticas from "@/components/Estadisticas";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'empresa' | 'vacante' | 'postulacion' | 'lista' | 'estadisticas'>('empresa');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-blue-700 text-white">
      <div className="max-w-5xl mx-auto p-6">
        <header className="text-center py-8 mb-6">
          <h1 className="text-3xl font-semibold text-white mb-1">Portal de Empleos</h1>
          <p className="text-blue-100 text-sm max-w-xl mx-auto">Gestiona empresas, crea vacantes y recibe postulaciones</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
            <h3 className="text-white font-medium">Empresas</h3>
            <p className="text-blue-200 text-sm">Registra y gestiona</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
            <h3 className="text-white font-medium">Vacantes</h3>
            <p className="text-blue-200 text-sm">Crea oportunidades</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
            <h3 className="text-white font-medium">Postulaciones</h3>
            <p className="text-blue-200 text-sm">Recibe candidatos</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('empresa')}
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'empresa' ? 'bg-sky-500 text-white' : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            Registrar empresa
          </button>
          <button
            onClick={() => setActiveTab('vacante')}
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'vacante' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            Crear vacante
          </button>
          <button
            onClick={() => setActiveTab('postulacion')}
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'postulacion' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            Enviar postulación
          </button>
          <button
            onClick={() => setActiveTab('lista')}
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'lista' ? 'bg-sky-600 text-white' : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            Ver empresas
          </button>
          <button
            onClick={() => setActiveTab('estadisticas')}
            className={`px-4 py-2 rounded-md text-sm ${
              activeTab === 'estadisticas' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white border border-white/20'
            }`}
          >
            Estadísticas
          </button>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-md shadow p-6 text-gray-800">
            {activeTab === 'empresa' && <EmpresaForm />}
            {activeTab === 'vacante' && <VacanteForm />}
            {activeTab === 'postulacion' && <PostulacionForm />}
          </div>
        </div>

        {activeTab === 'lista' && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-md shadow p-6 text-gray-800">
              <ListaEmpresas />
            </div>
          </div>
        )}

        {activeTab === 'estadisticas' && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-md shadow p-6 text-gray-800">
              <Estadisticas />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
