"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/actions/auth-actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // If successful, loginAction redirects via signIn()
    } catch {
      // NEXT_REDIRECT throws - this is expected on successful login
      // It will be caught by Next.js and perform the redirect
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sifsa-900 via-sifsa-800 to-sifsa-700">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sifsa-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-sifsa-600" />
            </div>
            <h1 className="text-2xl font-bold text-sifsa-900">SIFSA</h1>
            <p className="text-gray-500 mt-1">
              Sistema de Verificación de Certificados
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="admin@sifsa.com.mx"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none transition"
                placeholder="correo@sifsa.com.mx"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  defaultValue="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sifsa-500 focus:border-sifsa-500 outline-none transition pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-danger-100 text-danger-600 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sifsa-600 hover:bg-sifsa-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Demo: admin@sifsa.com.mx / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
