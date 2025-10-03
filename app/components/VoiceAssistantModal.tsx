"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "../context/LanguageContext"
import { useStore } from "../store/useStore"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const aiResponses = {
  en: {
    dosa: {
      message: "For making delicious dosa, you'll need these ingredients:",
      ingredients: ["Rice", "Dal", "Oil", "Salt"],
    },
    dabeli: {
      message: "To prepare tasty dabeli, here's what you need:",
      ingredients: ["Bread", "Potato", "Onion", "Masala", "Oil"],
    },
    vadapav: {
      message: "For authentic vada pav, gather these items:",
      ingredients: ["Bread", "Potato", "Flour", "Oil", "Masala"],
    },
    default: {
      message: "I can help you find ingredients for various street foods. Try asking about dosa, dabeli, or vada pav!",
      ingredients: [],
    },
  },
  hi: {
    dosa: {
      message: "स्वादिष्ट डोसा बनाने के लिए, आपको ये सामग्री चाहिए:",
      ingredients: ["चावल", "दाल", "तेल", "नमक"],
    },
    dabeli: {
      message: "स्वादिष्ट दाबेली तैयार करने के लिए, यह चाहिए:",
      ingredients: ["ब्रेड", "आलू", "प्याज", "मसाला", "तेल"],
    },
    vadapav: {
      message: "असली वड़ा पाव के लिए, ये चीजें इकट्ठा करें:",
      ingredients: ["ब्रेड", "आलू", "आटा", "तेल", "मसाला"],
    },
    default: {
      message:
        "मैं विभिन्न स्ट्रीट फूड के लिए सामग्री खोजने में आपकी मदद कर सकता हूं। डोसा, दाबेली, या वड़ा पाव के बारे में पूछने की कोशिश करें!",
      ingredients: [],
    },
  },
  gu: {
    dosa: {
      message: "સ્વાદિષ્ટ દોસા બનાવવા માટે, તમને આ સામગ્રીની જરૂર છે:",
      ingredients: ["ચોખા", "દાળ", "તેલ", "મીઠું"],
    },
    dabeli: {
      message: "સ્વાદિષ્ટ દાબેલી તૈયાર કરવા માટે, આ જોઈએ:",
      ingredients: ["બ્રેડ", "બટાકા", "ડુંગળી", "મસાલા", "તેલ"],
    },
    vadapav: {
      message: "અસલી વડા પાવ માટે, આ વસ્તુઓ એકત્રિત કરો:",
      ingredients: ["બ્રેડ", "બટાકા", "લોટ", "તેલ", "મસાલા"],
    },
    default: {
      message:
        "હું વિવિધ સ્ટ્રીટ ફૂડ માટે સામગ્રી શોધવામાં તમારી મદદ કરી શકું છું. દોસા, દાબેલી, અથવા વડા પાવ વિશે પૂછવાનો પ્રયાસ કરો!",
      ingredients: [],
    },
  },
}

export function VoiceAssistantModal({ isOpen, onClose }) {
  const { language, t } = useLanguage()
  const { products } = useStore()
  const { toast } = useToast()

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState(null)

  const simulateVoiceInput = () => {
    setIsListening(true)

    // Simulate voice recognition
    setTimeout(() => {
      const sampleQueries = ["dosa", "dabeli", "vadapav"]
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)]

      setTranscript(`${randomQuery} ke liye kya chahiye?`)
      setIsListening(false)

      // Generate AI response
      const response = aiResponses[language][randomQuery] || aiResponses[language]["default"]
      setAiResponse(response)
    }, 2000)
  }

  const handleBuyIngredient = (ingredient) => {
    toast({
      title: "Added to Cart",
      description: `${ingredient} has been added to your cart.`,
    })
  }

  const resetAssistant = () => {
    setTranscript("")
    setAiResponse(null)
    setIsListening(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mic className="h-5 w-5 mr-2 text-green-500" />
            {t("voice_assistant")}
          </DialogTitle>
          <DialogDescription>Ask me about ingredients for your street food items</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Voice Input Section */}
          <div className="text-center">
            <Button
              onClick={simulateVoiceInput}
              disabled={isListening}
              className={`w-full h-16 ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-6 w-6 mr-2" />
                  Listening...
                </>
              ) : (
                <>
                  <Mic className="h-6 w-6 mr-2" />
                  {t("speak_now")}
                </>
              )}
            </Button>

            {isListening && (
              <div className="mt-2">
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-blue-800">You said:</p>
                <p className="text-blue-700">"{transcript}"</p>
              </CardContent>
            </Card>
          )}

          {/* AI Response */}
          {aiResponse && (
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Volume2 className="h-4 w-4 text-green-600 mr-2" />
                  <p className="text-sm font-medium text-green-800">{t("ai_suggestion")}:</p>
                </div>
                <p className="text-green-700 mb-3">{aiResponse.message}</p>

                {aiResponse.ingredients.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-800">{t("ingredients_needed")}:</p>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse.ingredients.map((ingredient, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-green-200"
                          onClick={() => handleBuyIngredient(ingredient)}
                        >
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetAssistant} className="flex-1 bg-transparent">
              Ask Again
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
