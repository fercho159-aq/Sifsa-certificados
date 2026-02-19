"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getUsuarios,
  createUsuario,
  toggleUsuario,
  type UsuarioListItem,
} from "@/lib/actions/usuarios-actions";
import {
  UserPlus,
  ToggleLeft,
  ToggleRight,
  X,
  Users,
} from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getUsuarios();
    setUsuarios(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const result = await createUsuario(formData);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    setShowForm(false);
    loadData();
  }

  async function handleToggle(id: string, currentState: boolean) {
    await toggleUsuario(id, !currentState);
    loadData();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 mt-1">
            Gestión de usuarios del sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-sifsa-600 hover:bg-sifsa-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Nuevo Usuario
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  name="nombre"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  name="rol"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none text-sm"
                >
                  <option value="OPERADOR">Operador</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              {formError && (
                <div className="bg-danger-100 text-danger-600 text-sm px-3 py-2 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-sifsa-600 hover:bg-sifsa-700 text-white rounded-lg transition"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Nombre
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Rol
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Estado
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Creado
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {u.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full font-medium ${
                        u.rol === "ADMIN"
                          ? "bg-accent-400/20 text-accent-600"
                          : "bg-sifsa-50 text-sifsa-700"
                      }`}
                    >
                      {u.rol === "ADMIN" ? "Administrador" : "Operador"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full font-medium ${
                        u.activo
                          ? "bg-success-100 text-success-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.creadoEn}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggle(u.id, u.activo)}
                      className="text-gray-400 hover:text-sifsa-600 transition"
                      title={u.activo ? "Desactivar" : "Activar"}
                    >
                      {u.activo ? (
                        <ToggleRight className="w-5 h-5 text-success-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
