// src/controllers/orderController.js
// Controller de pedidos (async/await)

const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

// Função auxiliar para simular o progresso do pedido em segundo plano (para fins de demonstração)
function simularProgressoPedido(pedidoId, statusInicial) {
  const statusSequencia = ['confirmado', 'em_preparo', 'a_caminho', 'entregue'];
  
  let index = statusSequencia.indexOf(statusInicial);
  
  if (statusInicial === 'pendente') {
    setTimeout(async () => {
      try {
        const pedido = await orderModel.getById(pedidoId);
        if (pedido) {
          if (pedido.status === 'pendente') {
            await orderModel.updateStatus(pedidoId, 'confirmado');
            console.log(`[Simulador] Pedido #${pedidoId} aprovado automaticamente (simulação).`);
            simularProgressoPedido(pedidoId, 'confirmado');
          } else if (pedido.status === 'confirmado') {
            // Se já foi aprovado por outro meio (ex: webhook), apenas continua a simulação
            simularProgressoPedido(pedidoId, 'confirmado');
          }
        }
      } catch (err) {
        console.error(`[Simulador] Erro no pedido #${pedidoId}:`, err.message);
      }
    }, 15000); // 15 segundos para aprovar o pendente
  } else if (index !== -1) {
    let proximoIndex = index + 1;
    if (proximoIndex < statusSequencia.length) {
      const proximoStatus = statusSequencia[proximoIndex];
      setTimeout(async () => {
        try {
          const pedido = await orderModel.getById(pedidoId);
          if (pedido && pedido.status !== 'cancelado' && pedido.status === statusSequencia[index]) {
            await orderModel.updateStatus(pedidoId, proximoStatus);
            console.log(`[Simulador] Pedido #${pedidoId} avançou para: ${proximoStatus}`);
            simularProgressoPedido(pedidoId, proximoStatus);
          }
        } catch (err) {
          console.error(`[Simulador] Erro no pedido #${pedidoId}:`, err.message);
        }
      }, 15000); // 15 segundos para cada etapa
    }
  }
}

const orderController = {
  async getAll(req, res, next) {
    try {
      const pedidos = await orderModel.getAll();
      res.json({ sucesso: true, dados: pedidos });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const pedido = await orderModel.getById(req.params.id);
      if (!pedido) return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado' });
      res.json({ sucesso: true, dados: pedido });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { address_id, observacao, forma_pagamento } = req.body;
      const itensCarrinho = await cartModel.getAll();

      if (!itensCarrinho || itensCarrinho.length === 0)
        return res.status(400).json({ sucesso: false, mensagem: 'O carrinho está vazio' });

      const subtotal = await cartModel.getTotal();

      const itens = itensCarrinho.map((item) => ({
        product_id: item.product_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco,
        observacao: item.observacao,
      }));

      // Pega o company_id do primeiro item (pela regra de uma única loja)
      const company_id = itensCarrinho[0].company_id;

      // Busca o frete da empresa correspondente para somar ao total final
      const companyModel = require('../models/companyModel');
      const empresa = await companyModel.getById(company_id);
      const frete = empresa ? (empresa.frete || 0) : 0;
      
      const totalComFrete = subtotal + frete;

      const statusInicial = forma_pagamento === 'mercadopago' ? 'pendente' : 'confirmado';

      const pedido = await orderModel.create({
        total: totalComFrete,
        frete,
        address_id,
        company_id,
        observacao,
        forma_pagamento,
        status: statusInicial,
        itens
      });

      // Limpa o carrinho após criar o pedido
      await cartModel.clearCart();

      // Inicia a simulação de progresso do pedido em segundo plano
      simularProgressoPedido(pedido.id, statusInicial);

      res.status(201).json({ sucesso: true, dados: pedido });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const statusValidos = ['pendente', 'confirmado', 'em_preparo', 'a_caminho', 'entregue', 'cancelado'];

      const pedido = await orderModel.getById(req.params.id);
      if (!pedido) return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado' });

      const atualizado = await orderModel.updateStatus(req.params.id, status);
      res.json({ sucesso: true, dados: atualizado });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const pedido = await orderModel.getById(req.params.id);
      if (!pedido) return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado' });
      await orderModel.delete(req.params.id);
      res.json({ sucesso: true, mensagem: 'Pedido removido com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
