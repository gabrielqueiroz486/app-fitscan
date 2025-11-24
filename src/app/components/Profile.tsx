"use client";

import { ArrowLeft, User, Target, Activity, Bell, Shield, LogOut } from "lucide-react";
import { signOut, type AuthUser } from "@/lib/auth";
import { useState } from "react";

interface ProfileProps {
  onBack: () => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export default function Profile({ onBack, user, onLogout }: ProfileProps) {
  const [loading, setLoading] = useState(false);

  const settings = [
    {
      icon: Target,
      label: "Meta Diária",
      value: "2000 calorias",
      color: "#00FF7F",
    },
    {
      icon: Activity,
      label: "Nível de Atividade",
      value: "Moderado",
      color: "#4ECDC4",
    },
    { icon: Bell, label: "Notificações", value: "Ativadas", color: "#FFE66D" },
    {
      icon: Shield,
      label: "Privacidade",
      value: "Configurar",
      color: "#FF6B6B",
    },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center hover:border-[#00FF7F]/50 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Perfil</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-3xl p-8 mb-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[#00FF7F] to-[#00CC66] rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-black" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {user?.email?.split("@")[0] || "Usuário FitScan"}
        </h2>
        <p className="text-gray-400 mb-4 text-sm">{user?.email}</p>
        <div className="flex justify-center gap-8 pt-4 border-t border-[#2A2A2A]">
          <div>
            <p className="text-2xl font-bold text-[#00FF7F]">12</p>
            <p className="text-xs text-gray-400">Refeições</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#00FF7F]">7</p>
            <p className="text-xs text-gray-400">Dias Ativos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#00FF7F]">3</p>
            <p className="text-xs text-gray-400">Conquistas</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Configurações</h3>
        <div className="space-y-3">
          {settings.map((setting, i) => (
            <button
              key={i}
              className="w-full bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-5 flex items-center gap-4 hover:border-[#00FF7F]/30 transition-all duration-300 text-left"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${setting.color}20` }}
              >
                <setting.icon
                  className="w-6 h-6"
                  style={{ color: setting.color }}
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">{setting.label}</p>
                <p className="text-sm text-gray-400">{setting.value}</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-5 flex items-center justify-center gap-3 hover:border-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
      >
        <LogOut className="w-5 h-5 text-red-400" />
        <span className="font-semibold text-red-400">
          {loading ? "Saindo..." : "Sair da Conta"}
        </span>
      </button>

      {/* About */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#00FF7F]">
          Sobre o FitScan
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-4">
          FitScan usa inteligência artificial avançada para analisar suas
          refeições e fornecer informações nutricionais precisas
          instantaneamente.
        </p>
        <p className="text-xs text-gray-500">Versão 1.0.0</p>
      </div>
    </div>
  );
}
