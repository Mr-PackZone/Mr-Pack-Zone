module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    console.log("Webhook Mercado Pago recebido");
    console.log("Body:", req.body);

    return res.status(200).json({
      received: true
    });

  } catch (error) {
    console.error("Erro no webhook:", error);

    return res.status(500).json({
      error: "Erro interno"
    });
  }
};
