import { useEffect, useRef, useState } from "react";
import { UndoIcon } from "../icons/UndoIcon";
import { RedoIcon } from "../icons/RedoIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { useDigitRecognizer } from "../../context/DigitRecognizerContext";

const DigitRecognizerCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const { predictDigit, loading, setImage } = useDigitRecognizer();

  const [history, setHistory] = useState<string[]>([]);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 15;
    setContext(ctx);

    // Initialize history with blank canvas state after setup
    const blank = canvas.toDataURL();
    setHistory([blank]);
    setStep(0);
  }, []);

  const startDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault(); // Prevent scrolling on touch devices
    let offsetX: number, offsetY: number;

    if ("touches" in event) {
      // Touch event
      const touch = event.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    } else {
      // Mouse event
      offsetX = event.nativeEvent.offsetX;
      offsetY = event.nativeEvent.offsetY;
    }

    if (!context) return;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();
    if (!isDrawing) return;

    let offsetX: number, offsetY: number;

    if ("touches" in event) {
      const touch = event.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    } else {
      offsetX = event.nativeEvent.offsetX;
      offsetY = event.nativeEvent.offsetY;
    }

    if (!context) return;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  // Save current canvas to history when user finishes drawing
  const endDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();
    if (!context) return;
    context.closePath();
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();

    if (history[step] !== dataURL) {
      const updatedHistory = history.slice(0, step + 1);
      updatedHistory.push(dataURL);
      setHistory(updatedHistory);
      setStep(updatedHistory.length - 1);
    }
  };

  // Undo function
  const undo = () => {
    if (step <= 0) return; // no more undo
    const newStep = step - 1;
    restoreFromHistory(newStep);
    setStep(newStep);
  };

  // Redo function
  const redo = () => {
    if (step >= history.length - 1) return; // no more redo
    const newStep = step + 1;
    restoreFromHistory(newStep);
    setStep(newStep);
  };

  // Restore canvas image from history
  const restoreFromHistory = (historyStep: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = history[historyStep];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  // Clear canvas and reset history
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Save blank state to history
    const blank = canvas.toDataURL();
    setHistory([blank]);
    setStep(0);
  };

  const handleCanvasSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const base64 = canvas.toDataURL("image/png");
    setImage(base64);
    predictDigit(base64);
  };

  return (
    <div className="w-full my-10">
      <p className="font-mono my-2">
        Draw a digit (0-9) below and click Predict.
      </p>
      <div className="w-full h-[500px] border-2 border-gray-300 shadow-md relative bg-black rounded-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          onTouchCancel={endDrawing}
        />
      </div>
      <div className="mt-4">
        <button
          className="btn btn-sm btn-outline rounded-none mr-2"
          onClick={undo}
        >
          <UndoIcon />
        </button>
        <button
          className="btn btn-sm btn-outline rounded-none mr-4"
          onClick={redo}
        >
          <RedoIcon />
        </button>
        <button
          className="btn btn-sm btn-outline rounded-none btn-error mr-4"
          onClick={clearCanvas}
        >
          <DeleteIcon />
        </button>
        <button
          className="btn btn-sm rounded-none float-end text-black bg-white font-mono hover:bg-gray-300 flex items-center gap-2"
          onClick={handleCanvasSubmit}
          disabled={loading || !step}
        >
          {loading && (
            <svg
              className="animate-spin h-4 w-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
              />
            </svg>
          )}
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>
    </div>
  );
};
export { DigitRecognizerCanvas };
