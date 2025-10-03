"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "hi" | "gu"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Common
    welcome: "Welcome",
    continue: "Continue",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    logout: "Logout",
    dashboard: "Dashboard",
    profile: "Profile",
    orders: "Orders",
    inventory: "Inventory",
    analytics: "Analytics",

    // Registration
    vendor_registration: "Vendor Registration",
    seller_registration: "Seller Registration",
    name: "Name",
    phone: "Phone Number",
    email: "Email",
    password: "Password",
    select_language: "Select Language",
    register: "Register",

    // Products
    select_products: "Select Products You Sell",
    suggested_materials: "Suggested Raw Materials",
    out_of_stock: "Out of Stock Alert",
    buy_now: "Buy Now",
    low_stock: "Low Stock",

    // AI Assistant
    voice_assistant: "Voice Assistant",
    speak_now: "Speak Now",
    ai_suggestion: "AI Suggestion",
    ingredients_needed: "Ingredients Needed",

    // Admin
    admin_panel: "Admin Panel",
    pending_sellers: "Pending Sellers",
    approve: "Approve",
    reject: "Reject",
    quality_rating: "Quality Rating",

    // Products
    dabeli: "Dabeli",
    vadapav: "Vada Pav",
    dosa: "Dosa",
    idli: "Idli",
    pav_bhaji: "Pav Bhaji",
    samosa: "Samosa",
    dhokla: "Dhokla",
    kachori: "Kachori",

    // Ingredients
    bread: "Bread",
    potato: "Potato",
    onion: "Onion",
    masala: "Masala",
    oil: "Oil",
    rice: "Rice",
    dal: "Dal",
    flour: "Flour",
  },
  hi: {
    // Common
    welcome: "स्वागत",
    continue: "जारी रखें",
    submit: "जमा करें",
    cancel: "रद्द करें",
    save: "सेव करें",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    orders: "ऑर्डर",
    inventory: "इन्वेंटरी",
    analytics: "एनालिटिक्स",

    // Registration
    vendor_registration: "विक्रेता पंजीकरण",
    seller_registration: "सेलर पंजीकरण",
    name: "नाम",
    phone: "फोन नंबर",
    email: "ईमेल",
    password: "पासवर्ड",
    select_language: "भाषा चुनें",
    register: "पंजीकरण करें",

    // Products
    select_products: "आप जो उत्पाद बेचते हैं उन्हें चुनें",
    suggested_materials: "सुझाई गई कच्ची सामग्री",
    out_of_stock: "स्टॉक खत्म अलर्ट",
    buy_now: "अभी खरीदें",
    low_stock: "कम स्टॉक",

    // AI Assistant
    voice_assistant: "वॉयस असिस्टेंट",
    speak_now: "अब बोलें",
    ai_suggestion: "AI सुझाव",
    ingredients_needed: "आवश्यक सामग्री",

    // Admin
    admin_panel: "एडमिन पैनल",
    pending_sellers: "लंबित सेलर",
    approve: "स्वीकृत करें",
    reject: "अस्वीकार करें",
    quality_rating: "गुणवत्ता रेटिंग",

    // Products
    dabeli: "दाबेली",
    vadapav: "वड़ा पाव",
    dosa: "डोसा",
    idli: "इडली",
    pav_bhaji: "पाव भाजी",
    samosa: "समोसा",
    dhokla: "ढोकला",
    kachori: "कचौरी",

    // Ingredients
    bread: "ब्रेड",
    potato: "आलू",
    onion: "प्याज",
    masala: "मसाला",
    oil: "तेल",
    rice: "चावल",
    dal: "दाल",
    flour: "आटा",
  },
  gu: {
    // Common
    welcome: "સ્વાગત",
    continue: "ચાલુ રાખો",
    submit: "સબમિટ કરો",
    cancel: "રદ કરો",
    save: "સેવ કરો",
    logout: "લૉગઆઉટ",
    dashboard: "ડેશબોર્ડ",
    profile: "પ્રોફાઇલ",
    orders: "ઓર્ડર",
    inventory: "ઇન્વેન્ટરી",
    analytics: "એનાલિટિક્સ",

    // Registration
    vendor_registration: "વિક્રેતા નોંધણી",
    seller_registration: "સેલર નોંધણી",
    name: "નામ",
    phone: "ફોન નંબર",
    email: "ઇમેઇલ",
    password: "પાસવર્ડ",
    select_language: "ભાષા પસંદ કરો",
    register: "નોંધણી કરો",

    // Products
    select_products: "તમે જે ઉત્પાદનો વેચો છો તે પસંદ કરો",
    suggested_materials: "સૂચવેલ કાચી સામગ્રી",
    out_of_stock: "સ્ટોક સમાપ્ત અલર્ટ",
    buy_now: "હવે ખરીદો",
    low_stock: "ઓછો સ્ટોક",

    // AI Assistant
    voice_assistant: "વૉઇસ આસિસ્ટન્ટ",
    speak_now: "હવે બોલો",
    ai_suggestion: "AI સૂચન",
    ingredients_needed: "જરૂરી સામગ્રી",

    // Admin
    admin_panel: "એડમિન પેનલ",
    pending_sellers: "બાકી સેલર",
    approve: "મંજૂર કરો",
    reject: "નકારો",
    quality_rating: "ગુણવત્તા રેટિંગ",

    // Products
    dabeli: "દાબેલી",
    vadapav: "વડા પાવ",
    dosa: "દોસા",
    idli: "ઇડલી",
    pav_bhaji: "પાવ ભાજી",
    samosa: "સમોસા",
    dhokla: "ઢોકળા",
    kachori: "કચોરી",

    // Ingredients
    bread: "બ્રેડ",
    potato: "બટાકા",
    onion: "ડુંગળી",
    masala: "મસાલા",
    oil: "તેલ",
    rice: "ચોખા",
    dal: "દાળ",
    flour: "લોટ",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("rasoisetu-language") as Language
    if (savedLanguage && ["en", "hi", "gu"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("rasoisetu-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
