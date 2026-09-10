// Cloudflare Pages Function — proxy al worker real
// La URL del worker viene de variable de entorno — nunca en el código

export async function onRequestPost(context) {
  const { request, env } = context;
  const TARGET = env.WORKER_URL;

  try {
    const body = await request.text();
    const res = await fetch(TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": request.headers.get("CF-Connecting-IP") || "",
        "X-Proxy-Secret": "js-pages-proxy-2024",
      },
      body,
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
