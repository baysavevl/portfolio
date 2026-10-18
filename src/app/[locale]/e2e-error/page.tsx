import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {connection} from "next/server";
import {ErrorTrigger} from "./error-trigger";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function ErrorFixturePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  await connection();

  if (process.env.E2E_FIXTURES !== "1") {
    notFound();
  }

  const {locale} = await params;
  const label =
    locale === "vi" ? "Kích hoạt lỗi kiểm thử" : "Trigger test error";

  return <ErrorTrigger label={label} />;
}
