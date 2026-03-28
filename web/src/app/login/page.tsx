'use client'
import { ArrowLeft, Eye, EyeOff, Key, Leaf, Loader2, Lock, LogIn, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import googleImage from '@/assets/google.png'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUserData } from '@/redux/userSlice'

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  let router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const dispatch = useDispatch()





  const formValidation = () => {
    if (email.trim() === "" || password.trim() === "") {
      return false
    }
    return true
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Incorrect email or password");
        } else {
          toast.error("Something went wrong. Please try again");
        }
      } else {
        toast.success("Login successful!");
        const res = await axios.get("/api/me")
        const fetchedUser = res.data.user;
        dispatch(setUserData(fetchedUser))
        
        if (fetchedUser?.role === "admin" || fetchedUser?.role === "dummy_admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>

      <motion.h1
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.6
        }}
        className='text-4xl font-extrabold text-blue-700 mb-2'>Welcome Back</motion.h1>
      <p className='text-gray-600 mb-6 flex items-center'>Login to our plateform <Leaf className='w-5 h-5 text-blue-600' /></p>

      <motion.form
        onSubmit={handleLogin}
        initial={{
          opacity: 0,

        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6
        }}
        className='flex flex-col gap-5 w-full max-w-sm'>

        <div className='relative '>
          <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input type="email" placeholder='Your Email' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none' onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className='relative '>
          <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input type={showPassword ? "text" : "password"} placeholder='Your Password' className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none' onChange={(e) => setPassword(e.target.value)} value={password} />
          {
            showPassword ? <EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer' onClick={() => setShowPassword(!showPassword)} /> : <Eye className='absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
          }
        </div>
        <div className='flex gap-3'>

          <button disabled={!formValidation() || loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex item-center justify-center gap-2 ${formValidation() ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" : " bg-gray-300 text-gray-500 cursor-not-allowed"}`}>{loading ? <Loader2 className=' animate-spin' /> : 'Login'}</button>


          <div className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex item-center justify-center gap-2 cursor-pointer hover:bg-red-100 bg-red-50 text-red-600`} onClick={() => router.push('/')}>
            Cancle
          </div>
        </div>

        <div className='flex items-center gap-2 text-gray-400 text-sm mt-2 '>
          <span className='flex-1 h-px bg-gray-200'></span>
          OR
          <span className='flex-1 h-px bg-gray-200'></span>

        </div>

        <div className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-100 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer' onClick={() => signIn('google', { callbackUrl: callbackUrl })}>
          <Image src={googleImage} alt='google' width={20} height={20} />
          Continue with Google
        </div>
      </motion.form>
      <p className='text-gray-600 mt-6 text-sm flex items-center gap-1 cursor-pointer' onClick={() => router.push('/register')}>Want to create an account ? <LogIn className='w-4 h-4' /> <span className='text-blue-600'>Sign up</span></p>
    </div>
  )
}

export default Login
