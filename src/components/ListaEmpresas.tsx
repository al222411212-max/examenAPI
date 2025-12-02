'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface EmpresaData {
  id_empresa: number;
  nombre: string;
  giro: string;
  tamaño: string;
  teléfono: string;
  ciudad: string;
  dirección: string;
  fecha_registro: string;
}

interface Vacante {
  id_vacante: number;
  id_empresa: number;
  puesto: string;
  descripción: string;
  salario: number;
  modalidad: string;
  especialidad: string;
  fecha_publicación: string;
  estatus: string;
}

interface Postulante {
  id_postulacion: number;
  id_vacante: number;
  nombre_postulante: string;
  correo: string;
  teléfono: string;
  cv_url: string;
  fecha_postulación: string;
  estatus: string;
}

export default function ListaEmpresas() {
  const [empresas, setEmpresas] = useState<EmpresaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedEmpresa, setExpandedEmpresa] = useState<number | null>(null);
  const [vacantesByEmpresa, setVacantesByEmpresa] = useState<Record<number, Vacante[]>>({});
  const [loadingVacantesId, setLoadingVacantesId] = useState<number | null>(null);
  const [vacantesPageByEmpresa, setVacantesPageByEmpresa] = useState<Record<number, number>>({});
  const [vacantesPageSizeByEmpresa, setVacantesPageSizeByEmpresa] = useState<Record<number, number>>({});
  const [vacantesTotalPagesByEmpresa, setVacantesTotalPagesByEmpresa] = useState<Record<number, number>>({});
  const [postulantesByVacante, setPostulantesByVacante] = useState<Record<number, Postulante[]>>({});
  const [loadingPostulantesId, setLoadingPostulantesId] = useState<number | null>(null);
  const [postulantesPageByVacante, setPostulantesPageByVacante] = useState<Record<number, number>>({});
  const [postulantesPageSizeByVacante, setPostulantesPageSizeByVacante] = useState<Record<number, number>>({});
  const [postulantesTotalPagesByVacante, setPostulantesTotalPagesByVacante] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const response = await axios.get<EmpresaData[]>('/api/empresas');
      setEmpresas(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const loadVacantes = async (empresaId: number, page = 1, pageSize?: number) => {
    try {
      setLoadingVacantesId(empresaId);
      const ps = pageSize ?? vacantesPageSizeByEmpresa[empresaId] ?? 5;
      const res = await axios.get<{ items: Vacante[]; pagination?: any }>(`/api/empresas/${empresaId}/vacantes?page=${page}&pageSize=${ps}`);
      const items = (res.data as any).items || (res.data as any) || [];
      setVacantesByEmpresa((prev) => ({ ...prev, [empresaId]: items }));
      setVacantesPageByEmpresa((prev) => ({ ...prev, [empresaId]: page }));
      setVacantesPageSizeByEmpresa((prev) => ({ ...prev, [empresaId]: ps }));
      const totalPages = (res.data as any).pagination?.totalPages ?? Math.ceil(((res.data as any).pagination?.total || items.length) / ps);
      setVacantesTotalPagesByEmpresa((prev) => ({ ...prev, [empresaId]: totalPages }));
    } catch (e) {
      setVacantesByEmpresa((prev) => ({ ...prev, [empresaId]: [] }));
    } finally {
      setLoadingVacantesId(null);
    }
  };

  const toggleVacantes = async (empresaId: number) => {
    if (expandedEmpresa === empresaId) {
      setExpandedEmpresa(null);
      return;
    }

    setExpandedEmpresa(empresaId);
    const currentPage = vacantesPageByEmpresa[empresaId] || 1;
    if (!vacantesByEmpresa[empresaId]) {
      await loadVacantes(empresaId, currentPage);
    }
  };

  const loadPostulantes = async (vacanteId: number, page = 1, pageSize?: number) => {
    try {
      setLoadingPostulantesId(vacanteId);
      const ps = pageSize ?? postulantesPageSizeByVacante[vacanteId] ?? 10;
      const res = await axios.get<{ items: Postulante[]; pagination?: any }>(`/api/vacantes/${vacanteId}/postulantes?page=${page}&pageSize=${ps}`);
      const items = (res.data as any).items || [];
      setPostulantesByVacante((prev) => ({ ...prev, [vacanteId]: items }));
      setPostulantesPageByVacante((prev) => ({ ...prev, [vacanteId]: page }));
      setPostulantesPageSizeByVacante((prev) => ({ ...prev, [vacanteId]: ps }));
      const totalPages = (res.data as any).pagination?.totalPages ?? Math.ceil(((res.data as any).pagination?.total || items.length) / ps);
      setPostulantesTotalPagesByVacante((prev) => ({ ...prev, [vacanteId]: totalPages }));
    } catch (e) {
      setPostulantesByVacante((prev) => ({ ...prev, [vacanteId]: [] }));
    } finally {
      setLoadingPostulantesId(null);
    }
  };

  const togglePostulantes = async (vacanteId: number) => {
    if (postulantesByVacante[vacanteId]) {
      const copy = { ...postulantesByVacante };
      delete copy[vacanteId];
      setPostulantesByVacante(copy);
      return;
    }
    const currentPage = postulantesPageByVacante[vacanteId] || 1;
    await loadPostulantes(vacanteId, currentPage);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Cargando empresas...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (empresas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay empresas registradas aún
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Empresas Registradas ({empresas.length})</h2>
        <button
          onClick={fetchEmpresas}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empresas.map((empresa) => (
          <div key={empresa.id_empresa} className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{empresa.nombre}</h3>
                <p className="text-xs text-gray-500">ID: {empresa.id_empresa}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {empresa.tamaño}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Giro:</span>
                <p className="text-gray-600">{empresa.giro}</p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Teléfono:</span>
                <p className="text-gray-600">{empresa.teléfono}</p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Ubicación:</span>
                <p className="text-gray-600">{empresa.ciudad}</p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Dirección:</span>
                <p className="text-gray-600">{empresa.dirección}</p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Fecha de Registro:</span>
                <p className="text-gray-600">{empresa.fecha_registro}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => toggleVacantes(empresa.id_empresa)}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              >
                {expandedEmpresa === empresa.id_empresa ? 'Ocultar vacantes' : 'Ver vacantes'}
              </button>
              <button
                onClick={fetchEmpresas}
                className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm border"
              >
                Refrescar
              </button>
            </div>

            {expandedEmpresa === empresa.id_empresa && (
              <div className="mt-4">
                {loadingVacantesId === empresa.id_empresa ? (
                  <div className="text-sm text-gray-600">Cargando vacantes...</div>
                ) : (
                  <div className="space-y-3">
                    {/* Vacantes list */}
                    {(vacantesByEmpresa[empresa.id_empresa] || []).length === 0 ? (
                      <div className="text-sm text-gray-500">No hay vacantes para esta empresa.</div>
                    ) : (
                      (vacantesByEmpresa[empresa.id_empresa] || []).map((v) => (
                        <div key={v.id_vacante} className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-800">{v.puesto}</h4>
                              <p className="text-sm text-gray-600">{v.modalidad} · {v.estatus}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => togglePostulantes(v.id_vacante)}
                                className="px-2 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                              >
                                Ver postulantes
                              </button>
                            </div>
                          </div>

                          {postulantesByVacante[v.id_vacante] && (
                            <div className="mt-2 ml-2">
                              {loadingPostulantesId === v.id_vacante ? (
                                <div className="text-sm text-gray-600">Cargando postulantes...</div>
                              ) : (
                                (postulantesByVacante[v.id_vacante] || []).length === 0 ? (
                                  <div className="text-sm text-gray-500">No hay postulantes.</div>
                                ) : (
                                  <div>
                                    <ul className="text-sm text-gray-700 list-disc pl-5">
                                      {(postulantesByVacante[v.id_vacante] || []).map((p) => (
                                        <li key={p.id_postulacion}>
                                          <strong>{p.nombre_postulante}</strong> — {p.correo} {p.cv_url ? (<a className="text-blue-600 ml-2" href={p.cv_url} target="_blank" rel="noreferrer">CV</a>) : null}
                                        </li>
                                      ))}
                                    </ul>
                                    {/* Paginador postulantes */}
                                    <div className="mt-2 flex items-center gap-2">
                                      <label className="text-sm text-gray-600">Por página:</label>
                                      <select
                                        value={postulantesPageSizeByVacante[v.id_vacante] || 10}
                                        onChange={(e) => {
                                          const ps = Number(e.target.value) || 10;
                                          setPostulantesPageSizeByVacante((prev) => ({ ...prev, [v.id_vacante]: ps }));
                                          loadPostulantes(v.id_vacante, 1, ps);
                                        }}
                                        className="text-sm border rounded px-2 py-1"
                                      >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                      </select>

                                      <button
                                        onClick={() => {
                                          const page = Math.max(1, (postulantesPageByVacante[v.id_vacante] || 1) - 1);
                                          loadPostulantes(v.id_vacante, page, postulantesPageSizeByVacante[v.id_vacante]);
                                        }}
                                        disabled={(postulantesPageByVacante[v.id_vacante] || 1) <= 1}
                                        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                                      >Prev</button>

                                      {Array.from({ length: postulantesTotalPagesByVacante[v.id_vacante] || 0 }, (_, i) => i + 1).map((p) => (
                                        <button
                                          key={p}
                                          onClick={() => loadPostulantes(v.id_vacante, p, postulantesPageSizeByVacante[v.id_vacante])}
                                          className={`px-2 py-1 rounded ${p === (postulantesPageByVacante[v.id_vacante] || 1) ? 'bg-blue-600 text-white' : 'border bg-white'}`}
                                        >
                                          {p}
                                        </button>
                                      ))}

                                      <button
                                        onClick={() => {
                                          const page = (postulantesPageByVacante[v.id_vacante] || 1) + 1;
                                          loadPostulantes(v.id_vacante, page, postulantesPageSizeByVacante[v.id_vacante]);
                                        }}
                                        disabled={((postulantesPageByVacante[v.id_vacante] || 1) >= (postulantesTotalPagesByVacante[v.id_vacante] || 1))}
                                        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                                      >Next</button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    {/* Paginación vacantes */}
                    <div className="mt-3 flex items-center gap-2">
                      <label className="text-sm text-gray-600">Por página:</label>
                      <select
                        value={vacantesPageSizeByEmpresa[empresa.id_empresa] || 5}
                        onChange={(e) => {
                          const ps = Number(e.target.value) || 5;
                          setVacantesPageSizeByEmpresa((prev) => ({ ...prev, [empresa.id_empresa]: ps }));
                          loadVacantes(empresa.id_empresa, 1, ps);
                        }}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>

                      <button
                        onClick={() => {
                          const page = Math.max(1, (vacantesPageByEmpresa[empresa.id_empresa] || 1) - 1);
                          loadVacantes(empresa.id_empresa, page, vacantesPageSizeByEmpresa[empresa.id_empresa]);
                        }}
                        disabled={(vacantesPageByEmpresa[empresa.id_empresa] || 1) <= 1}
                        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                      >Prev</button>

                      {Array.from({ length: vacantesTotalPagesByEmpresa[empresa.id_empresa] || 0 }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => loadVacantes(empresa.id_empresa, p, vacantesPageSizeByEmpresa[empresa.id_empresa])}
                          className={`px-2 py-1 rounded ${p === (vacantesPageByEmpresa[empresa.id_empresa] || 1) ? 'bg-blue-600 text-white' : 'border bg-white'}`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => {
                          const page = (vacantesPageByEmpresa[empresa.id_empresa] || 1) + 1;
                          loadVacantes(empresa.id_empresa, page, vacantesPageSizeByEmpresa[empresa.id_empresa]);
                        }}
                        disabled={((vacantesPageByEmpresa[empresa.id_empresa] || 1) >= (vacantesTotalPagesByEmpresa[empresa.id_empresa] || 1))}
                        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                      >Next</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
