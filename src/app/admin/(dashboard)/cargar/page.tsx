"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { uploadCertificados } from "@/lib/actions/upload-actions";
import type { CertificadoRow } from "@/lib/validators/certificado-schema";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";

// Column mapping: expected field -> possible header names
const COLUMN_MAP: Record<keyof CertificadoRow, string[]> = {
  folio: ["folio", "no. folio", "numero de folio", "num_folio", "nfolio"],
  fechaServicio: ["fecha", "fecha de servicio", "fecha_servicio", "date"],
  tecnico: ["tecnico", "técnico", "nombre del tecnico", "technician"],
  cliente: ["cliente", "nombre del cliente", "client", "customer"],
  ubicacion: ["ubicacion", "ubicación", "direccion", "dirección", "address"],
  tipoServicio: ["tipo de servicio", "tipo_servicio", "servicio", "service"],
  productos: ["productos", "producto", "products"],
  observaciones: ["observaciones", "notas", "notes", "observations"],
};

function normalizeHeader(header: string): string {
  return header
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[_\-\.]/g, " ");
}

function mapColumns(rawHeaders: string[]): Record<string, keyof CertificadoRow> {
  const mapping: Record<string, keyof CertificadoRow> = {};

  for (const rawHeader of rawHeaders) {
    const normalized = normalizeHeader(rawHeader);
    for (const [field, aliases] of Object.entries(COLUMN_MAP)) {
      if (aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized))) {
        mapping[rawHeader] = field as keyof CertificadoRow;
        break;
      }
    }
  }

  return mapping;
}

function parseRows(rawData: Record<string, string>[]): CertificadoRow[] {
  if (rawData.length === 0) return [];

  const headers = Object.keys(rawData[0]);
  const columnMapping = mapColumns(headers);

  return rawData.map((raw) => {
    const row: Partial<CertificadoRow> = {};
    for (const [header, value] of Object.entries(raw)) {
      const field = columnMapping[header];
      if (field) {
        row[field] = String(value || "").trim();
      }
    }
    return row as CertificadoRow;
  });
}

type UploadStep = "select" | "preview" | "uploading" | "done";

interface UploadReport {
  totalRegistros: number;
  registrosExito: number;
  registrosError: number;
  errores: string[];
}

export default function CargarPage() {
  const [step, setStep] = useState<UploadStep>("select");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [parsedRows, setParsedRows] = useState<CertificadoRow[]>([]);
  const [report, setReport] = useState<UploadReport | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    setFileType(ext);

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = parseRows(results.data as Record<string, string>[]);
          setParsedRows(rows);
          setStep("preview");
        },
      });
    } else {
      // Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
          raw: false,
        });
        const rows = parseRows(rawData);
        setParsedRows(rows);
        setStep("preview");
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  async function handleConfirm() {
    setStep("uploading");
    const result = await uploadCertificados(parsedRows, fileName, fileType);
    setReport(result);
    setStep("done");
  }

  function handleReset() {
    setStep("select");
    setFileName("");
    setFileType("");
    setParsedRows([]);
    setReport(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cargar Archivo</h1>
        <p className="text-gray-500 mt-1">
          Suba un archivo Excel (.xlsx) o CSV con certificados de servicio
        </p>
        <a
          href="/ejemplo-certificados.csv"
          download
          className="inline-flex items-center gap-1 mt-2 text-sm text-sifsa-600 hover:text-sifsa-800 underline"
        >
          Descargar CSV de ejemplo para pruebas
        </a>
      </div>

      {step === "select" && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
            isDragActive
              ? "border-sifsa-500 bg-sifsa-50"
              : "border-gray-300 hover:border-sifsa-400 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            {isDragActive
              ? "Suelte el archivo aquí..."
              : "Arrastre un archivo aquí o haga clic para seleccionar"}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Formatos soportados: .xlsx, .xls, .csv
          </p>
        </div>
      )}

      {step === "preview" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-sifsa-600" />
              <div>
                <p className="font-medium text-gray-800">{fileName}</p>
                <p className="text-sm text-gray-500">
                  {parsedRows.length} registros encontrados
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">#</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Folio</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Fecha</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Técnico</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Cliente</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parsedRows.slice(0, 50).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 font-mono text-sifsa-700">
                      {row.folio || <span className="text-danger-500">--</span>}
                    </td>
                    <td className="px-4 py-2">
                      {row.fechaServicio || <span className="text-danger-500">--</span>}
                    </td>
                    <td className="px-4 py-2">
                      {row.tecnico || <span className="text-danger-500">--</span>}
                    </td>
                    <td className="px-4 py-2">
                      {row.cliente || <span className="text-danger-500">--</span>}
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate">
                      {row.ubicacion || <span className="text-danger-500">--</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedRows.length > 50 && (
              <p className="p-3 text-center text-sm text-gray-400">
                Mostrando 50 de {parsedRows.length} registros
              </p>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="bg-sifsa-600 hover:bg-sifsa-700 text-white font-medium px-6 py-2 rounded-lg transition"
            >
              Confirmar e Importar {parsedRows.length} Registros
            </button>
          </div>
        </div>
      )}

      {step === "uploading" && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Loader2 className="w-12 h-12 text-sifsa-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Importando certificados...
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Esto puede tomar unos momentos
          </p>
        </div>
      )}

      {step === "done" && report && (
        <div className="space-y-4">
          <div
            className={`rounded-xl border p-6 ${
              report.registrosError === 0
                ? "bg-success-100 border-success-500"
                : "bg-accent-400/10 border-accent-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {report.registrosError === 0 ? (
                <CheckCircle2 className="w-6 h-6 text-success-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-accent-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Importación Completada
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {report.totalRegistros}
                    </p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success-600">
                      {report.registrosExito}
                    </p>
                    <p className="text-sm text-gray-500">Exitosos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-danger-600">
                      {report.registrosError}
                    </p>
                    <p className="text-sm text-gray-500">Errores</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {report.errores.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-medium text-gray-800 mb-2">
                Detalle de errores:
              </h4>
              <ul className="space-y-1 text-sm text-danger-600 max-h-48 overflow-auto">
                {report.errores.map((err, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="shrink-0">*</span> {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleReset}
            className="bg-sifsa-600 hover:bg-sifsa-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Cargar Otro Archivo
          </button>
        </div>
      )}
    </div>
  );
}
