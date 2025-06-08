import React from "react";
import { DigitRecognizerCanvas } from "../components/DigitRecognizerCanvas";
import { PredictionComponent } from "../components/PredictionComponent";
import { DigitRecognizerProvider } from "../context/DigitRecognizerContext";

const MainPage: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-black to-white/1 px-10 min-h-[100vh]">
      <div className="w-full max-w-[800px] mx-auto flex flex-col pb-20">
        <h1 className="font-bold text-2xl mt-10 m-auto font-mono">
          MNIST Digit Recognizer
        </h1>
        <p className="font-mono text-center mt-4 text-sm">
          Draw a digit (0-9) below and click Predict. You can also provide
          feedback on the prediction.
        </p>
        <p className="font-mono text-center mt-4 text-sm">
          The model is trained on the MNIST dataset and uses a MLP (Neural
          Network) architecture. It resizes the input image into 8 * 8 pixels
          and predicts the digit based on the pixel values.
        </p>
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
