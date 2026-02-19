"use client";

import { useState } from "react";
import { verificarCertificado, type VerificationResult } from "@/lib/actions/verificar-actions";
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  User,
  MapPin,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function VerificacionPage() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const res = await verificarCertificado(formData);

    setResult(res);
    setLoading(false);
  }

  function handleReset() {
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sifsa-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sifsa-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sifsa-900">SIFSA</h1>
              <p className="text-xs text-gray-500">
                Servicios Integrales de Fumigación
              </p>
            </div>
          </div>
          <a
            href="/admin/login"
            className="text-sm text-sifsa-600 hover:text-sifsa-800 transition font-medium"
          >
            Acceso Admin
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-sifsa-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Verificación de Certificados
          </h2>
          <p className="text-sifsa-200 text-lg max-w-2xl mx-auto">
            Confirme la autenticidad de su certificado de servicio ingresando el
            número de folio proporcionado en su documento.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-8">
        {!result ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="folio"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Número de Folio *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="folio"
                    name="folio"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none transition"
                    placeholder="Ej: SIFSA-2026-00001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fecha"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Fecha del Servicio{" "}
                    <span className="text-gray-400">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="fecha"
                      name="fecha"
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="tecnico"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Nombre del Técnico{" "}
                    <span className="text-gray-400">(opcional)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="tecnico"
                      name="tecnico"
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none transition"
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sifsa-600 hover:bg-sifsa-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Verificar Certificado
                  </>
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-2">
                Datos de prueba (demo):
              </p>
              <ul className="text-xs text-amber-600 space-y-1">
                <li><span className="font-mono font-bold">SIFSA-2026-00001</span> &mdash; Carlos Mart&iacute;nez Ruiz</li>
                <li><span className="font-mono font-bold">SIFSA-2026-00005</span> &mdash; Juan P&eacute;rez L&oacute;pez</li>
                <li><span className="font-mono font-bold">SIFSA-2026-00010</span> &mdash; Juan P&eacute;rez L&oacute;pez</li>
                <li className="text-amber-500 italic">Folios del 00001 al 00020 disponibles</li>
              </ul>
            </div>
          </div>
        ) : result.found && result.certificado ? (
          <div className="bg-white rounded-xl shadow-lg border border-success-500 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-3">
                <CheckCircle2 className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-xl font-bold text-success-600">
                Certificado Válido
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                El certificado ha sido verificado exitosamente
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 space-y-3">
              <InfoRow label="Folio" value={result.certificado.folio} />
              <InfoRow
                label="Fecha de Servicio"
                value={formatDate(result.certificado.fechaServicio)}
              />
              <InfoRow label="Técnico" value={result.certificado.tecnico} />
              <InfoRow label="Cliente" value={result.certificado.cliente} />
              <InfoRow
                label="Ubicación"
                value={result.certificado.ubicacion}
                icon={<MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />}
              />
              <InfoRow
                label="Tipo de Servicio"
                value={result.certificado.tipoServicio}
              />
              {result.certificado.productos && (
                <InfoRow
                  label="Productos"
                  value={result.certificado.productos}
                />
              )}
              {result.certificado.observaciones && (
                <InfoRow
                  label="Observaciones"
                  value={result.certificado.observaciones}
                />
              )}
            </div>

            <button
              onClick={handleReset}
              className="mt-6 w-full flex items-center justify-center gap-2 text-sifsa-600 hover:text-sifsa-800 font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Realizar otra verificación
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-danger-500 p-8">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-danger-100 rounded-full mb-3">
                <XCircle className="w-8 h-8 text-danger-600" />
              </div>
              <h3 className="text-xl font-bold text-danger-600">
                Certificado No Encontrado
              </h3>
              <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                No se encontró un certificado que coincida con los datos
                proporcionados. Verifique que el folio sea correcto.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sifsa-600 hover:text-sifsa-800 font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SIFSA - Servicios Integrales de Fumigación, S.A. de C.V.</p>
          <p className="mt-1">Sistema de Verificación de Certificados</p>
        </div>
      </footer>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4 text-sm py-1 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="font-medium text-gray-800 text-right flex items-start gap-1">
        {icon}
        {value}
      </span>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
}
