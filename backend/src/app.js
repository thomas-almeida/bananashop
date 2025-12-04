import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import api from './routes/index.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3333;

// Configuração do CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Substitua pelo URL do seu frontend
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", api);

// Inicialização do Socket.IO
export const io = new Server(server, {
  cors: corsOptions,
  path: '/socket.io/' // Caminho padrão do Socket.IO
});

// Armazenar instância do io para uso em outros arquivos via app.get('io')
app.set('io', io);

// Gerenciamento de conexões Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Novo cliente conectado:', socket.id);

  // Evento para acompanhar uma transação específica
  socket.on('watch-transaction', (transactionId) => {
    if (transactionId) {
      socket.join(`transaction:${transactionId}`);
      console.log(`👀 Cliente ${socket.id} está assistindo transação: ${transactionId}`);
      
      // Confirmação para o cliente
      socket.emit('watching-transaction', { transactionId });
    }
  });

  // Lidar com desconexão
  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// Função para notificar atualização de transação
export const notifyTransactionUpdate = (transactionId, data) => {
  io.to(`transaction:${transactionId}`).emit('transaction-update', {
    transactionId,
    ...data,
    timestamp: new Date().toISOString()
  });};

// Conectar ao MongoDB e iniciar o servidor
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Conectado ao MongoDB');

    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔌 Socket.IO disponível em /socket.io/`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

// Eventos de conexão do MongoDB
mongoose.connection.on('error', (err) => {
    console.error('❌ Erro na conexão com o MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('ℹ️  Desconectado do MongoDB');
});

// Iniciar o servidor
startServer();

export default app;