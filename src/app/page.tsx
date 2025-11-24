"use client";

import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import CameraCapture from "./components/CameraCapture";
import Results from "./components/Results";
import History from "./components/History";
import Profile from "./components/Profile";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import PWARegister from "@/components/PWARegister";
import { getCurrentUser, onAuthStateChange, type AuthUser } from "@/lib/auth";

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [currentMeal, setCurrentMeal] = useState<MealData | null>(null);
  const [meals, setMeals] = useState<MealData[]>([]);

  useEffect(() => {
    // Verificar usuário atual
    getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleMealAnalyzed = (meal: MealData) => {
    setCurrentMeal(meal);
    setMeals((prev) => [meal, ...prev]);
    setCurrentScreen("results");
  };

  const handleLoginSuccess = () => {
    getCurrentUser().then(setUser);
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
        return (
          <Profile 
            onBack={() => setCurrentScreen("dashboard")}
            user={user}
            onLogout={() => setUser(null)}
          />
        );
      default:
        return <Dashboard meals={meals} onNavigate={setCurrentScreen} />;
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // App principal (usuário autenticado)
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
