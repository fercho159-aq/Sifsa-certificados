-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'OPERADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Certificado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "fechaServicio" DATETIME NOT NULL,
    "tecnico" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "tipoServicio" TEXT NOT NULL DEFAULT 'Fumigación',
    "productos" TEXT NOT NULL DEFAULT '',
    "observaciones" TEXT NOT NULL DEFAULT '',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL,
    "cargaArchivoId" TEXT,
    CONSTRAINT "Certificado_cargaArchivoId_fkey" FOREIGN KEY ("cargaArchivoId") REFERENCES "CargaArchivo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CargaArchivo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombreArchivo" TEXT NOT NULL,
    "tipoArchivo" TEXT NOT NULL,
    "totalRegistros" INTEGER NOT NULL,
    "registrosExito" INTEGER NOT NULL,
    "registrosError" INTEGER NOT NULL,
    "errores" TEXT NOT NULL DEFAULT '[]',
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,
    CONSTRAINT "CargaArchivo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConsultaLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "tecnico" TEXT NOT NULL DEFAULT '',
    "fecha" TEXT NOT NULL DEFAULT '',
    "encontrado" BOOLEAN NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '',
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_folio_key" ON "Certificado"("folio");
