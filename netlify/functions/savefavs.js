const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  try {
    const { token, usuario, favs } = JSON.parse(event.body);
    if (token !== "ort-piratas-xK92mNq7pL3wZ" || !usuario) {
      return { statusCode: 401, body: JSON.stringify({ ok: false }) };
    }

    const store = getStore("favoritos");
    await store.setJSON(usuario, favs);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
