// import { useState } from "react";
import { useState } from "react";
import { useDigitRecognizer } from "../../context/DigitRecognizerContext";

interface Props {
  percent: number;
}

const Confidence: React.FC<Props> = ({ percent }) => {
  return (
    <div className="inline-block ml-2">
      <p className="inline-block text-green-600">
        {percent?.toFixed(1) || "NA"}%
      </p>
    </div>
  );
};

const PredictionComponent: React.FC = () => {
  const [trueLabelValue, setTrueLabelValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { result, feedbackLoading, submitFeedback, successMessage } =
    useDigitRecognizer();
  const validate = (value: string): string | null => {
    if (!value.trim()) return "Value is required!";
    if (isNaN(parseInt(value))) return "Value is not a number!";
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 1) return;
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
    submitFeedback(parseInt(trueLabelValue));
    console.log("Submitted value:", trueLabelValue);
    handleReset();
  };

  if (result === null) {
    return <></>;
  }
  return (
    <div className="flex flex-row justify-between">
      <div className="flex-row pr-4">
        <h5 className="text-sm font-mono">Prediction</h5>
        <div className="inline-block mt-4">
          <h1 className="text-5xl font-mono inline-block">
            {result?.predicted_digit ?? "N/A"}
          </h1>
          <Confidence percent={result?.confidence} />
        </div>
      </div>
      <div className="flex border-l pl-4 ">
        <fieldset className="flex items-center space-x-4 mr-6 fieldset relative min-w-[200px]">
          <legend className="font-mono">Enter true label:</legend>
          <input
            type="number"
            value={trueLabelValue}
            min="0"
            maxLength={1}
            className="input focus:outline-none focus:ring-0"
            onChange={handleChange}
            placeholder="Type here"
          />
          {error && (
            <p className="font-mono text-sm absolute left-0 bottom-[-1rem] text-red-400">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="font-mono text-sm absolute left-0 bottom-[-1rem] text-green-400 whitespace-nowrap overflow-visible">
              {successMessage}
            </p>
          )}
        </fieldset>
        <button
          className="btn font-mono btn-outline mt-8 m-auto min-w-[100px]"
          disabled={!!error}
          onClick={handleSubmit}
        >
          {feedbackLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <span className="text-sm">Submit</span>
          )}
        </button>
      </div>
    </div>
  );
};

export { PredictionComponent };
