// src/controllers/paymentController.js
const { MercadoPagoConfig, Preference } = require('mercadopago');
const orderModel = require('../models/orderModel');
require('dotenv').config();

// Configura o Mercado Pago com o token do .env
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-0000' });

const paymentController = {
  async createPreference(req, res, next) {
    try {
      const { order_id } = req.body;
      
      if (!order_id) {
        return res.status(400).json({ sucesso: false, mensagem: 'order_id é obrigatório' });
      }

      // Busca o pedido no banco para pegar os itens
      const pedido = await orderModel.getById(order_id);
      
      if (!pedido) {
        return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado' });
      }

      const items = pedido.itens.map(item => ({
        id: String(item.product_id),
        title: item.produto_nome,
        quantity: item.quantidade,
        currency_id: 'BRL',
        unit_price: Number(item.preco_unitario)
      }));

      // A URL de webhook deve ser uma URL pública (ex: ngrok se local).
      // Se WEBHOOK_URL não estiver configurado, podemos omitir temporariamente no ambiente local
      const notification_url = process.env.WEBHOOK_URL ? `${process.env.WEBHOOK_URL}/api/payments/webhook` : undefined;

      const preference = new Preference(client);
      
      const response = await preference.create({
        body: {
          items,
          external_reference: String(order_id),
          notification_url,
          back_urls: {
            success: 'exp://localhost:8081/--/success', // URL genérica para fechar o web browser
            failure: 'exp://localhost:8081/--/failure',
            pending: 'exp://localhost:8081/--/pending'
          },
          auto_return: 'approved'
        }
      });

      res.status(201).json({
        sucesso: true,
        preference_id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point
      });
    } catch (error) {
      console.error('Erro ao criar preferência MP:', error);
      next(error);
    }
  },

  async webhook(req, res, next) {
    try {
      const payment = req.query;
      
      // O MP envia o id do pagamento como 'data.id'
      if (payment.type === 'payment' && payment['data.id']) {
        const paymentId = payment['data.id'];
        
        // Na vida real, você buscaria o pagamento na API do MP usando esse ID
        // para checar o status e o 'external_reference' que enviamos.
        // Simulando a atualização para "confirmado":
        
        // Aqui precisaríamos de um fetch pro MP para ver o status:
        // const mp_res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: \`Bearer \${process.env.MERCADOPAGO_ACCESS_TOKEN}\` }});
        // const mp_data = await mp_res.json();
        // if (mp_data.status === 'approved') {
        //   await orderModel.updateStatus(mp_data.external_reference, 'confirmado');
        // }
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Erro no webhook MP:', error);
      res.status(500).send('Erro interno');
    }
  }
};

module.exports = paymentController;
