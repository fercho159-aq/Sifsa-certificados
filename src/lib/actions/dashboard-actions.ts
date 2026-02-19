"use server";

import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalCertificados: number;
  certificadosActivos: number;
  totalCargas: number;
  totalConsultas: number;
  consultasExitosas: number;
  consultasFallidas: number;
  ultimasConsultas: {
    folio: string;
    encontrado: boolean;
    creadoEn: string;
  }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalCertificados,
    certificadosActivos,
    totalCargas,
    totalConsultas,
    consultasExitosas,
    ultimasConsultas,
  ] = await Promise.all([
    prisma.certificado.count(),
    prisma.certificado.count({ where: { activo: true } }),
    prisma.cargaArchivo.count(),
    prisma.consultaLog.count(),
    prisma.consultaLog.count({ where: { encontrado: true } }),
    prisma.consultaLog.findMany({
      orderBy: { creadoEn: "desc" },
      take: 10,
    }),
  ]);

  return {
    totalCertificados,
    certificadosActivos,
    totalCargas,
    totalConsultas,
    consultasExitosas,
    consultasFallidas: totalConsultas - consultasExitosas,
    ultimasConsultas: ultimasConsultas.map((c) => ({
      folio: c.folio,
      encontrado: c.encontrado,
      creadoEn: c.creadoEn.toISOString().replace("T", " ").slice(0, 19),
    })),
  };
}
