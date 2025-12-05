interface ButtonProps {
    children?: React.ReactNode;
    icon?: React.ReactNode;
    text: string;
    onClick?: () => void;
    className?: string;
    color?: "primary" | "secondary";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    isLoading?: boolean; // Alias para manter compatibilidade
}

export default function Button({ children, icon, text, onClick, className, color, disabled, type, loading, isLoading = loading }: ButtonProps) {
    return (
        <button
            style={{
                backgroundColor: color === "primary" ? "#22C55E" : "#FFFFFF",
                color: color === "primary" ? "#FFFFFF" : "#000000",
                cursor: disabled ? "not-allowed" : "pointer"
            }}
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={`w-full py-4 cursor-pointer text-lg font-semibold shadow-sm rounded-md flex items-center justify-center ${color == "secondary" ? "border border-gray-300" : ""} ${disabled ? 'opacity-60' : ''} ${className}`}
        >
            {
                icon &&
                <span className="mr-2">{icon}</span>
            }
            {text}
            {children}
            {
                (loading || isLoading) && (
                    <svg className="animate-spin ml-2 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )
            }
        </button>
    );
}