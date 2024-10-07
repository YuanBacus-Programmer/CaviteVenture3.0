'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Signup12/Ui/avatar"
import { Card, CardContent } from "@/components/Signup12/Ui/card"
import { ScrollArea } from "@/components/Signup12/Ui/scroll-area"
import { ChevronDown, ChevronUp, Star } from 'lucide-react'

interface Feedback {
  id: string;
  user: {
    firstName: string;
    avatar: string;
  };
  rating: number;
  thoughts: string;
  suggestions: string;
  date: string;
}

const UserFeedback: React.FC = () => {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback')
        if (response.ok) {
          const data = await response.json()
          setFeedbackData(data)
        } else {
          console.error('Failed to fetch feedback')
        }
      } catch (error) {
        console.error('Error fetching feedback:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="bg-gradient-to-br from-[#fae8b4]/30 to-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#8B7E57] text-center">User Feedback</h2>
          <ScrollArea className="h-[60vh] sm:h-[70vh] pr-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading feedback...</p>
            ) : (
              <AnimatePresence>
                {feedbackData.map((feedback) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2">
                      <Avatar className="h-12 w-12 mb-2 sm:mb-0 sm:mr-3">
                        <AvatarImage
                          src={feedback.user?.avatar || '/default-avatar.png'}
                          alt={feedback.user?.firstName || 'User'}
                        />
                        <AvatarFallback>{feedback.user?.firstName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="font-semibold text-[#8B7E57]">{feedback.user?.firstName || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{feedback.date}</p>
                      </div>
                      <div className="flex items-center bg-[#fae8b4] text-[#8B7E57] px-3 py-1 rounded-full text-sm font-semibold mt-2 sm:mt-0">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span>{feedback.rating}/10</span>
                      </div>
                    </div>
                    <div className="relative">
                      <p className={`text-gray-700 ${expandedId === feedback.id ? '' : 'line-clamp-3'}`}>
                        <strong>Thoughts:</strong> {feedback.thoughts || 'No thoughts provided.'}
                      </p>
                      <p className={`text-gray-700 ${expandedId === feedback.id ? '' : 'line-clamp-3'}`}>
                        <strong>Suggestions:</strong> {feedback.suggestions || 'No suggestions provided.'}
                      </p>
                      {(feedback.thoughts.length > 150 || feedback.suggestions.length > 150) && (
                        <button
                          onClick={() => toggleExpand(feedback.id)}
                          className="mt-2 text-[#8B7E57] hover:underline focus:outline-none flex items-center"
                        >
                          {expandedId === feedback.id ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              Read more
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserFeedback
