import { io } from '../app.js';

export const notifyPaymentUpdate = (transactionId, status) => {
  try {
    const room = `transaction:${transactionId}`;
    const payload = {
      status,
      transactionId,
      timestamp: new Date().toISOString()
    };
    
    console.log(`📢 Enviando notificação para sala: ${room}`, payload);
    
    // Envia para a sala específica
    io.to(room).emit('payment-update', payload);
    
    // Debug: Verifica se há sockets na sala
    const socketsInRoom = io.sockets.adapter.rooms.get(room);
    console.log(`👥 Sockets na sala ${room}:`, socketsInRoom ? socketsInRoom.size : 0);
    
    // Envia também para o socket global (para debug)
    io.emit('payment-update-global', { ...payload, debug: 'global' });
    
    console.log(`✅ Notificação enviada:`, { transactionId, status });
  } catch (error) {
    console.error('❌ Erro ao enviar notificação de pagamento:', error);
  }
};