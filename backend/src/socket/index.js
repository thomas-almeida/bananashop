import { io } from '../app.js';

export const notifyPaymentUpdate = (transactionId, status) => {
  try {
    io.to(`transaction:${transactionId}`).emit('payment-update', {
      status,
      transactionId,
      timestamp: new Date().toISOString()
    });
    console.log(`📢 Notificação de pagamento enviada para transação ${transactionId}: ${status}`);
  } catch (error) {
    console.error('❌ Erro ao enviar notificação de pagamento:', error);
  }
};