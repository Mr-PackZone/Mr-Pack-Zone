module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const { items, email } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Carrinho vazio"
      });
    }

    const preference = {
      items: items.map(item => ({
        title: String(item.title),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: "BRL"
      })),
      payer: {
        email: email
      },
      back_urls: {
        success: "https://mr-pack-zone.vercel.app/",
        failure: "https://mr-pack-zone.vercel.app/",
        pending: "https://mr-pack-zone.vercel.app/"
      },
      auto_return: "approved"
    };

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}
        },
        body: JSON.stringify(preference)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Erro ao criar pagamento",
        details: data
      });
    }

    return res.status(200).json({
      init_point: data.init_point
    });

  } catch (error) {
    console.error("Erro Mercado Pago:", error);

    return res.status(500).json({
      error: "Erro interno no servidor"
    });
  }
};
