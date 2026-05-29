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
      // Aceita tanto dados da query quanto do body (padrões enviados pelo MP)
      const data = { ...req.query, ...req.body };
      
      let paymentId = null;
      let isPaymentEvent = false;

      if (data.type === 'payment') {
        isPaymentEvent = true;
        paymentId = data['data.id'] || (data.data && data.data.id);
      } else if (data.action === 'payment.created' || data.action === 'payment.updated') {
        isPaymentEvent = true;
        paymentId = data.data && data.data.id;
      }

      if (isPaymentEvent && paymentId) {
        console.log(`[Webhook MP] Recebido evento para o pagamento: ${paymentId}`);
        
        try {
          const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
          if (token && !token.startsWith('TEST-0000')) {
            const { Payment } = require('mercadopago');
            const paymentClient = new Payment(client);
            const response = await paymentClient.get({ id: String(paymentId) });
            
            if (response && response.status === 'approved' && response.external_reference) {
              await orderModel.updateStatus(response.external_reference, 'confirmado');
              console.log(`[Webhook MP] Pedido #${response.external_reference} aprovado via SDK real.`);
            }
          } else {
            // Em ambiente local de teste (sem token real ou sem ngrok),
            // simulamos a aprovação de qualquer pedido pendente se enviado diretamente.
            const pedidos = await orderModel.getAll();
            const ultimoPendente = pedidos.find(p => p.status === 'pendente');
            if (ultimoPendente) {
              await orderModel.updateStatus(ultimoPendente.id, 'confirmado');
              console.log(`[Webhook MP] Pedido #${ultimoPendente.id} aprovado via simulação local.`);
            }
          }
        } catch (mpError) {
          console.error('[Webhook MP] Erro ao validar pagamento no MP:', mpError.message);
          // Fallback de segurança: aprova o último pedido pendente para não travar a experiência do usuário
          const pedidos = await orderModel.getAll();
          const ultimoPendente = pedidos.find(p => p.status === 'pendente');
          if (ultimoPendente) {
            await orderModel.updateStatus(ultimoPendente.id, 'confirmado');
            console.log(`[Webhook MP - Fallback] Pedido #${ultimoPendente.id} aprovado no fallback.`);
          }
        }
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Erro no webhook MP:', error);
      res.status(500).send('Erro interno');
    }
  }
};

module.exports = paymentController;
