
import { ShoppingBag, DollarSign, Settings, MessageCircle } from "lucide-react"

export const pageTree = [
    {
        name: "Produtos",
        href: "/dashboard/products",
        icon: ShoppingBag,
    },
    {
        name: "Ajustes",
        href: "/dashboard/configuracoes",
        icon: Settings,
    },
    {
        name: "Meus Saques",
        href: "/dashboard/withdraw",
        icon: DollarSign,
    },
    {
        name: "Suporte",
        href: "https://api.whatsapp.com/send?phone=5511949098312&text=Ol%C3%A1%2C%20preciso%20de%20ajuda%20no%20BananaShop",
        icon: MessageCircle,
    },
]