"use client";

import { useState } from "react";

type Answer = "yes" | "no" | null;

// 🔗 Google Apps Script API
const API_URL =
  "https://script.google.com/macros/s/AKfycbxEbz7pwWAcQS91qOBUJwAzg71I67mw6YETl-C85DHcmRJCgltzHMT-ch1cqKvY3R9x/exec";

/* ------------------ Progress Dots ------------------ */
function ProgressDots({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <span
          key={index}
          className={`h-2 w-2 rounded-full transition-all ${
            index === currentStep
              ? "bg-neutral-100 scale-110"
              : "bg-neutral-600"
          }`}
        />
      ))}
    </div>
  );
}

/* ------------------ Main Page ------------------ */
export default function Home() {
  const [step, setStep] = useState(0);

  const [skincare, setSkincare] = useState<Answer>(null);
  const [zeroSugar, setZeroSugar] = useState<Answer>(null);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep((s) => s + 1);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const payload = {
      date: new Date().toISOString().slice(0, 10),
      skincare,
      zeroSugar,
      notes,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.status !== "success") {
        throw new Error(data.message || "Submission failed");
      }

      setStep(4);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-2xl shadow-lg px-6 pt-4 pb-6">

        {/* Progress dots */}
        {step < 3 && <ProgressDots currentStep={step} totalSteps={3} />}

        {/* STEP 0 — Skincare */}
        {step === 0 && (
          <Question
            question="Did you do your skincare today?"
            onAnswer={(ans) => {
              setSkincare(ans);
              next();
            }}
          />
        )}

        {/* STEP 1 — Zero sugar */}
        {step === 1 && (
          <Question
            question="Zero sugar today?"
            onAnswer={(ans) => {
              setZeroSugar(ans);
              next();
            }}
          />
        )}

        {/* STEP 2 — Notes */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4 text-center">
            <h1 className="text-xl font-semibold text-neutral-100">
              Anything worth noting?
            </h1>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="
                w-full rounded-xl p-3
                bg-neutral-800 border border-neutral-700
                text-neutral-100
                focus:outline-none focus:ring-2 focus:ring-neutral-100
              "
              placeholder="Optional notes..."
              rows={4}
            />

            <button
              onClick={next}
              className="
                w-full bg-neutral-100 text-neutral-900
                py-3 rounded-full text-lg
                active:scale-95 transition
              "
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3 — Submit */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6 text-center">
            <h1 className="text-xl font-semibold text-neutral-100">
              All set 
            </h1>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full bg-neutral-100 text-neutral-900
                py-3 rounded-full text-lg
                active:scale-95 transition
                disabled:opacity-50
              "
            >
              {loading ? "Saving..." : "Submit"}
            </button>

            <button className="w-full text-neutral-400 underline text-sm">
              Remind me in 6 hours
            </button>
          </div>
        )}

        {/* STEP 4 — Success */}
        {step === 4 && (
          <div className="animate-fade-in space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-neutral-100">
              Done for today ✨
            </h1>
            <p className="text-neutral-400">
              Your check-in has been saved.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ------------------ Components ------------------ */
function Question({
  question,
  onAnswer,
}: {
  question: string;
  onAnswer: (a: Answer) => void;
}) {
  return (
    <div className="animate-fade-in space-y-6 text-center">
      <h1 className="text-xl font-semibold text-neutral-100">
        {question}
      </h1>

      <div className="flex gap-4 justify-center">
        <PillButton label="Yes" onClick={() => onAnswer("yes")} />
        <PillButton label="No" onClick={() => onAnswer("no")} />
      </div>
    </div>
  );
}

function PillButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        px-8 py-3 rounded-full
        border border-neutral-700
        text-neutral-200 text-lg font-medium
        hover:bg-neutral-100 hover:text-neutral-900
        active:scale-95 transition
      "
    >
      {label}
    </button>
  );
}
