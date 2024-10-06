'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/Signup12/Ui/Button"
import { Input } from "@/components/Signup12/Ui/Input"
import { Label } from "@/components/Signup12/Ui/Label"
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import ForgotPasswordModal from '@/components/Signin/Modal/ForgotPasswordModal'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Signed in successfully')

        // Optional: Store the JWT token in localStorage if your backend provides it
        if (data.token) {
          localStorage.setItem('token', data.token)
        }

        // Navigate to the dashboard
        router.push('/dashboard')
      } else {
        toast.error(data.message || 'Sign in failed')
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fae8b4] to-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Light passing effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay"></div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#fae8b4] opacity-30"
            style={{
              width: '100%',
              height: '2px',
              top: `${20 * i}%`,
              left: '-100%',
            }}
            animate={{
              left: '200%',
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + i,
              ease: 'linear',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Sign-in form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 bg-white bg-opacity-80 p-8 rounded-2xl backdrop-blur-lg relative z-10 shadow-2xl border border-[#fae8b4]"
      >
        <div className="text-center">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-4xl font-bold mb-2 text-[#fae8b4]"
          >
            Welcome Back
          </motion.h1>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <Label htmlFor="email" className="text-gray-700 mb-1 block">Email</Label>
            <Input
              id="email"
              type="email"
              required
              className="bg-white border-[#fae8b4] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#fae8b4]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
            <FiMail className="absolute right-3 top-9 text-[#fae8b4]" />
          </div>
          <div className="relative">
            <Label htmlFor="password" className="text-gray-700 mb-1 block">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              className="bg-white border-[#fae8b4] text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#fae8b4] pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <FiLock className="absolute right-9 top-9 text-[#fae8b4]" />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-[#fae8b4] focus:outline-none"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <Button type="submit" className="w-full bg-[#fae8b4] text-gray-800 hover:bg-[#f5d78e] transition-all duration-300 transform hover:scale-105" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setShowForgotPasswordModal(true)}
            className="text-sm text-[#fae8b4] hover:text-[#f5d78e] transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/Signup" className="text-[#fae8b4] hover:text-[#f5d78e] font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  )
}
