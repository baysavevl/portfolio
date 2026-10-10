"use client";

interface ErrorPanelLink {
  href: string;
  label: string;
}

interface ErrorPanelProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
  links?: ErrorPanelLink[];
}

export function ErrorPanel({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  links = []
}: ErrorPanelProps) {
  return (
    <section className="error-panel" aria-labelledby="error-panel-title">
      <div className="error-panel__marker" aria-hidden="true">
        <span>Field</span>
        <span>Note</span>
        <span>—</span>
      </div>

      <div className="error-panel__body">
        <p className="error-panel__eyebrow">Vincent Luu / The Mindful Builder</p>
        <h1 id="error-panel-title">{title}</h1>
        <p>{description}</p>

        <div className="error-panel__actions">
          {actionHref ? (
            <a className="error-panel__primary" href={actionHref}>
              {actionLabel}
            </a>
          ) : (
            <button
              className="error-panel__primary"
              type="button"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          )}

          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
