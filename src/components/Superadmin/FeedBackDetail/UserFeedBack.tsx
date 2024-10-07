'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Signup12/Ui/avatar"
import { Card, CardContent } from "@/components/Signup12/Ui/card"
import { ScrollArea } from "@/components/Signup12/Ui/scroll-area"
import { ChevronDown, ChevronUp, Star } from 'lucide-react'

// Sample feedback data
const feedbackData = [
  {
    id: 1,
    user: {
      firstName: "John",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 9,
    comment: "Great experience! The tour was well-organized and the guide was very knowledgeable.",
    date: "2023-06-15",
  },
  {
    id: 2,
    user: {
      firstName: "Sarah",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 8,
    comment: "Beautiful sights and friendly staff. Could use more rest stops though.",
    date: "2023-06-14",
  },
  {
    id: 3,
    user: {
      firstName: "Mike",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 10,
    comment: "Absolutely fantastic! Cavite's hidden gems were a revelation. Can't wait to come back!",
    date: "2023-06-13",
  },
  // Add more feedback entries as needed
]

const UserFeedback: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="bg-gradient-to-br from-[#fae8b4]/30 to-white shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#8B7E57] text-center">User Feedback</h2>
          <ScrollArea className="h-[60vh] sm:h-[70vh] pr-4">
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
                      <AvatarImage src={feedback.user.avatar} alt={feedback.user.firstName} />
                      <AvatarFallback>{feedback.user.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-semibold text-[#8B7E57]">{feedback.user.firstName}</p>
                      <p className="text-sm text-gray-500">{feedback.date}</p>
                    </div>
                    <div className="flex items-center bg-[#fae8b4] text-[#8B7E57] px-3 py-1 rounded-full text-sm font-semibold mt-2 sm:mt-0">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>{feedback.rating}/10</span>
                    </div>
                  </div>
                  <div className="relative">
                    <p className={`text-gray-700 ${expandedId === feedback.id ? '' : 'line-clamp-3'}`}>
                      {feedback.comment}
                    </p>
                    {feedback.comment.length > 150 && (
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserFeedback