import { useState } from "react";

interface Props {
  percent: number;
}

const Confidence: React.FC<Props> = ({ percent }) => {
  return (
    <div className="inline-block ml-2">
      <p className="inline-block text-green-600">{percent.toFixed(1)}%</p>
    </div>
  );
};

const PredictionComponent: React.FC = () => {
  const [trueLabelValue, setTrueLabelValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [predictedValue, setPredictedValue] = useState(5);
  const [confidence, setConfidence] = useState(90);

  const validate = (value: string): string | null => {
    if (!value.trim()) return "Value is required!";
    if (isNaN(parseInt(value))) return "Value is not a number!";
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTrueLabelValue(value);
    setError(validate(value));
  };

  const handleReset = () => {
    setTrueLabelValue("");
    setError(null);
  };

  const handleSubmit = () => {
    const currentError = validate(trueLabelValue);
    if (currentError) {
      setError(currentError);
      return;
    }

    console.log("Submitted value:", trueLabelValue);
    handleReset();
  };

  return (
    <div className="flex flex-row">
      <div className="flex-row">
        <h5 className="text-sm font-mono">Prediction</h5>
        <div className="inline-block mt-4">
          <h1 className="text-5xl font-mono inline-block">{predictedValue}</h1>
          <Confidence percent={confidence} />
        </div>
      </div>
      <div className="flex-column flex border-l pl-4 ml-auto">
        <fieldset className="flex items-center space-x-4 mr-6 fieldset relative">
          <legend className="font-mono">Enter true label:</legend>
          <input
            type="number"
            value={trueLabelValue}
            className="input focus:outline-none focus:ring-0"
            onChange={handleChange}
            placeholder="Type here"
          />
          {error && (
            <p className="font-mono text-sm absolute left-0 bottom-[-1rem] text-red-400">
              {error}
            </p>
          )}
        </fieldset>
        <button
          className="btn font-mono btn-outline mt-8 m-auto"
          disabled={!!error}
          onClick={handleSubmit}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export { PredictionComponent };
