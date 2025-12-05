
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    type: string;
    register?: any;
    error?: string | { message?: string };
    className?: string;
    label?: string;
    icon?: React.ReactNode;
    name?: string;
    startIcon?: React.ReactNode;
    rows?: number;
}

export default function Input({
    placeholder,
    type = 'text',
    register,
    error,
    className = '',
    label,
    icon,
    startIcon,
    rows,
    ...props
}: InputProps) {

    const inputClass = `w-full outline-none text-lg ${type === 'textarea' ? 'resize-none' : ''}`;
    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
        <div className={className}>
            {label && <label className="block font-bold pb-2 text-lg">{label}</label>}
            <div 
                className={`w-full border ${
                    errorMessage ? 'border-red-500' : 'border-slate-300'
                } shadow p-2 py-3 rounded flex justify-start gap-2 items-center`}
            >
                {startIcon && <span className="text-gray-500">{startIcon}</span>}
                {type === 'textarea' ? (
                    <textarea
                        className={inputClass}
                        placeholder={placeholder}
                        rows={rows || 4}
                        {...(register || {})}
                        {...props}
                    />
                ) : (
                    <input
                        className={inputClass}
                        type={type}
                        placeholder={placeholder}
                        {...(register || {})}
                        {...props}
                    />
                )}
                {icon && <span className="text-gray-500">{icon}</span>}
            </div>
            {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
        </div>
    )
}