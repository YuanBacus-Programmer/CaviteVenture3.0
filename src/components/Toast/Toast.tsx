import { motion } from 'framer-motion'
import { FiCheck, FiX } from 'react-icons/fi'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex items-center`}
    >
      {type === 'success' ? (
        <FiCheck className="mr-2" />
      ) : (
        <FiX className="mr-2" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 focus:outline-none">
        <FiX />
      </button>
    </motion.div>
  )
}