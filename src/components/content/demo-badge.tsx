import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import type {Locale} from "@/i18n/locale";

interface DemoBadgeProps {
  locale: Locale;
}

export function DemoBadge({locale}: DemoBadgeProps) {
  const label =
    locale === "vi" ? viMessages.demo.label : enMessages.demo.label;

  return <span className="demo-badge">{label}</span>;
}
