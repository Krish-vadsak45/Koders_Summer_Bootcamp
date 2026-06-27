'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight, FiUser, FiCheck } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

export default function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', username: '', password: '', confirmPassword: '' })

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = { email: '', username: '', password: '', confirmPassword: '' }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (!usernameRegex.test(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters (letters, numbers, _, -)'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.username && !newErrors.password && !newErrors.confirmPassword
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log('Form submitted:', formData)
    setFormData({ email: '', username: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="min-h-screen w-screen bg-background flex items-center justify-center p-4">
      {/* Animated background gradient blur */}
      <motion.div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(101, 161, 255, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Main form container */}
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with logo/title */}
        <motion.div
          className="mb-10 text-center"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/30 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              ✦
            </motion.div>
          </motion.div>
          <h1 className="text-4xl font-extrabold text-cyan-400 mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Join the future of digital excellence
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          variants={itemVariants}
        >
          {/* Email Input */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
              <div className="relative flex items-center bg-gray-900/50 border border-gray-700/50 rounded-lg focus-within:border-cyan-400/50 focus-within:bg-gray-900/80 transition-all duration-300 group-hover:border-blue-500/30">
                <FiMail className="ml-4 text-cyan-400/60 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 outline-none text-sm font-medium"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5 font-medium"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Username Input */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
              <div className="relative flex items-center bg-gray-900/50 border border-gray-700/50 rounded-lg focus-within:border-blue-400/50 focus-within:bg-gray-900/80 transition-all duration-300 group-hover:border-blue-500/30">
                <FiUser className="ml-4 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 outline-none text-sm font-medium"
                />
              </div>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5 font-medium"
                >
                  {errors.username}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
              <div className="relative flex items-center bg-gray-900/50 border border-gray-700/50 rounded-lg focus-within:border-purple-400/50 focus-within:bg-gray-900/80 transition-all duration-300 group-hover:border-blue-500/30">
                <FiLock className="ml-4 text-purple-400/60 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 outline-none text-sm font-medium"
                />
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5 font-medium"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Confirm Password Input */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
              <div className="relative flex items-center bg-gray-900/50 border border-gray-700/50 rounded-lg focus-within:border-emerald-400/50 focus-within:bg-gray-900/80 transition-all duration-300 group-hover:border-emerald-500/30">
                <FiCheck className="ml-4 text-emerald-400/60 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 outline-none text-sm font-medium"
                />
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1.5 font-medium"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 group relative py-3.5 px-4 font-bold text-white rounded-lg bg-cyan-500 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={isLoading ? { opacity: 0.7 } : { opacity: 1 }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="text-base tracking-wide">Sign Up</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiArrowRight className="w-4 h-4" />
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 my-8"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">
            Or
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </motion.div>

        {/* Google Sign Up */}
        <motion.button
          type="button"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-700/50 rounded-lg bg-gray-900/30 hover:bg-gray-900/60 hover:border-blue-400/30 transition-all duration-300 font-semibold text-gray-300 hover:text-white backdrop-blur-sm group"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="group-hover:scale-110 transition-transform"
          >
            <FcGoogle className="w-5 h-5" />
          </motion.div>
          <span className="text-sm tracking-wide">Continue with Google</span>
        </motion.button>

        {/* Footer text */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-gray-500 mt-8 font-medium tracking-wide"
        >
          By signing up, you agree to our{' '}
          <motion.a
            href="#"
            whileHover={{ textDecoration: 'underline', color: '#00d9ff' }}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Terms of Service
          </motion.a>{' '}
          and{' '}
          <motion.a
            href="#"
            whileHover={{ textDecoration: 'underline', color: '#00d9ff' }}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Privacy Policy
          </motion.a>
        </motion.p>
      </motion.div>
    </div>
  )
}
