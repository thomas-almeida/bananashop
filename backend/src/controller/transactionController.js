import Transaction from "../db/models/Transactions.js";
import axios from "axios";

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
            expiresIn: payload.expiresIn
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

//webhook
export const abacatepayWebhook = async (req, res) => {
    try {
        const webhookSecret = req.query.webhookSecret;

        // 🚨 VALIDAÇÃO DE SEGURANÇA
        if (webhookSecret !== process.env.WEBHOOK_SECRET) {
            console.warn("⚠️ Webhook bloqueado - Secret inválido!");
            return res.sendStatus(401);
        }

        const { event, billing } = req.body;

        console.log("📩 Webhook recebido:", event);

        // Só atua no evento que importa
        if (event !== "billing.paid") {
            return res.sendStatus(200);
        }

        const externalId = billing.metadata.externalId;

        // Atualiza sua transaction no banco
        await Transaction.findByIdAndUpdate(
            externalId,
            {
                status: "PAID",
                abacateBillingId: billing.id,
                paidAt: new Date()
            }
        );

        console.log("✅ PIX confirmado:", externalId);

        return res.status(200).json({ received: true });

    } catch (err) {
        console.error("❌ ERRO webhook:", err);
        return res.sendStatus(500);
    }
};