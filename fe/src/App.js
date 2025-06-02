import React, { useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#4ade80";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setIsDrawing(true);
    setPrediction(null);
    setConfidence(null);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
    setConfidence(null);
  };

  const predictDigit = async () => {
    const canvas = canvasRef.current;

    // Check if canvas is empty
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const isEmpty = !imageData.data.some((channel) => channel !== 0);

    if (isEmpty) {
      alert("Please draw a digit first!");
      return;
    }

    setLoading(true);

    try {
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "digit.png");

        const response = await axios.post(
          "http://localhost:8000/predict",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setPrediction(response.data.prediction);
        setLoading(false);
      }, "image/png");
    } catch (error) {
      console.error("Error predicting digit:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Digit Recognition
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              Drawing Canvas
            </h2>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="w-full h-auto bg-black rounded-lg border-2 border-gray-700 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                {loading && (
                  <div className="animate-pulse text-xl font-bold text-green-400">
                    Predicting...
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Clear
              </button>
              <button
                onClick={predictDigit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                disabled={loading}
              >
                Predict Digit
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">
              Prediction Results
            </h2>
            {prediction !== null ? (
              <div className="text-center">
                <div className="text-8xl font-bold my-8 text-green-400">
                  {prediction}
                </div>
                <p className="text-gray-400">
                  The model predicts this digit is:
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {prediction}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-gray-500 text-center">
                  <p className="text-lg mb-4">Draw a digit on the canvas</p>
                  <p className="text-sm">
                    Then click "Predict Digit" to see the result
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Draw a single digit (0-9) in the canvas and let the model predict it
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
