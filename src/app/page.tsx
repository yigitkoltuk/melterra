"use client";
import React, { useState } from "react";
import RadialCard from "@/components/abstract-ball";
import { WelcomeModal } from "@/components/Modal";
import useVapi from "@/hooks/use-vapi";

const ParentComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [language, setLanguage] = useState<string>("tr");
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEndAndShowAnalysis = () => {
    if (isSessionActive) {
      toggleCall(language);
    }
  };

  const languages = [
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <>
      <WelcomeModal isOpen={isModalOpen} onClose={closeModal} />

      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Dil seçimi - Modern button group */}
          <div className="flex flex-col items-center space-y-3 mb-4">
            <label className="font-medium text-amber-900 text-lg">
              Dil Seçimi
            </label>
            <div className="flex items-center bg-amber-50 rounded-xl p-1 border-2 border-amber-200 shadow-sm">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 min-w-[100px] justify-center
                    ${
                      language === lang.code
                        ? "bg-amber-600 text-white shadow-md transform scale-105"
                        : "text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                    }
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sayfa başlığı */}
          <h1 className="text-4xl font-bold text-amber-900 mb-3">
            Şantiye Eğitim Ajanı
          </h1>

          <RadialCard
            isSessionActive={isSessionActive}
            volumeLevel={volumeLevel}
            toggleCall={() => toggleCall(language)}
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
