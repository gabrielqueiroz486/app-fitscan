"use client";

import { Camera, TrendingUp, Award, Flame } from "lucide-react";
import { Screen, MealData } from "../page";

interface DashboardProps {
  meals: MealData[];
  onNavigate: (screen: Screen) => void;
}

export default function Dashboard({ meals, onNavigate }: DashboardProps) {
  const todayCalories = meals
    .filter((meal) => {
      const today = new Date();
      const mealDate = new Date(meal.timestamp);
      return mealDate.toDateString() === today.toDateString();
    })
    .reduce((sum, meal) => sum + meal.calories, 0);

  const dailyGoal = 2000;
  const progress = Math.min((todayCalories / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen p-6 pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 font-inter">
          Fit<span className="text-[#00FF7F]">Scan</span>
        </h1>
        <p className="text-gray-400">Bem-vindo de volta! 👋</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#00FF7F]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <Flame className="w-5 h-5 text-[#00FF7F]" />
            <span className="text-xs text-gray-500">Hoje</span>
          </div>
          <p className="text-2xl font-bold mb-1">{todayCalories}</p>
          <p className="text-xs text-gray-400">Calorias</p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#00FF7F]/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-5 h-5 text-[#00FF7F]" />
            <span className="text-xs text-gray-500">Meta</span>
          </div>
          <p className="text-2xl font-bold mb-1">{dailyGoal}</p>
          <p className="text-xs text-gray-400">Objetivo</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Progresso Diário</h3>
          <span className="text-sm text-[#00FF7F] font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {dailyGoal - todayCalories > 0
            ? `Faltam ${dailyGoal - todayCalories} calorias para sua meta`
            : "Meta alcançada! 🎉"}
        </p>
      </div>

      {/* Scan Button */}
      <button
        onClick={() => onNavigate("camera")}
        className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] text-black font-semibold py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#00FF7F]/20"
      >
        <Camera className="w-6 h-6" />
        Escanear Refeição
      </button>

      {/* Achievements */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Conquistas</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🔥", label: "7 dias", active: meals.length >= 7 },
            { icon: "⭐", label: "Meta", active: todayCalories >= dailyGoal },
            { icon: "💪", label: "Proteína", active: false },
          ].map((achievement, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border ${
                achievement.active
                  ? "border-[#00FF7F]/50"
                  : "border-[#2A2A2A]"
              } rounded-xl p-4 text-center transition-all duration-300`}
            >
              <div className="text-3xl mb-2 filter grayscale-0">
                {achievement.icon}
              </div>
              <p className="text-xs text-gray-400">{achievement.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Meals */}
      {meals.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Refeições Recentes</h3>
            <button
              onClick={() => onNavigate("history")}
              className="text-sm text-[#00FF7F] hover:underline"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-3">
            {meals.slice(0, 3).map((meal) => (
              <div
                key={meal.id}
                className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-xl p-4 flex items-center gap-4 hover:border-[#00FF7F]/30 transition-all duration-300"
              >
                <img
                  src={meal.image}
                  alt={meal.foodName}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{meal.foodName}</h4>
                  <p className="text-sm text-gray-400">
                    {meal.calories} calorias
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(meal.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
