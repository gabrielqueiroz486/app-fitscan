"use client";

import { ArrowLeft, Flame, Beef, Wheat, Droplet } from "lucide-react";
import { MealData } from "../page";

interface ResultsProps {
  meal: MealData | null;
  onBack: () => void;
}

export default function Results({ meal, onBack }: ResultsProps) {
  if (!meal) {
    return (
      <div className="min-h-screen p-6 pt-8 flex items-center justify-center">
        <p className="text-gray-400">Nenhuma refeição analisada</p>
      </div>
    );
  }

  const macros = [
    {
      icon: Beef,
      label: "Proteína",
      value: meal.protein,
      unit: "g",
      color: "#FF6B6B",
    },
    {
      icon: Wheat,
      label: "Carboidratos",
      value: meal.carbs,
      unit: "g",
      color: "#4ECDC4",
    },
    {
      icon: Droplet,
      label: "Gorduras",
      value: meal.fat,
      unit: "g",
      color: "#FFE66D",
    },
  ];

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
        <h1 className="text-2xl font-bold">Análise Completa</h1>
      </div>

      {/* Food Image */}
      <div className="mb-6">
        <img
          src={meal.image}
          alt={meal.foodName}
          className="w-full aspect-[4/3] object-cover rounded-3xl border border-[#2A2A2A]"
        />
      </div>

      {/* Food Name */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">{meal.foodName}</h2>
        <p className="text-gray-400 text-sm">
          Analisado em{" "}
          {new Date(meal.timestamp).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Calories Card */}
      <div className="bg-gradient-to-br from-[#00FF7F]/10 to-[#00CC66]/5 border border-[#00FF7F]/30 rounded-3xl p-8 mb-6 text-center">
        <Flame className="w-12 h-12 text-[#00FF7F] mx-auto mb-4" />
        <p className="text-5xl font-bold mb-2">{meal.calories}</p>
        <p className="text-gray-400">Calorias Totais</p>
      </div>

      {/* Macros */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Macronutrientes</h3>
        <div className="grid grid-cols-3 gap-3">
          {macros.map((macro, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 text-center hover:border-[#00FF7F]/30 transition-all duration-300"
            >
              <macro.icon
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: macro.color }}
              />
              <p className="text-2xl font-bold mb-1">
                {macro.value}
                <span className="text-sm text-gray-400">{macro.unit}</span>
              </p>
              <p className="text-xs text-gray-400">{macro.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#00FF7F]">
          Análise Detalhada
        </h3>
        <p className="text-gray-300 leading-relaxed">{meal.analysis}</p>
      </div>

      {/* Action Button */}
      <button
        onClick={onBack}
        className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] text-black font-semibold py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#00FF7F]/20"
      >
        Voltar ao Dashboard
      </button>
    </div>
  );
}
