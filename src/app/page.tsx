"use client";
import React, { useState } from "react";
import RadialCard from "@/components/abstract-ball";
import { WelcomeModal } from "@/components/Modal";
import useVapi from "@/hooks/use-vapi";

const ParentComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEndAndShowAnalysis = () => {
    if (isSessionActive) {
      toggleCall();
    }
  };

  return (
    <>
      <WelcomeModal isOpen={isModalOpen} onClose={closeModal} />

      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Sayfa başlığı */}
          <h1 className="text-4xl font-bold text-amber-900 mb-3">
            Şantiye Eğitim Ajanı
          </h1>
          <RadialCard
            isSessionActive={isSessionActive}
            volumeLevel={volumeLevel}
            toggleCall={toggleCall}
          />

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-amber-800">
              Sesli Asistan
            </h2>
            <p className="text-amber-600 text-sm">
              Mikrofon simgesine tıklayarak konuşmaya başlayın
            </p>
            {/* Konuşmayı Bitir ve Analizi Gör butonu */}
            <button
              className="mt-8 px-6 py-3 bg-amber-700 text-white rounded-lg shadow hover:bg-amber-800 transition disabled:opacity-50"
              onClick={handleEndAndShowAnalysis}
              disabled={!isSessionActive}
            >
              Konuşmayı Bitir ve Analizi Gör
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParentComponent;
