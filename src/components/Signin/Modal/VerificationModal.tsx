import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/Signup12/Ui/Input"
import { Button } from "@/components/Signup12/Ui/Button"
import { toast } from 'react-hot-toast'
import ResetPasswordModal from '@/components/Signin/Modal/ResetPasswordModal'

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export default function VerificationModal({ isOpen, onClose, email }: VerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically verify the code on the server
      // For this example, we'll just simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowResetPasswordModal(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">Enter Verification Code</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        email={email}
        verificationCode={verificationCode}
      />
    </>
  )
}