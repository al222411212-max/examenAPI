"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { Empresa } from "@/types";

export default function EmpresaForm() {
  const [formData, setFormData] = useState<Empresa>({
    nombre: "",
    giro: "",
    tamaño: "",
    teléfono: "",
    fecha_registro: new Date().toISOString().split("T")[0],
    ciudad: "",
    dirección: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sugerirCiudad = () => {
    const ciudades = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga", "Murcia", "Zaragoza"];
    const ciudad = ciudades[Math.floor(Math.random() * ciudades.length)];
    setFormData((prev) => ({ ...prev, ciudad }));
  };

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      if (!navigator.geolocation) {
        setMessage("Geolocalización no disponible en tu navegador");
        setMessageType("error");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            setFormData((prev) => ({
              ...prev,
              ciudad: data.address?.city || data.address?.town || data.address?.village || "",
              dirección: `${data.address?.road || ""} ${data.address?.house_number || ""}`.trim(),
            }));
            setMessage("Ubicación detectada exitosamente");
            setMessageType("success");
          } catch (err) {
            setMessage("No se pudo obtener la dirección");
            setMessageType("error");
          }
        },
        () => {
          setMessage("Permiso de ubicación denegado");
          setMessageType("error");
        }
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.giro || !formData.tamaño || !formData.teléfono || !formData.ciudad || !formData.dirección) {
      setMessage("Por favor completa todos los campos");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/empresas", formData);
      setMessage("Empresa registrada exitosamente");
      setMessageType("success");
      setFormData({
        nombre: "",
        giro: "",
        tamaño: "",
        teléfono: "",
        fecha_registro: new Date().toISOString().split("T")[0],
        ciudad: "",
        dirección: "",
      });
      setTimeout(() => setMessage(""), 4000);
    } catch (error: any) {
      setMessage("Error al registrar la empresa: " + (error.response?.data?.error || error.message || "Error desconocido"));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Nueva Empresa</h2>

      {message && (
        <div className={`mb-4 p-4 rounded-lg border-l-4 ${messageType === "success" ? "bg-green-50 border-green-400 text-green-800" : "bg-red-50 border-red-400 text-red-800"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giro Empresarial *</label>
            <input
              type="text"
              name="giro"
              value={formData.giro}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño *</label>
            <select
              name="tamaño"
              value={formData.tamaño}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Seleccionar Tamaño</option>
              <option value="Pequeña">Pequeña (1-50 empleados)</option>
              <option value="Mediana">Mediana (51-500 empleados)</option>
              <option value="Grande">Grande (500+ empleados)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
            <input
              type="tel"
              name="teléfono"
              value={formData.teléfono}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={sugerirCiudad}
                className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium text-sm"
              >
                Sugerir
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
            <input
              type="text"
              name="dirección"
              value={formData.dirección}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Fecha de Registro:</strong> {formData.fecha_registro}
          </p>
        </div>

        <button
          type="button"
          onClick={getLocation}
          disabled={loadingLocation || loading}
          className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:from-gray-400 disabled:to-gray-400"
        >
          {loadingLocation ? 'Detectando ubicación...' : 'Detectar Ubicación'}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:from-gray-400 disabled:to-gray-400 transform hover:scale-105 disabled:scale-100"
        >
          {loading ? 'Registrando...' : 'Registrar Empresa'}
        </button>
      </form>
    </div>
  );
}
