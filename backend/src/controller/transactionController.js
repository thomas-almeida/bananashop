import Transaction from "../db/models/Transactions.js";
import User from "../db/models/User.js";
import Product from "../db/models/Products.js";
import axios from "axios";
import { notifyPaymentUpdate } from "../socket/index.js";
import { sellerSoldTemplate, customerBuyTemplate } from "../../utils/mail-templates.js";

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
                    Authorization: `Bearer ${process.env.ABACATEPAY_TOKEN_PROD}`
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

export const getTransactionById = async (req, res) => {

    const { transactionId } = req.params

    try {

        const transaction = await Transaction.findById(transactionId)

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" })
        }

        res.status(200).json(transaction)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}

export const updateBalance = async (req, res) => {
    try {

        const { storeId, transactionId } = req.body

        const user = await User.findOne({ store: storeId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        if (transaction.status !== "PAID") {
            return res.status(400).json({ error: "Transaction not paid yet" });
        }

        const product = await Product.findById(transaction.productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const realDiscount = transaction.value * user.banking.rate;
        user.banking.balance += transaction.value - realDiscount;
        product.inStorage -= 1;


        const sellerMailPayload = {
            accountId: process.env.ZOHO_ACCOUNT_ID,
            fromAddress: "Suporte BananaShop <thomas.rodrigues@bananasend.top>",
            toAddress: user.email, // Email do vendedor
            subject: `Parabéns ${user.username}, você vendeu!`,
            content: sellerSoldTemplate(user, transaction, product).content,
            userId: process.env.BANANASEND_USERID
        }

        const customerMailPayload = {
            accountId: process.env.ZOHO_ACCOUNT_ID,
            fromAddress: "Suporte BananaShop <thomas.rodrigues@bananasend.top>",
            toAddress: transaction.customer.email, // Email do comprador
            subject: `${transaction.customer.name}, Parabéns pela sua compra!`,
            content: customerBuyTemplate(transaction, product).content,
            userId: process.env.BANANASEND_USERID
        }

        await axios.post(`${process.env.BANANASEND_BASEURL}/zoho/send-mail`, sellerMailPayload);
        await axios.post(`${process.env.BANANASEND_BASEURL}/zoho/send-mail`, customerMailPayload);

        await user.save();
        await product.save();

        res.status(200).json({ message: "Balance updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

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

