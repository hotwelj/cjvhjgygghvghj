// Cloudflare Pages Function — proxy al worker real
// VERSIÓN DEBUG — muestra el error real para diagnosticar

export async function onRequestPost(context) {
  const { request, env } = context;
  const TARGET = env.WORKER_URL;

  // Debug temporal: si mandan action:"__debug__" devuelve el estado de la config
  try {
    const bodyText = await request.text();
    let parsedBody = {};
    try { parsedBody = JSON.parse(bodyText); } catch {}

    if (parsedBody.action === "__debug__") {
      return new Response(JSON.stringify({
        ok: true,
        debug: true,
        hasWorkerUrl: !!TARGET,
        workerUrlType: typeof TARGET,
        workerUrlLength: TARGET ? TARGET.length : 0,
      }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    if (!TARGET) {
      return new Response(JSON.stringify({ ok: false, error: "WORKER_URL no está configurada (env vacío)" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const res = await fetch(TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": request.headers.get("CF-Connecting-IP") || "",
        "X-Proxy-Secret": "js-pages-proxy-2024",
      },
      body: bodyText,
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
    // DEBUG: devolver el error real en vez de un mensaje genérico
    return new Response(JSON.stringify({ ok: false, error: "DEBUG: " + (e.message || String(e)), stack: e.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
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
