import Transaction from "../db/models/Transactions.js";
import axios from "axios";
import { notifyPaymentUpdate } from "../socket/index.js";
export const createTransaction = async (req, res) => {
    try {

        const tx = await Transaction.create({
            ...req.body,
            status: "PENDING"
        });

        const amountInCents = Math.round(parseFloat(tx.value) * 100);

        const payload = {
            amount: amountInCents,
            expiresIn: 120,
            description: `Pedido ${tx._id}`,
            metadata: {
                externalId: tx._id.toString()
            }
        };

        const { data } = await axios.post(
            "https://api.abacatepay.com/v1/pixQrCode/create",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ABACATEPAY_TOKEN_DEV}`
                }
            }
        );

        await tx.save();

        res.status(201).json({
            brcode: data?.data?.brCode,
            brCodeBase64: data?.data?.brCodeBase64,
            pixId: data?.data?.id,
            expiresIn: payload.expiresIn,
            transactionId: tx?._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


export const abacatepayWebhook = async (req, res) => {
    try {
        const webhookSecret = req.query.webhookSecret;

        // 🔐 Validação do secret
        if (webhookSecret !== process.env.WEBHOOK_SECRET) {
            console.warn("⚠️ Webhook bloqueado - Secret inválido!");
            return res.sendStatus(401);
        }

        const { event, data } = req.body;

        console.log("📩 Webhook recebido:", event);

        if (event !== "billing.paid") {
            return res.sendStatus(200);
        }

        // ✅ EXTRAÇÃO CORRETA DOS DADOS
        const pixQrCode = data?.pixQrCode;

        if (!pixQrCode) {
            console.warn("⚠️ Webhook sem pixQrCode:", req.body);
            return res.sendStatus(400);
        }

        const externalId = pixQrCode.metadata?.externalId;

        if (!externalId) {
            console.warn("⚠️ Webhook sem externalId:", pixQrCode);
            return res.sendStatus(400);
        }

        // ✅ Atualiza sua transaction
        await Transaction.findByIdAndUpdate(
            externalId,
            {
                status: "PAID"
            }
        );

        // Notifica os clientes sobre a atualização do pagamento
        await notifyPaymentUpdate(externalId, 'PAID');
        console.log("✅ PIX confirmado e notificação enviada:", externalId);

        return res.status(200).json({ received: true });

    } catch (err) {
        console.error("❌ ERRO webhook:", err);
        return res.sendStatus(500);
    }
};
