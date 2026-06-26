'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      alert('Login attempt with:\nEmail: ' + email + '\nPassword: ' + password)
    }, 1500)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert('Google login initiated')
    }, 1500)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  }

  const inputVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <div className="animated-gradient min-h-screen w-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(100, 100, 255, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 50, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(150, 100, 255, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -100, 50, 0],
          y: [0, -50, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main container */}
      <motion.div
        className="relative z-10 w-full max-w-md px-6 sm:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary mb-3 tracking-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            Nexus
          </motion.h1>
          <motion.p
            className="text-foreground/60 text-lg"
            variants={itemVariants}
          >
            Welcome back to the future
          </motion.p>
        </motion.div>

        {/* Form container */}
        <motion.div
          className="bg-card/40 backdrop-blur-2xl border border-primary/20 rounded-3xl p-8 sm:p-10 glow-effect shadow-2xl"
          initial={{ opacity: 0, y: 40, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, y: 0, backdropFilter: 'blur(40px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <motion.div
              className="relative"
              variants={inputVariants}
            >
              <label className="block text-sm font-semibold text-foreground/80 mb-3">
                Email Address
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5 z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-primary/10 border border-primary/30 rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/60 focus:bg-primary/15 transition-all duration-300 input-glow font-medium"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300" />
              </div>
            </motion.div>

            {/* Password input */}
            <motion.div
              className="relative"
              variants={inputVariants}
            >
              <label className="block text-sm font-semibold text-foreground/80 mb-3">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5 z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-primary/10 border border-primary/30 rounded-xl text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/60 focus:bg-primary/15 transition-all duration-300 input-glow font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 cursor-pointer top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300" />
              </div>
            </motion.div>

            {/* Sign in button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 cursor-pointer px-6 py-3.5 bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground font-black text-lg rounded-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group button-glow disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              variants={itemVariants}
            >
              <motion.span
                animate={{ opacity: isLoading ? 0 : 1, x: isLoading ? -10 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </motion.span>
              <motion.div
                animate={{ opacity: isLoading ? 1 : 0, x: isLoading ? 0 : 10 }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-block animate-spin">
                  {isLoading ? '⚡' : <FiArrowRight className="w-5 h-5" />}
                </span>
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-500 pointer-events-none" />
            </motion.button>

            {/* Divider */}
            <motion.div
              className="relative my-8"
              variants={itemVariants}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-card/40 text-foreground/60 font-medium">or</span>
              </div>
            </motion.div>

            {/* Google sign in button */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full px-6 py-3.5 cursor-pointer bg-primary/10 border border-primary/40 text-foreground font-bold text-base rounded-xl hover:bg-primary/15 transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              whileHover={{ scale: isLoading ? 1 : 1.02, backgroundColor: 'rgba(100, 100, 255, 0.2)' }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              variants={itemVariants}
            >
              <FcGoogle className="w-6 h-6" />
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </motion.button>

            {/* Footer text */}
            <motion.p
              className="text-center text-foreground/50 text-sm mt-6"
              variants={itemVariants}
            >
              Don&apos;t have an account?{' '}
              <motion.a
                href="#"
                className="text-primary font-semibold hover:text-accent transition-colors underline"
                whileHover={{ scale: 1.05 }}
              >
                Sign up here
              </motion.a>
            </motion.p>
          </form>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          animate={{
            y: [0, 30, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl pointer-events-none"
          animate={{
            y: [0, -30, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  )
}
