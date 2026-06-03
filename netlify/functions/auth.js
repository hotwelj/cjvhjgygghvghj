const crypto = require("crypto");

// Hashes de las contraseñas válidas
const HASHES = [
  "3305fea36bd49dc0fd4504dff836853483b6c525d90ed8a559af593918fc6064", // usuario.gratis
  "a5a8098e19611e966bff4f8243043767ef99bfee85f6499d2e8da5062420d25f", // najmani16
  "41c0ebccb07e468d1067b90472cbe6e27ca2631436ce83a528e7a00fb066c6f7", // cabe.tiene.aura
  "ff8e5d99a11ddc294515bc779a5569b39dbf745517756ef8b3c4a275621398d5", // 32208Sn3
];

// Token secreto — cambialo por cualquier string largo y raro que quieras
const TOKEN_SECRETO = "ort-piratas-xK92mNq7pL3wZ";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { password } = JSON.parse(event.body);
    const hash = crypto.createHash("sha256").update(password).digest("hex");

    if (HASHES.includes(hash)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, token: TOKEN_SECRETO }),
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false }),
    };
  } catch {
    return { statusCode: 400, body: "Bad request" };
  }
};
