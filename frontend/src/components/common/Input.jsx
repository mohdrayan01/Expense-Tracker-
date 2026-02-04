const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    className={`
            w-full rounded-xl border-2 px-4 py-3 
            ${Icon ? 'pl-11' : ''}
            bg-white dark:bg-slate-800 
            border-gray-200 dark:border-slate-700
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
            transition-all duration-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Input;
