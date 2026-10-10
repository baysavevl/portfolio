"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import type {LocaleSwitchTarget as LocaleSwitchTargetValue} from "@/lib/content/translation";

interface LocaleSwitchContextValue {
  target: LocaleSwitchTargetValue;
  registerTarget: (target: LocaleSwitchTargetValue) => () => void;
}

const LocaleSwitchContext = createContext<LocaleSwitchContextValue | null>(null);

export function LocaleSwitchProvider({
  initialTarget,
  children
}: {
  initialTarget: LocaleSwitchTargetValue;
  children: ReactNode;
}) {
  const [override, setOverride] = useState<LocaleSwitchTargetValue | null>(null);
  const registerTarget = useCallback((target: LocaleSwitchTargetValue) => {
    setOverride(target);

    return () => {
      setOverride((current) =>
        current?.targetHref === target.targetHref ? null : current
      );
    };
  }, []);

  return (
    <LocaleSwitchContext.Provider
      value={{target: override ?? initialTarget, registerTarget}}
    >
      {children}
    </LocaleSwitchContext.Provider>
  );
}

export function useLocaleSwitchTarget(): LocaleSwitchTargetValue | null {
  return useContext(LocaleSwitchContext)?.target ?? null;
}

export function LocaleSwitchTarget({
  target
}: {
  target: LocaleSwitchTargetValue;
}) {
  const context = useContext(LocaleSwitchContext);
  const registerTarget = context?.registerTarget;
  const {currentLocale, targetLocale, targetHref, missingTranslation} = target;

  useEffect(() => {
    if (!registerTarget) {
      return;
    }

    return registerTarget({
      currentLocale,
      targetLocale,
      targetHref,
      missingTranslation
    });
  }, [
    registerTarget,
    currentLocale,
    targetLocale,
    targetHref,
    missingTranslation
  ]);

  return null;
}
