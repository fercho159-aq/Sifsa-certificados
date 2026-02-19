"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  FileText,
  History,
  Users,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cargar", label: "Cargar Archivo", icon: Upload },
  { href: "/admin/certificados", label: "Certificados", icon: FileText },
  { href: "/admin/historial", label: "Historial de Cargas", icon: History },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sifsa-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-6 border-b border-sifsa-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SIFSA</h1>
            <p className="text-xs text-sifsa-300">Panel Administrativo</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-sifsa-700 text-white"
                  : "text-sifsa-300 hover:bg-sifsa-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sifsa-700">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-sifsa-400 hover:text-white transition"
        >
          <FileText className="w-4 h-4" />
          Ver página pública
        </Link>
      </div>
    </aside>
  );
}
