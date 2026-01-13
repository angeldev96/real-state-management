import LoginClient from "./login-client";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const resolved = (await searchParams) ?? {};
  const fromParam = resolved.from;
  const fromValue = Array.isArray(fromParam) ? fromParam[0] : fromParam;
  const from = fromValue && fromValue.startsWith("/") ? fromValue : "/";

  return <LoginClient from={from} />;
}
