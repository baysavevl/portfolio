const unsafeHrefCharacters = /[\u0000-\u0020\u007f\\]/;
const encodedLineBreak = /%(?:0a|0d)/i;

export function isSafeHref(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  if (value !== value.trim() || unsafeHrefCharacters.test(value)) {
    return false;
  }

  if (encodedLineBreak.test(value)) {
    return false;
  }

  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);

    if (url.protocol === "https:") {
      return Boolean(url.hostname) && !url.username && !url.password;
    }

    return url.protocol === "mailto:" && url.pathname.length > 0;
  } catch {
    return false;
  }
}
