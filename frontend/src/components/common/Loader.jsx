const Loader = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`${sizes[size]} relative`}>
                <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 animate-spin"></div>
            </div>
        </div>
    );
};

export default Loader;
