"use client";

import { useState, useRef } from "react";
import { Camera, Upload, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { MealData } from "../page";

interface CameraCaptureProps {
  onBack: () => void;
  onMealAnalyzed: (meal: MealData) => void;
}

export default function CameraCapture({
  onBack,
  onMealAnalyzed,
}: CameraCaptureProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        setError("Por favor, selecione uma imagem válida (JPG, PNG ou WebP)");
        return;
      }

      // Validar tamanho (máx 4MB para evitar problemas com base64)
      if (file.size > 4 * 1024 * 1024) {
        setError("Imagem muito grande. Por favor, use uma imagem menor que 4MB.");
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.onerror = () => {
        setError("Erro ao carregar a imagem. Tente novamente.");
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log("📤 Enviando imagem para análise...");

      const response = await fetch("/api/analyze-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Erro na resposta:", data);
        throw new Error(data.error || data.details || "Erro ao analisar imagem");
      }

      console.log("✅ Análise recebida com sucesso!");

      const meal: MealData = {
        id: Date.now().toString(),
        image: selectedImage,
        foodName: data.foodName,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        timestamp: new Date(),
        analysis: data.analysis,
      };

      onMealAnalyzed(meal);
    } catch (error) {
      console.error("❌ Erro ao analisar:", error);
      
      let errorMessage = "Erro ao analisar a imagem. Tente novamente.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraClick = () => {
    // Resetar o input para permitir selecionar a mesma foto novamente
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
      cameraInputRef.current.click();
    }
  };

  const handleGalleryClick = () => {
    // Resetar o input para permitir selecionar a mesma foto novamente
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
      galleryInputRef.current.click();
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
        <h1 className="text-2xl font-bold">Escanear Refeição</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium mb-1">Ops! Algo deu errado</p>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Camera Preview */}
      <div className="mb-6">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border-2 border-dashed border-[#2A2A2A] rounded-3xl overflow-hidden">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected food"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Camera className="w-16 h-16 text-[#00FF7F]/30" />
              <p className="text-gray-500 text-center px-8">
                Tire uma foto ou selecione uma imagem da sua refeição
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelect}
        className="hidden"
      />
      
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCameraClick}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] text-black font-semibold py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#00FF7F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="w-6 h-6" />
          {selectedImage ? "Tirar Nova Foto" : "Tirar Foto"}
        </button>

        <button
          onClick={handleGalleryClick}
          disabled={isAnalyzing}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white font-semibold py-5 rounded-2xl flex items-center justify-center gap-3 hover:border-[#00FF7F]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-6 h-6" />
          Escolher da Galeria
        </button>

        {selectedImage && (
          <button
            onClick={analyzeImage}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-[#00FF7F] to-[#00CC66] text-black font-semibold py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#00FF7F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Camera className="w-6 h-6" />
                Analisar Refeição
              </>
            )}
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#00FF7F]">
          Dicas para melhor análise
        </h3>
        <ul className="space-y-3 text-sm text-gray-400">
          <li className="flex items-start gap-3">
            <span className="text-[#00FF7F] mt-0.5">✓</span>
            <span>Tire a foto com boa iluminação</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#00FF7F] mt-0.5">✓</span>
            <span>Mostre toda a refeição no enquadramento</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#00FF7F] mt-0.5">✓</span>
            <span>Evite sombras e reflexos</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#00FF7F] mt-0.5">✓</span>
            <span>Fotografe de cima para baixo</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#00FF7F] mt-0.5">✓</span>
            <span>Use imagens menores que 4MB</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
