"use client"
import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData, clearUser } from "../redux/userSlice"
import { useSession } from "next-auth/react"

import { setCart, clearCart, setLoading } from "../redux/cartSlice"

function useGetMe() {
  const dispatch = useDispatch()
  const { data: session, status } = useSession()

  useEffect(() => {
    const getMe = async () => {
      if (status === "loading") return 

      if (status === "unauthenticated") {
        dispatch(clearUser()) 
        dispatch(clearCart())
        return
      }
      try {
        const res = await axios.get("/api/me")
        dispatch(setUserData(res.data.user))
        
        // Fetch cart
        dispatch(setLoading(true));
        const cartRes = await axios.get("/api/user/cart");
        if (cartRes.data.success) {
          dispatch(setCart(cartRes.data.cart));
        }
      } catch (error) {
        console.error("getMe error:", error)
        dispatch(clearUser()) 
        dispatch(clearCart())
      }
    }

    getMe()
  }, [status, dispatch])
}

export default useGetMe
