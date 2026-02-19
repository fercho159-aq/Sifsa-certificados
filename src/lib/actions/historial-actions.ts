"use server";

import { prisma } from "@/lib/prisma";

export interface CargaListItem {
  id: string;
  nombreArchivo: string;
  tipoArchivo: string;
  totalRegistros: number;
  registrosExito: number;
  registrosError: number;
  usuario: string;
  creadoEn: string;
}

export async function getHistorialCargas(): Promise<CargaListItem[]> {
  const cargas = await prisma.cargaArchivo.findMany({
    include: { usuario: { select: { nombre: true } } },
    orderBy: { creadoEn: "desc" },
  });

  return cargas.map((c) => ({
    id: c.id,
    nombreArchivo: c.nombreArchivo,
    tipoArchivo: c.tipoArchivo,
    totalRegistros: c.totalRegistros,
    registrosExito: c.registrosExito,
    registrosError: c.registrosError,
    usuario: c.usuario.nombre,
    creadoEn: c.creadoEn.toISOString().replace("T", " ").slice(0, 19),
  }));
}
