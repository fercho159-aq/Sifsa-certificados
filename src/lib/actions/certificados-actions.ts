"use server";

import { prisma } from "@/lib/prisma";

export interface CertificadoListItem {
  id: string;
  folio: string;
  fechaServicio: string;
  tecnico: string;
  cliente: string;
  ubicacion: string;
  tipoServicio: string;
  activo: boolean;
  creadoEn: string;
}

export async function getCertificados(
  search: string = "",
  page: number = 1,
  pageSize: number = 15
): Promise<{ data: CertificadoListItem[]; total: number; pages: number }> {
  const where = search
    ? {
        OR: [
          { folio: { contains: search } },
          { tecnico: { contains: search } },
          { cliente: { contains: search } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.certificado.findMany({
      where,
      orderBy: { creadoEn: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.certificado.count({ where }),
  ]);

  return {
    data: data.map((c) => ({
      id: c.id,
      folio: c.folio,
      fechaServicio: c.fechaServicio.toISOString().split("T")[0],
      tecnico: c.tecnico,
      cliente: c.cliente,
      ubicacion: c.ubicacion,
      tipoServicio: c.tipoServicio,
      activo: c.activo,
      creadoEn: c.creadoEn.toISOString().split("T")[0],
    })),
    total,
    pages: Math.ceil(total / pageSize),
  };
}

export async function toggleCertificado(id: string, activo: boolean) {
  await prisma.certificado.update({
    where: { id },
    data: { activo },
  });
}
