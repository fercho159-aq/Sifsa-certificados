"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCertificados,
  toggleCertificado,
  type CertificadoListItem,
} from "@/lib/actions/certificados-actions";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  FileText,
} from "lucide-react";

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<CertificadoListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await getCertificados(search, page);
    setCertificados(result.data);
    setTotal(result.total);
    setPages(result.pages);
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleToggle(id: string, currentState: boolean) {
    await toggleCertificado(id, !currentState);
    loadData();
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(1);
    loadData();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificados</h1>
          <p className="text-gray-500 mt-1">
            {total} certificados en total
          </p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por folio, técnico o cliente..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none text-sm"
          />
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Folio
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Técnico
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Servicio
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Estado
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : certificados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    No se encontraron certificados
                  </td>
                </tr>
              ) : (
                certificados.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sifsa-700 font-medium">
                      {cert.folio}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cert.fechaServicio}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{cert.tecnico}</td>
                    <td className="px-4 py-3 text-gray-800">{cert.cliente}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 bg-sifsa-50 text-sifsa-700 text-xs rounded-full font-medium">
                        {cert.tipoServicio}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs rounded-full font-medium ${
                          cert.activo
                            ? "bg-success-100 text-success-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cert.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggle(cert.id, cert.activo)}
                        className="text-gray-400 hover:text-sifsa-600 transition"
                        title={cert.activo ? "Desactivar" : "Activar"}
                      >
                        {cert.activo ? (
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

        {/* Pagination */}
        {pages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Página {page} de {pages} ({total} registros)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="p-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
