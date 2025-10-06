// src/lib/http.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type HttpOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  token?: string | null; // 可选：JWT
  body?: any; // 自动转 JSON
  headers?: Record<string, string>;
  nextOptions?: RequestInit; // 透传其他 fetch 选项
};

export async function http<T>(
  path: string,
  {
    method = "GET",
    token,
    body,
    headers = {},
    nextOptions = {},
  }: HttpOptions = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const isJson = body !== undefined;

  const res = await fetch(url, {
    method,
    headers: {
      ...(isJson ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: isJson ? JSON.stringify(body) : undefined,
    // 搭配 Next 的缓存/SSR 行为可按需添加：cache, next: { revalidate: n }
    ...nextOptions,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  // 非 JSON 可返回文本/空
  // @ts-expect-error
  return res.text?.() ?? (undefined as T);
}
