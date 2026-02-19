"use server";

import { prisma } from "@/lib/prisma";

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export interface VerificationResult {
  found: boolean;
  certificado?: {
    folio: string;
    fechaServicio: string;
    tecnico: string;
    cliente: string;
    ubicacion: string;
    tipoServicio: string;
    productos: string;
    observaciones: string;
  };
}

export async function verificarCertificado(formData: FormData): Promise<VerificationResult> {
  const folio = (formData.get("folio") as string || "").trim();
  const tecnico = (formData.get("tecnico") as string || "").trim();
  const fecha = (formData.get("fecha") as string || "").trim();

  if (!folio) {
    return { found: false };
  }

  // Search by folio (SQLite LIKE is case-insensitive by default for ASCII)
  const certificado = await prisma.certificado.findFirst({
    where: {
      folio: { equals: folio },
      activo: true,
    },
  }) ?? await prisma.certificado.findFirst({
    where: {
      folio: { contains: folio },
      activo: true,
    },
  });

  let found = false;

  if (certificado) {
    found = true;

    // Additional validation: check technician name if provided
    if (tecnico && normalize(certificado.tecnico) !== normalize(tecnico)) {
      found = false;
    }

    // Additional validation: check date if provided
    if (fecha) {
      const certDate = certificado.fechaServicio.toISOString().split("T")[0];
      if (certDate !== fecha) {
        found = false;
      }
    }
  }

  // Log the consultation
  await prisma.consultaLog.create({
    data: {
      folio,
      tecnico,
      fecha,
      encontrado: found,
      ip: "server",
    },
  });

  if (found && certificado) {
    return {
      found: true,
      certificado: {
        folio: certificado.folio,
        fechaServicio: certificado.fechaServicio.toISOString().split("T")[0],
        tecnico: certificado.tecnico,
        cliente: certificado.cliente,
        ubicacion: certificado.ubicacion,
        tipoServicio: certificado.tipoServicio,
        productos: certificado.productos,
        observaciones: certificado.observaciones,
      },
    };
  }

  return { found: false };
}
