import React, { createContext, useContext, useRef } from "react";

export interface CardMeasurement {
  x: number;
  y: number;
  width: number;
  height: number;
  posterUrl: string | null;
}

interface SharedPosterContextValue {
  setMeasurement: (movieId: number, measurement: CardMeasurement) => void;
  consumeMeasurement: (movieId: number) => CardMeasurement | null;
}

const SharedPosterContext = createContext<SharedPosterContextValue | null>(
  null,
);

export function SharedPosterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const measurements = useRef(new Map<number, CardMeasurement>());

  const setMeasurement = (movieId: number, measurement: CardMeasurement) => {
    measurements.current.set(movieId, measurement);
  };

  const consumeMeasurement = (movieId: number): CardMeasurement | null => {
    const value = measurements.current.get(movieId) ?? null;
    measurements.current.delete(movieId);
    return value;
  };

  return (
    <SharedPosterContext.Provider
      value={{ setMeasurement, consumeMeasurement }}
    >
      {children}
    </SharedPosterContext.Provider>
  );
}

export function useSharedPoster(): SharedPosterContextValue {
  const ctx = useContext(SharedPosterContext);
  if (!ctx) {
    throw new Error(
      "useSharedPoster() must be used within a <SharedPosterProvider>",
    );
  }
  return ctx;
}
