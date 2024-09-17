import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Custom hook to capture user behaviors
const useUserBehavior = () => {
  const [behavior, setBehavior] = useState({
    mouseMovements: [],
    scrollSpeed: [],
    typingSpeed: [],
    clicks: 0,
    tabChanges: 0,
  })
  const lastKeyPressTime = useRef(Date.now())

  useEffect(() => {
    const handleMouseMove = (e) => {
      setBehavior(prev => ({
        ...prev,
        mouseMovements: [...prev.mouseMovements.slice(-99), { x: e.clientX, y: e.clientY }]
      }))
    }

    const handleScroll = () => {
      const speed = window.scrollY / window.innerHeight
      setBehavior(prev => ({
        ...prev,
        scrollSpeed: [...prev.scrollSpeed.slice(-99), speed]
      }))
    }

    const handleKeyPress = () => {
      const now = Date.now()
      const speed = now - lastKeyPressTime.current
      lastKeyPressTime.current = now
      setBehavior(prev => ({
        ...prev,
        typingSpeed: [...prev.typingSpeed.slice(-99), speed]
      }))
    }

    const handleClick = () => {
      setBehavior(prev => ({ ...prev, clicks: prev.clicks + 1 }))
    }

    const handleTabChange = () => {
      setBehavior(prev => ({ ...prev, tabChanges: prev.tabChanges + 1 }))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keypress', handleKeyPress)
    window.addEventListener('click', handleClick)
    document.addEventListener('visibilitychange', handleTabChange)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keypress', handleKeyPress)
      window.removeEventListener('click', handleClick)
      document.removeEventListener('visibilitychange', handleTabChange)
    }
  }, [])

  return behavior
}

export default function CaptchaPage() {
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const behavior = useUserBehavior()

  const handleVerification = async () => {
    setIsLoading(true)
    // Simulating API call
    console.log(behavior)
    try {
      const response = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber, behavior }),
      })
      const data = await response.json()
      setTimeout(() => {
        
      }, 20000);
      if (data.success) {
        setIsVerified(true)
      } else {
        setShowModal(true)
      }
    } catch (error) {
      console.error('Verification failed:', error)
      setShowModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Captcha Verification</h2>
        <div className="mb-4">
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <Input
            id="aadhaar"
            type="text"
            placeholder="Enter your Aadhaar number"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 mb-4">
          {!isVerified ? (
            <Checkbox id="captcha" disabled={isLoading} onCheckedChange={handleVerification} />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          )}
          <Label htmlFor="captcha">I'm not a robot</Label>
        </div>
        {isLoading && <p className="text-center text-gray-500">Verifying...</p>}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Verification Required</DialogTitle>
            <DialogDescription>
              We couldn't automatically verify you. Please complete the manual captcha.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-40 bg-gray-100 rounded-md">
            <span className="text-gray-500">Manual Captcha Placeholder</span>
          </div>
          <Button onClick={() => setShowModal(false)}>Submit</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}