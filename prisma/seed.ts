import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.consultaLog.deleteMany();
  await prisma.certificado.deleteMany();
  await prisma.cargaArchivo.deleteMany();
  await prisma.usuario.deleteMany();

  // Create users
  const adminPassword = await bcrypt.hash("password", 10);
  const operadorPassword = await bcrypt.hash("password", 10);

  const admin = await prisma.usuario.create({
    data: {
      nombre: "Administrador SIFSA",
      email: "admin@sifsa.com.mx",
      password: adminPassword,
      rol: "ADMIN",
    },
  });

  const operador = await prisma.usuario.create({
    data: {
      nombre: "María García",
      email: "operador@sifsa.com.mx",
      password: operadorPassword,
      rol: "OPERADOR",
    },
  });

  // Create a file upload record
  const carga = await prisma.cargaArchivo.create({
    data: {
      nombreArchivo: "certificados_enero_2026.xlsx",
      tipoArchivo: "xlsx",
      totalRegistros: 20,
      registrosExito: 20,
      registrosError: 0,
      usuarioId: admin.id,
    },
  });

  // Technicians and clients for demo
  const tecnicos = [
    "Juan Pérez López",
    "Carlos Martínez Ruiz",
    "Roberto Sánchez García",
    "Miguel Ángel Torres",
    "Fernando Hernández Díaz",
  ];

  const clientes = [
    "Restaurante El Buen Sabor",
    "Hotel Plaza Central",
    "Bodega Industrial Norte",
    "Clínica Santa María",
    "Escuela Primaria Benito Juárez",
    "Supermercado La Esperanza",
    "Oficinas Corporativas Reforma",
    "Fábrica de Alimentos del Valle",
    "Centro Comercial Patio",
    "Hospital Regional Sur",
  ];

  const ubicaciones = [
    "Av. Reforma 123, Col. Centro, CDMX",
    "Blvd. Insurgentes 456, Col. Roma, CDMX",
    "Calle 5 de Mayo 789, Col. Juárez, CDMX",
    "Carretera Federal 45 Km 12, Querétaro",
    "Av. Universidad 321, Col. Del Valle, CDMX",
    "Calle Hidalgo 654, Col. Centro, Puebla",
    "Periférico Sur 987, Col. Pedregal, CDMX",
    "Av. Constituyentes 147, Col. América, CDMX",
    "Blvd. Ávila Camacho 258, Naucalpan, Edo. Méx.",
    "Calz. de Tlalpan 369, Col. Portales, CDMX",
  ];

  const tiposServicio = [
    "Fumigación",
    "Control de Plagas",
    "Desinfección",
    "Fumigación y Desinfección",
    "Control de Roedores",
  ];

  const productos = [
    "Cipermetrina 20%, Deltametrina 2.5%",
    "Fipronil 0.05%, Gel cucarachicida",
    "Amonio cuaternario, Peróxido de hidrógeno",
    "Brodifacoum en bloques parafinados",
    "Lambda-cihalotrina 10%, Imidacloprid 21%",
  ];

  // Create 20 certificates
  const certificados = [];
  for (let i = 1; i <= 20; i++) {
    const folio = `SIFSA-2026-${String(i).padStart(5, "0")}`;
    const day = Math.floor(Math.random() * 28) + 1;
    const month = Math.floor(Math.random() * 2); // Jan or Feb
    const fecha = new Date(2026, month, day);

    certificados.push({
      folio,
      fechaServicio: fecha,
      tecnico: tecnicos[i % tecnicos.length],
      cliente: clientes[i % clientes.length],
      ubicacion: ubicaciones[i % ubicaciones.length],
      tipoServicio: tiposServicio[i % tiposServicio.length],
      productos: productos[i % productos.length],
      observaciones:
        i % 3 === 0 ? "Servicio realizado sin novedad." : "",
      activo: true,
      cargaArchivoId: carga.id,
    });
  }

  for (const cert of certificados) {
    await prisma.certificado.create({ data: cert });
  }

  // Create some consultation logs
  const logs = [
    { folio: "SIFSA-2026-00001", tecnico: "Juan Pérez López", fecha: "2026-01-15", encontrado: true },
    { folio: "SIFSA-2026-00005", tecnico: "", fecha: "", encontrado: true },
    { folio: "SIFSA-FAKE-99999", tecnico: "", fecha: "", encontrado: false },
    { folio: "SIFSA-2026-00010", tecnico: "Roberto Sánchez García", fecha: "2026-01-20", encontrado: true },
    { folio: "ABC-123", tecnico: "", fecha: "", encontrado: false },
  ];

  for (const log of logs) {
    await prisma.consultaLog.create({
      data: {
        ...log,
        ip: "127.0.0.1",
      },
    });
  }

  console.log("Seed completed:");
  console.log("  - 2 usuarios (admin@sifsa.com.mx / operador@sifsa.com.mx)");
  console.log("  - 1 carga de archivo");
  console.log("  - 20 certificados (SIFSA-2026-00001 a SIFSA-2026-00020)");
  console.log("  - 5 consulta logs");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
