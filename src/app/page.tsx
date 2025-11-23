"use client";

import { useState } from "react";
import Dashboard from "./components/Dashboard";
import CameraCapture from "./components/CameraCapture";
import Results from "./components/Results";
import History from "./components/History";
import Profile from "./components/Profile";
import Navigation from "./components/Navigation";
import PWARegister from "@/components/PWARegister";

export type Screen = "dashboard" | "camera" | "results" | "history" | "profile";

export interface MealData {
  id: string;
  image: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
  analysis: string;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [currentMeal, setCurrentMeal] = useState<MealData | null>(null);
  const [meals, setMeals] = useState<MealData[]>([]);

  const handleMealAnalyzed = (meal: MealData) => {
    setCurrentMeal(meal);
    setMeals((prev) => [meal, ...prev]);
    setCurrentScreen("results");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <Dashboard meals={meals} onNavigate={setCurrentScreen} />;
      case "camera":
        return (
          <CameraCapture
            onBack={() => setCurrentScreen("dashboard")}
            onMealAnalyzed={handleMealAnalyzed}
          />
        );
      case "results":
        return (
          <Results
            meal={currentMeal}
            onBack={() => setCurrentScreen("dashboard")}
          />
        );
      case "history":
        return (
          <History
            meals={meals}
            onBack={() => setCurrentScreen("dashboard")}
          />
        );
      case "profile":
        return <Profile onBack={() => setCurrentScreen("dashboard")} />;
      default:
        return <Dashboard meals={meals} onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <>
      <PWARegister />
      <div className="min-h-screen bg-[#0D0D0D] pb-20">
        {renderScreen()}
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </div>
    </>
  );
}
