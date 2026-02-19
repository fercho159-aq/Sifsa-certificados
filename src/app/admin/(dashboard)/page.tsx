import { getDashboardStats } from "@/lib/actions/dashboard-actions";
import {
  FileText,
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Resumen general del sistema de certificados
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Certificados"
          value={stats.totalCertificados}
          sub={`${stats.certificadosActivos} activos`}
          icon={<FileText className="w-5 h-5" />}
          color="sifsa"
        />
        <StatCard
          label="Cargas de Archivo"
          value={stats.totalCargas}
          sub="archivos importados"
          icon={<Upload className="w-5 h-5" />}
          color="accent"
        />
        <StatCard
          label="Verificaciones"
          value={stats.totalConsultas}
          sub="consultas totales"
          icon={<Search className="w-5 h-5" />}
          color="info"
        />
        <StatCard
          label="Tasa de Éxito"
          value={
            stats.totalConsultas > 0
              ? `${Math.round((stats.consultasExitosas / stats.totalConsultas) * 100)}%`
              : "N/A"
          }
          sub={`${stats.consultasExitosas} encontrados`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="success"
        />
      </div>

      {/* Recent Consultations */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Últimas Verificaciones
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {stats.ultimasConsultas.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No hay consultas registradas
            </div>
          ) : (
            stats.ultimasConsultas.map((consulta, i) => (
              <div
                key={i}
                className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {consulta.encontrado ? (
                    <CheckCircle2 className="w-4 h-4 text-success-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-danger-600" />
                  )}
                  <span className="font-mono text-sm text-gray-800">
                    {consulta.folio}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      consulta.encontrado
                        ? "bg-success-100 text-success-600"
                        : "bg-danger-100 text-danger-600"
                    }`}
                  >
                    {consulta.encontrado ? "Encontrado" : "No encontrado"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {consulta.creadoEn}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  color: "sifsa" | "accent" | "info" | "success";
}) {
  const colorStyles = {
    sifsa: "bg-sifsa-50 text-sifsa-600",
    accent: "bg-amber-50 text-accent-600",
    info: "bg-blue-50 text-blue-600",
    success: "bg-success-100 text-success-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorStyles[color]}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
