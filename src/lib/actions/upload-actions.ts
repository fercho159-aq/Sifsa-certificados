"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { certificadoRowSchema, type CertificadoRow } from "@/lib/validators/certificado-schema";

interface UploadResult {
  success: boolean;
  totalRegistros: number;
  registrosExito: number;
  registrosError: number;
  errores: string[];
  cargaId?: string;
}

export async function uploadCertificados(
  rows: CertificadoRow[],
  fileName: string,
  fileType: string
): Promise<UploadResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      totalRegistros: 0,
      registrosExito: 0,
      registrosError: 0,
      errores: ["No autorizado"],
    };
  }

  const errores: string[] = [];
  let registrosExito = 0;
  let registrosError = 0;

  // Validate all rows first
  const validRows: { data: CertificadoRow; index: number }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const result = certificadoRowSchema.safeParse(rows[i]);
    if (!result.success) {
      registrosError++;
      const issues = result.error.issues.map((e) => e.message).join(", ");
      errores.push(`Fila ${i + 1}: ${issues}`);
    } else {
      validRows.push({ data: result.data, index: i });
    }
  }

  // Create the upload record
  const carga = await prisma.cargaArchivo.create({
    data: {
      nombreArchivo: fileName,
      tipoArchivo: fileType,
      totalRegistros: rows.length,
      registrosExito: 0,
      registrosError: registrosError,
      errores: JSON.stringify(errores),
      usuarioId: session.user.id,
    },
  });

  // Insert valid rows
  for (const { data, index } of validRows) {
    try {
      // Parse date
      let fecha: Date;
      if (data.fechaServicio.includes("/")) {
        const parts = data.fechaServicio.split("/");
        if (parts[2].length === 4) {
          // DD/MM/YYYY
          fecha = new Date(
            parseInt(parts[2]),
            parseInt(parts[1]) - 1,
            parseInt(parts[0])
          );
        } else {
          // MM/DD/YY or similar
          fecha = new Date(data.fechaServicio);
        }
      } else {
        fecha = new Date(data.fechaServicio);
      }

      if (isNaN(fecha.getTime())) {
        throw new Error("Fecha inválida");
      }

      await prisma.certificado.create({
        data: {
          folio: data.folio.trim(),
          fechaServicio: fecha,
          tecnico: data.tecnico.trim(),
          cliente: data.cliente.trim(),
          ubicacion: data.ubicacion.trim(),
          tipoServicio: data.tipoServicio || "Fumigación",
          productos: data.productos || "",
          observaciones: data.observaciones || "",
          cargaArchivoId: carga.id,
        },
      });
      registrosExito++;
    } catch (error) {
      registrosError++;
      const msg =
        error instanceof Error ? error.message : "Error desconocido";
      errores.push(
        `Fila ${index + 1} (${data.folio}): ${msg.includes("Unique constraint") ? "Folio duplicado" : msg}`
      );
    }
  }

  // Update the upload record with final counts
  await prisma.cargaArchivo.update({
    where: { id: carga.id },
    data: {
      registrosExito,
      registrosError,
      errores: JSON.stringify(errores),
    },
  });

  return {
    success: true,
    totalRegistros: rows.length,
    registrosExito,
    registrosError,
    errores,
    cargaId: carga.id,
  };
}
