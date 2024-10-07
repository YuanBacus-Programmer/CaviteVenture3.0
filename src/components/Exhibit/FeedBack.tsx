'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Slider } from "@/components/Signup12/Ui/slider"
import { Textarea } from "@/components/Signup12/Ui/textarea"
import { Button } from "@/components/Signup12/Ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Signup12/Ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/Signup12/Ui/use-toast"
import { Toast, ToastProvider } from "@/components/Signup12/Ui/toast"

export default function FeedbackForm() {
  const [rating, setRating] = useState<number>(5)
  const [thoughts, setThoughts] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const userFeedback = {
      avatar: 'https://example.com/user-avatar.png', // Replace with actual user avatar URL
      firstName: 'John', // Replace with the user's first name dynamically if available
      rating,
      thoughts,
      suggestions,
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userFeedback),
      });

      if (response.ok) {
        toast({
          title: 'Thank you for your feedback!',
          description: 'We appreciate your input and will use it to improve our services.',
        });

        // Reset form
        setRating(5);
        setThoughts('');
        setSuggestions('');
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.message || 'Something went wrong',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Network error or server is unavailable',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ToastProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 md:p-8 flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fae8b4] to-white"
      >
        <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
          <CardHeader className="border-b border-[#fae8b4]">
            <CardTitle className="text-2xl font-bold text-[#8B7E57]">CaviteVenture Feedback</CardTitle>
            <CardDescription>We value your opinion! Please share your thoughts on your experience.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Rate your experience (1-10)
                </label>
                <Slider
                  id="rating"
                  min={1}
                  max={10}
                  step={1}
                  value={[rating]}
                  onValueChange={(value: React.SetStateAction<number>[]) => setRating(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 (Lowest)</span>
                  <span className="font-semibold text-[#8B7E57]">{rating}/10</span>
                  <span>10 (Highest)</span>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="thoughts" className="block text-sm font-medium text-gray-700">
                  Share your thoughts
                </label>
                <Textarea
                  id="thoughts"
                  placeholder="What did you think about your experience?"
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                  className="w-full border-[#fae8b4] focus:ring-[#8B7E57] focus:border-[#8B7E57]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="suggestions" className="block text-sm font-medium text-gray-700">
                  Suggestions for improvement
                </label>
                <Textarea
                  id="suggestions"
                  placeholder="How can we make your experience better?"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  className="w-full border-[#fae8b4] focus:ring-[#8B7E57] focus:border-[#8B7E57]"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#fae8b4] text-[#8B7E57] hover:bg-[#8B7E57] hover:text-[#fae8b4] transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Feedback...
                  </motion.div>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <Toast />
    </ToastProvider>
  )
}
