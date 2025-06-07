import React from "react";
import { DigitRecognizerCanvas } from "../components/DigitRecognizerCanvas";
import { PredictionComponent } from "../components/PredictionComponent";
import { DigitRecognizerProvider } from "../context/DigitRecognizerContext";

const MainPage: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-black to-white/1">
      <div className="w-full max-w-[800px] mx-auto flex flex-col">
        <h1 className="font-bold text-2xl mt-10 m-auto font-mono">
          MNIST Digit Recognizer
        </h1>
        <DigitRecognizerProvider>
          <>
            <DigitRecognizerCanvas />
            <PredictionComponent />
          </>
        </DigitRecognizerProvider>
      </div>
    </div>
  );
};

export { MainPage };
