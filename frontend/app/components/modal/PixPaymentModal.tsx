'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { X, Copy, Check, Clock } from 'lucide-react';
import Button from '../form/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateBalance } from '@/app/service/transactionService';

interface PaymentUpdatePayload {
  status: string;
  transactionId: string;
  timestamp: string;
  debug?: string;
}

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  pixId: string;
  pixCode: string;
  expiresIn: number;
  transactionId: string;
  storeId: string;
}

export default function PixPaymentModal({ isOpen, onClose, qrCode, pixCode, storeId, transactionId, expiresIn = 120 }: PixPaymentModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expiresIn); // tempo em segundos
  const [status, setStatus] = useState("PENDING");
  const socketRef = useRef<Socket | null>(null);
  const redirect = useRouter()

  // Efeito para gerenciar a conexão WebSocket
  useEffect(() => {
    if (!transactionId) return;

    console.log('🔌 Iniciando conexão WebSocket para transação:', transactionId);

    // Configuração do Socket.IO
    socketRef.current = io('https://bananashop.onrender.com', {
      path: '/socket.io', // Importante: deve ser igual ao configurado no backend
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      secure: true,
      rejectUnauthorized: false // Apenas para desenvolvimento
    });

    // Log de eventos para debug
    const events = ['connect', 'disconnect', 'error', 'connect_error', 'reconnect_attempt', 'reconnect'];
    events.forEach(event => {
      socketRef.current?.on(event, (arg) => {
        console.log(`🔌 Socket ${event}:`, arg || 'No data');
      });
    });

    // Evento de conexão estabelecida
    socketRef.current.on('connect', () => {
      console.log('✅ Conectado ao servidor WebSocket. ID:', socketRef.current?.id);

      // Entra na sala específica da transação
      console.log('👀 Assinando transação:', transactionId);
      socketRef.current?.emit('watch-transaction', transactionId);
    });

    // Escuta por atualizações de pagamento
    const handlePaymentUpdate = async (payload: PaymentUpdatePayload) => {
      console.log('💰 Evento de pagamento recebido:', payload);

      if (payload.transactionId === transactionId) {
        console.log('✅ Pagamento atualizado:', payload.status);
        setStatus(payload?.status);

        await updateBalance(storeId, payload.transactionId)

        setTimeout(() => {
          redirect.push("/obrigado")
        }, 3000)
      }
    };

    // Escuta tanto o evento específico quanto o global (para debug)
    socketRef.current.on('payment-update', handlePaymentUpdate);
    socketRef.current.on('payment-update-global', (payload) => {
      if (payload.transactionId === transactionId) {
        handlePaymentUpdate(payload);
      }
    });

    // Tratamento de erros
    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Erro na conexão WebSocket:', err.message);
    });

  }, [transactionId]);

  // Efeito para reiniciar o contador quando o modal for aberto
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(expiresIn);
    }
  }, [isOpen, expiresIn]);

  // Efeito para o contador regressivo
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]); // Executa quando o modal é aberto/fechado ou o timeLeft muda

  // Garante que timeLeft nunca seja negativo
  const safeTimeLeft = Math.max(0, timeLeft);
  const minutes = Math.floor(safeTimeLeft / 60);
  const seconds = safeTimeLeft % 60;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen) return null;

  // Função para prevenir o fechamento ao clicar no backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Não faz nada ao clicar no backdrop
    e.stopPropagation();
  };

  // Função para prevenir o fechamento ao clicar no conteúdo do modal
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/45 flex justify-center items-end z-50 transition-opacity duration-300"
      onClick={onClose} // Fecha apenas se clicar no backdrop (mas o handleBackdropClick previne isso)
    >
      <div
        className="bg-white w-full max-w-2xl rounded-t-2xl p-6 animate-slide-up overflow-y-auto max-h-[90vh]"
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Finalizar com PIX
            </h1>
            <p className="text-gray-500">Escaneie o QR Code ou copie o código</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="py-4 flex flex-col items-center">
          {/* QR Code */}
          <div className="w-full flex justify-center mb-6">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <Image
                src={qrCode || ''}
                alt="QR Code PIX"
                width={256}
                height={256}
                className="w-56 h-56 object-contain"
              />
            </div>
          </div>

          {/* Código PIX */}
          <div className="w-full mb-6">
            <div className="relative">
              <p className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 font-mono break-all border border-gray-200">
                {pixCode}
              </p>
              <Button
                type="button"
                onClick={copyToClipboard}
                text={isCopied ? "Copiado!" : "Copiar código"}
                icon={isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                color="secondary"
                className="mt-3 w-full justify-center"
              />
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <div className='pb-2 p-2 border border-slate-200 bg-slate-100 rounded'>
              <strong className={`font-medium ${status === 'PAID' ? 'text-green-500' : 'text-yellow-500'}`}>
                Situação: {status === 'PENDING' ? 'PENDENTE' : 'PAGO'}
              </strong>
            </div>
            {status !== 'PAID' && (
              <div className="flex items-center justify-center gap-2 my-4">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">
                  Tempo restante: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            )}
            <p>O pagamento será processado automaticamente após a confirmação e o produto será reservado para você pela loja.</p>
            {timeLeft === 0 && (
              <p className="text-red-500 font-medium mt-2">
                Tempo esgotado! Por favor, inicie um novo pagamento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
