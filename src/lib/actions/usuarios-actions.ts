"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export interface UsuarioListItem {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  creadoEn: string;
}

export async function getUsuarios(): Promise<UsuarioListItem[]> {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { creadoEn: "desc" },
  });

  return usuarios.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    activo: u.activo,
    creadoEn: u.creadoEn.toISOString().split("T")[0],
  }));
}

export async function createUsuario(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "No autorizado" };
  }

  const nombre = formData.get("nombre") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rol = formData.get("rol") as string;

  if (!nombre || !email || !password) {
    return { error: "Todos los campos son requeridos" };
  }

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe un usuario con ese correo" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.usuario.create({
    data: {
      nombre,
      email,
      password: hashedPassword,
      rol: rol || "OPERADOR",
    },
  });

  return { success: true };
}

export async function toggleUsuario(id: string, activo: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "No autorizado" };
  }

  await prisma.usuario.update({
    where: { id },
    data: { activo },
  });
}
