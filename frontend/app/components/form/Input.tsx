
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    type: string;
    register?: any;
    errors?: {
        message?: string;
    };
    className?: string;
    label?: string;
    icon?: React.ReactNode;
    name?: string;
}

export default function Input({
    placeholder,
    type,
    register,
    errors,
    className,
    label,
    icon,
    ...props
}: InputProps) {

    return (
        <div>
            {label && <label className="block font-bold pb-2 text-lg">{label}</label>}
            <div className={`w-full border ${errors ? 'border-red-500' : 'border-slate-300'} shadow p-2 py-3 rounded flex justify-start gap-2 items-center ${className || ''}`}>
                {
                    icon && (
                        <span className="text-gray-500">
                            {icon}
                        </span>
                    )
                }
                <input
                    className="w-full outline-none text-lg"
                    type={type || "text"}
                    placeholder={placeholder}
                    {...register}
                    {...props}
                />
            </div>
            {errors?.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>
    )
}