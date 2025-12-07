
export const sellerSoldTemplate = (user, transaction, product) => {
    return {
        name: "seller-sold-product",
        subject: "Parabéns, você vendeu!",
        content: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Venda Realizada - BananaShop</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🎉 Parabéns você vendeu!</h1>
                                    </td>
                                </tr>
                                
                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                                            Olá <strong>${user.username}</strong>,
                                        </p>
                                        
                                        <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                                            Ótimas notícias! Seu produto <strong style="color: #22C55E;">${product.name}</strong> foi vendido por <strong style="color: #22C55E; font-size: 18px;">${transaction.value}</strong>
                                        </p>
                                        
                                        <p style="margin: 0 0 30px 0; color: #555; font-size: 16px; line-height: 1.6;">
                                            Entre em contato com seu cliente para combinar a entrega:
                                        </p>
                                        
                                        <!-- Customer Info Card -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; border-left: 4px solid #22C55E;">
                                            <tr>
                                                <td style="padding: 25px;">
                                                    <p style="margin: 0 0 8px 0; color: #333; font-size: 15px; line-height: 1.8;">
                                                        <strong style="color: #666; display: inline-block; width: 80px;">Nome:</strong> ${transaction.customer.name}
                                                    </p>
                                                    <p style="margin: 0 0 8px 0; color: #333; font-size: 15px; line-height: 1.8;">
                                                        <strong style="color: #666; display: inline-block; width: 80px;">Email:</strong> <a href="mailto:${transaction.customer.email}" style="color: #2196F3; text-decoration: none;">${transaction.customer.email}</a>
                                                    </p>
                                                    <p style="margin: 0 0 8px 0; color: #333; font-size: 15px; line-height: 1.8;">
                                                        <strong style="color: #666; display: inline-block; width: 80px;">Telefone:</strong> <a href="tel:${transaction.customer.phone}" style="color: #2196F3; text-decoration: none;">${transaction.customer.phone}</a>
                                                    </p>
                                                    <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.8;">
                                                        <strong style="color: #666; display: inline-block; width: 80px;">Endereço:</strong> ${transaction.customer.address}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                                            Obrigado por usar o <strong style="color: #22C55E;">BananaShop</strong>! 🍌
                                        </p>
                                        <p style="margin: 0; color: #999; font-size: 12px;">
                                            Continue vendendo e alcançando seus objetivos!
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Email Footer -->
                            <table width="600" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <p style="margin: 0; color: #999; font-size: 12px;">
                                            Este é um email automático, por favor não responda.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
                    `
    }
}

export const customerBuyTemplate = (transaction, product) => {
    return {
        name: "customer-buy-product",
        subject: "Parabéns pela compra - aqui está seu comprovante!",
        content: `
            <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprovante de Pagamento - BananaShop</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">✅ Pagamento Confirmado!</h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                                Olá <strong>${transaction.customer.name}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #555; font-size: 16px; line-height: 1.6;">
                                Seu pagamento foi aprovado com sucesso! 🎉
                            </p>
                            
                            <p style="margin: 0 0 30px 0; color: #555; font-size: 16px; line-height: 1.6;">
                                A loja está preparando o seu produto <strong style="color: #22C55E;">${product.name}</strong> e em breve entrarão em contato com você para os detalhes da entrega.
                            </p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://bananashop-saas.vercel.app/comprovante/${transaction._id}" style="display: inline-block; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
                                            📄 Acessar Comprovante
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Info Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 6px; border-left: 4px solid #22C55E; margin-top: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.6;">
                                            <strong>💡 Dica:</strong> Salve ou imprima seu comprovante para referência futura. Você pode acessá-lo a qualquer momento através do link acima.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                                Obrigado por usar o <strong style="color: #22C55E;">BananaShop</strong>! 🍌
                            </p>
                            <p style="margin: 0; color: #999; font-size: 12px;">
                                Sua satisfação é nossa prioridade!
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Email Footer -->
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0; color: #999; font-size: 12px;">
                                Este é um email automático, por favor não responda.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
    }
}