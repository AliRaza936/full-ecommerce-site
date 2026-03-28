"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: string | Date
}

interface TimeBoxProps {
  value: number
  label: string
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {

  const calculateTimeLeft = () => {
    const difference =
      new Date(targetDate).getTime() - new Date().getTime()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <ul className="flex gap-2">
      <TimeBox value={timeLeft.days} label="Days" />
      <TimeBox value={timeLeft.hours} label="Hour" />
      <TimeBox value={timeLeft.minutes} label="Min" />
      <TimeBox value={timeLeft.seconds} label="Sec" />
    </ul>
  )
}

const TimeBox = ({ value, label }: TimeBoxProps) => (
  <li className="bg-gray-300 lg:bg-gray-900/70 flex justify-center items-center flex-col rounded-md lg:w-12 lg:h-12 w-10 h-10 py-1.5">
    <p className="leading-tight text-white text-sm lg:text-lg font-semibold">
      {String(value).padStart(2, "0")}
    </p>
    <span className="leading-tight text-white text-[9px] lg:text-[12px] font-thin">
      {label}
    </span>
  </li>
)

export default CountdownTimer