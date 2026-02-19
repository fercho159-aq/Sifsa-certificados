"use client";

import { LogOut, User } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";

interface TopbarProps {
  userName: string;
  userRole: string;
}

export default function Topbar({ userName, userRole }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-sm text-gray-400">
          Sistema de Verificación de Certificados
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-sifsa-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-sifsa-600" />
          </div>
          <div>
            <p className="font-medium text-gray-700 leading-tight">{userName}</p>
            <p className="text-xs text-gray-400">{userRole}</p>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-danger-600 transition px-2 py-1 rounded"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
