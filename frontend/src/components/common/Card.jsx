import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
