import { getHistorialCargas } from "@/lib/actions/historial-actions";
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react";

export default async function HistorialPage() {
  const cargas = await getHistorialCargas();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Historial de Cargas
        </h1>
        <p className="text-gray-500 mt-1">
          Registro de todos los archivos importados al sistema
        </p>
      </div>

      {cargas.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            No se han realizado cargas de archivos
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cargas.map((carga) => (
            <div
              key={carga.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-sifsa-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5 text-sifsa-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {carga.nombreArchivo}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {carga.creadoEn}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {carga.usuario}
                      </span>
                      <span className="uppercase text-xs font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                        {carga.tipoArchivo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-gray-900">
                      {carga.totalRegistros}
                    </p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-success-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {carga.registrosExito}
                    </p>
                    <p className="text-xs text-gray-400">Exitosos</p>
                  </div>
                  {carga.registrosError > 0 && (
                    <div className="text-center">
                      <p className="font-bold text-danger-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {carga.registrosError}
                      </p>
                      <p className="text-xs text-gray-400">Errores</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
