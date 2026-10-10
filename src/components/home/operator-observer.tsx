"use client";

import {useState, type PointerEvent} from "react";
import {SilhouetteArt} from "@/components/home/silhouette-art";

type HeroMode = "operator" | "observer" | "split";

interface OperatorObserverProps {
  operatorLabel: string;
  observerLabel: string;
  initialMode?: HeroMode;
  operatorAlt?: string;
  observerAlt?: string;
  splitAlt?: string;
  rangeLabel?: string;
}

const initialRevealByMode: Record<HeroMode, number> = {
  operator: 0,
  observer: 100,
  split: 50
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function OperatorObserver({
  operatorLabel,
  observerLabel,
  initialMode = "split",
  operatorAlt = `Abstract ${operatorLabel} silhouette`,
  observerAlt = `Abstract ${observerLabel} silhouette`,
  splitAlt = `Abstract ${operatorLabel} and ${observerLabel} silhouette`,
  rangeLabel = `Reveal ${operatorLabel} or ${observerLabel}`
}: OperatorObserverProps) {
  const [reveal, setReveal] = useState(initialRevealByMode[initialMode]);

  function updateReveal(nextReveal: number) {
    const clamped = Math.min(100, Math.max(0, nextReveal));
    setReveal(
      prefersReducedMotion() ? (clamped < 50 ? 0 : 100) : Math.round(clamped)
    );
  }

  function updateFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();

    if (bounds.width === 0) {
      return;
    }

    updateReveal(((event.clientX - bounds.left) / bounds.width) * 100);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateFromPointer(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const isMouseHover = event.pointerType === "mouse";
    const isCaptured = event.currentTarget.hasPointerCapture?.(event.pointerId);

    if (isMouseHover || isCaptured) {
      updateFromPointer(event);
    }
  }

  const accessibleName =
    reveal === 0 ? operatorAlt : reveal === 100 ? observerAlt : splitAlt;

  return (
    <div className="operator-observer">
      <div
        className="operator-observer__frame"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <SilhouetteArt reveal={reveal} accessibleName={accessibleName} />
      </div>

      <div className="operator-observer__controls">
        <div className="operator-observer__modes">
          <button
            type="button"
            aria-pressed={reveal === 0}
            onClick={() => setReveal(0)}
          >
            {operatorLabel}
          </button>
          <button
            type="button"
            aria-pressed={reveal === 100}
            onClick={() => setReveal(100)}
          >
            {observerLabel}
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={reveal}
          aria-label={rangeLabel}
          aria-valuetext={`${operatorLabel} ${100 - reveal}%, ${observerLabel} ${reveal}%`}
          onInput={(event) => updateReveal(Number(event.currentTarget.value))}
        />
      </div>
    </div>
  );
}
