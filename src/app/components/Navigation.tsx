"use client";

import { Home, Camera, History, User } from "lucide-react";
import { Screen } from "../page";

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function Navigation({
  currentScreen,
  onNavigate,
}: NavigationProps) {
  const navItems = [
    { id: "dashboard" as Screen, icon: Home, label: "Início" },
    { id: "camera" as Screen, icon: Camera, label: "Escanear" },
    { id: "history" as Screen, icon: History, label: "Histórico" },
    { id: "profile" as Screen, icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#2A2A2A] px-6 py-4 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive ? "scale-110" : "scale-100 opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-[#00FF7F] to-[#00CC66] shadow-lg shadow-[#00FF7F]/30"
                    : "bg-[#1A1A1A]"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 ${
                    isActive ? "text-black" : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-[#00FF7F]" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
