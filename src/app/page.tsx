import React from "react";
import RadialCard from "@/components/abstract-ball";

const ParentComponent: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center space-y-6">
        <RadialCard />

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-amber-800">
            Sesli Asistan
          </h2>
          <p className="text-amber-600 text-sm">
            Mikrofon simgesine tıklayarak konuşmaya başlayın
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;
