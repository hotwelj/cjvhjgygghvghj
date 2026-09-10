// Cloudflare Pages Function — proxy al worker real
// El worker real nunca aparece en el browser

const TARGET = "https://ort-admin.simonabulafia.workers.dev";

export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    const body = await request.text();
    
    const res = await fetch(TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pasar la IP real para rate limiting
        "CF-Connecting-IP": request.headers.get("CF-Connecting-IP") || "",
        // Origen interno — el worker sabe que viene del proxy
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
