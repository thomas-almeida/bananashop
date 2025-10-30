
import { ShoppingBag, DollarSign, Settings, MessageCircle } from "lucide-react"

export const pageTree = [
    {
        name: "Produtos",
        href: "/dashboard/products",
        icon: ShoppingBag,
    },
    {
        name: "Finanças",
        href: "/dashboard/finance",
        icon: DollarSign,
    },
    {
        name: "Ajustes",
        href: "/dashboard/settings",
        icon: Settings,
    },
    {
        name: "Suporte",
        href: "/dashboard",
        icon: MessageCircle,
    }
]