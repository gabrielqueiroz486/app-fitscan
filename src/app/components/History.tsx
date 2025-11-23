"use client";

import { ArrowLeft, Calendar, Flame } from "lucide-react";
import { MealData } from "../page";

interface HistoryProps {
  meals: MealData[];
  onBack: () => void;
}

export default function History({ meals, onBack }: HistoryProps) {
  const groupedMeals = meals.reduce((acc, meal) => {
    const date = new Date(meal.timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, MealData[]>);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

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
        <h1 className="text-2xl font-bold">Histórico</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-5">
          <Flame className="w-6 h-6 text-[#00FF7F] mb-3" />
          <p className="text-2xl font-bold mb-1">{totalCalories}</p>
          <p className="text-xs text-gray-400">Total de Calorias</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-5">
          <Calendar className="w-6 h-6 text-[#00FF7F] mb-3" />
          <p className="text-2xl font-bold mb-1">{meals.length}</p>
          <p className="text-xs text-gray-400">Refeições Registradas</p>
        </div>
      </div>

      {/* Meals List */}
      {meals.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Nenhuma refeição registrada</p>
          <p className="text-sm text-gray-500">
            Comece escaneando sua primeira refeição!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMeals).map(([date, dateMeals]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                {date}
              </h3>
              <div className="space-y-3">
                {dateMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-4 hover:border-[#00FF7F]/30 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <img
                        src={meal.image}
                        alt={meal.foodName}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{meal.foodName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-[#00FF7F]" />
                            {meal.calories} cal
                          </span>
                          <span>
                            {new Date(meal.timestamp).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-3 text-xs">
                          <span className="bg-[#0D0D0D] px-3 py-1 rounded-full">
                            P: {meal.protein}g
                          </span>
                          <span className="bg-[#0D0D0D] px-3 py-1 rounded-full">
                            C: {meal.carbs}g
                          </span>
                          <span className="bg-[#0D0D0D] px-3 py-1 rounded-full">
                            G: {meal.fat}g
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
