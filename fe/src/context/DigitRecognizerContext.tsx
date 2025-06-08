import { createContext, useContext, useState } from "react";
import { postCanvas, postFeedback } from "../service";

interface DigitRecognizerContextType {
  result: any;
  loading: boolean;
  image: string | null;
  setImage: (image: string | null) => void;
  error: string | null;
  feedbackLoading: boolean;
  predictDigit: (image: any) => Promise<void>;
  submitFeedback: (feedback: number) => Promise<void>;
  successMessage?: string | null;
}

const DigitRecognizerContext = createContext<
  DigitRecognizerContextType | undefined
>(undefined);

// Provider component
export const DigitRecognizerProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const predictDigit = async (image: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postCanvas(image);
      setResult(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (feedback: number) => {
    if (!image) {
      setError("No image to submit feedback for");
      return;
    }
    setFeedbackLoading(true);
    setError(null);
    try {
      await postFeedback(image, feedback);
      setSuccessMessage("Feedback submitted successfully");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 10000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Feedback submission failed");
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <DigitRecognizerContext.Provider
      value={{
        result,
        loading,
        error,
        predictDigit,
        image,
        setImage,
        feedbackLoading,
        submitFeedback,
        successMessage,
      }}
    >
      {children}
    </DigitRecognizerContext.Provider>
  );
};

// Hook to use the context
export const useDigitRecognizer = () => {
  const context = useContext(DigitRecognizerContext);
  if (!context) {
    throw new Error(
      "useDigitRecognizer must be used within a DigitRecognizerProvider"
    );
  }
  return context;
};
