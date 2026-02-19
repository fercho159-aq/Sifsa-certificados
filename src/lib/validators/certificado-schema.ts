import { z } from "zod";

export const certificadoRowSchema = z.object({
  folio: z.string().min(1, "Folio es requerido"),
  fechaServicio: z.string().min(1, "Fecha es requerida"),
  tecnico: z.string().min(1, "Técnico es requerido"),
  cliente: z.string().min(1, "Cliente es requerido"),
  ubicacion: z.string().min(1, "Ubicación es requerida"),
  tipoServicio: z.string().optional().default("Fumigación"),
  productos: z.string().optional().default(""),
  observaciones: z.string().optional().default(""),
});

export type CertificadoRow = z.infer<typeof certificadoRowSchema>;
