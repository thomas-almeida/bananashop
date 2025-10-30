interface ButtonProps {
    children?: React.ReactNode;
    icon?: React.ReactNode;
    text: string;
    onClick?: () => void;
    className?: string;
    color?: "primary" | "secondary";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function Button({ children, icon, text, onClick, className, color, disabled, type }: ButtonProps) {
    return (
        <button
            style={{
                backgroundColor: color === "primary" ? "#22C55E" : "#FFFFFF",
                color: color === "primary" ? "#FFFFFF" : "#000000"
            }}
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={`w-full py-4 text-lg font-semibold shadow-sm rounded-md flex items-center justify-center ${color == "secondary" ? "border border-gray-300" : ""} ${className}`}
        >
            {
                icon &&
                <span className="mr-2">{icon}</span>
            }
            {text}
            {children}
        </button>
    );
}