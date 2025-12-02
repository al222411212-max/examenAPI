"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Stats {
  empresas: number;
  vacantes: number;
  postulaciones: number;
}

interface ModalidadRow {
  modalidad: string;
  total: number;
}

interface FechaRow {
  fecha: string;
  total: number;
}

export default function Estadisticas() {
  const [stats, setStats] = useState<Stats>({ empresas: 0, vacantes: 0, postulaciones: 0 });
  const [loading, setLoading] = useState(true);
  const [modalidad, setModalidad] = useState<ModalidadRow[]>([]);
  const [porFecha, setPorFecha] = useState<FechaRow[]>([]);
  const [empresasTop, setEmpresasTop] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get<{
        stats: Stats;
        vacantesModalidad: ModalidadRow[];
        postulacionesPorFecha: FechaRow[];
        empresasVacantes: any[];
      }>("/api/stats");

      setStats(response.data.stats || { empresas: 0, vacantes: 0, postulaciones: 0 });
      setModalidad(response.data.vacantesModalidad || []);
      setPorFecha(response.data.postulacionesPorFecha || []);
      setEmpresasTop(response.data.empresasVacantes || []);
    } catch (err) {
      console.error("Error cargando estadísticas", err);
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: ["Empresas", "Vacantes", "Postulaciones"],
    datasets: [
      {
        label: "Conteo",
        data: [stats.empresas, stats.vacantes, stats.postulaciones],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
      },
    ],
  };

  const modalidadData = {
    labels: modalidad.map((m) => m.modalidad || 'Otro'),
    datasets: [
      {
        label: 'Vacantes por modalidad',
        data: modalidad.map((m) => m.total),
        backgroundColor: ['#3b82f6', '#06b6d4', '#f97316', '#10b981'],
      },
    ],
  };

  const fechaData = {
    labels: porFecha.map((f) => f.fecha),
    datasets: [
      {
        label: 'Postulaciones por fecha',
        data: porFecha.map((f) => f.total),
        backgroundColor: '#6366f1',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Estadísticas del Sistema" },
    },
  };

  if (loading) return <div className="text-center text-gray-600">Cargando estadísticas...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white/95 p-6 rounded-lg shadow">
        <Bar options={options} data={data} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/95 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Vacantes por modalidad</h3>
          <Bar options={{...options, plugins:{...options.plugins, title: { display: true, text: 'Vacantes por modalidad' }}}} data={modalidadData} />
        </div>

        <div className="bg-white/95 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-3">Postulaciones por fecha</h3>
          <Bar options={{...options, plugins:{...options.plugins, title: { display: true, text: 'Postulaciones por fecha' }}}} data={fechaData} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-md">
        <h3 className="text-lg font-medium mb-2">Top empresas por vacantes</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {empresasTop.slice(0,10).map((e:any) => (
            <li key={e.id_empresa}>{e.nombre} — {e.vacantes} vacantes</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <button onClick={fetchStats} className="px-4 py-2 bg-blue-500 text-white rounded-md">Actualizar</button>
      </div>
    </div>
  );
}
