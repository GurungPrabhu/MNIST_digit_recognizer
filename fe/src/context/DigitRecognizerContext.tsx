import { createContext, useContext, useState } from "react";
import { postCanvas } from "../service";

interface DigitRecognizerContextType {
  result: any;
  loading: boolean;
  error: string | null;
  predictDigit: (image: any) => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);

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

  return (
    <DigitRecognizerContext.Provider
      value={{ result, loading, error, predictDigit }}
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
