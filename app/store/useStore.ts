"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  phone: string
  email?: string
  type: "vendor" | "seller" | "admin"
  language: string
  products?: string[]
  isVerified?: boolean
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  supplier: string
  rating: number
}

interface Order {
  id: string
  vendorId: string
  sellerId: string
  products: { productId: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "confirmed" | "delivered"
  date: string
}

interface Seller {
  id: string
  name: string
  email: string
  phone: string
  documents: {
    aadhar: string
    pan: string
    bank: string
  }
  products: string[]
  status: "pending" | "approved" | "rejected"
  rating: number
}

interface StoreState {
  user: User | null
  products: Product[]
  orders: Order[]
  sellers: Seller[]
  setUser: (user: User | null) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  addOrder: (order: Order) => void
  addSeller: (seller: Seller) => void
  updateSellerStatus: (id: string, status: "approved" | "rejected") => void
  updateProductRating: (productName: string, rating: number) => void

}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      products: [
        { id: "1", name: "Bread", category: "bakery", price: 25, stock: 50, supplier: "Local Bakery", rating: 8 },
        { id: "2", name: "Potato", category: "vegetable", price: 30, stock: 20, supplier: "Farm Fresh", rating: 7 },
        { id: "3", name: "Onion", category: "vegetable", price: 40, stock: 15, supplier: "Veggie Mart", rating: 8 },
        { id: "4", name: "Masala", category: "spices", price: 80, stock: 30, supplier: "Spice King", rating: 9 },
        { id: "5", name: "Oil", category: "cooking", price: 120, stock: 25, supplier: "Pure Oil Co", rating: 8 },
        { id: "6", name: "Rice", category: "grains", price: 60, stock: 40, supplier: "Rice Mills", rating: 7 },
        { id: "7", name: "Dal", category: "pulses", price: 90, stock: 35, supplier: "Pulse Point", rating: 8 },
        { id: "8", name: "Flour", category: "grains", price: 45, stock: 10, supplier: "Flour Factory", rating: 7 },
      ],
      orders: [],
      sellers: [
        {
          id: "1",
          name: "Rajesh Kumar",
          email: "rajesh@example.com",
          phone: "+91 9876543210",
          documents: { aadhar: "aadhar1.pdf", pan: "pan1.pdf", bank: "bank1.pdf" },
          products: ["Potato", "Onion", "Tomato"],
          status: "pending",
          rating: 0,
        },
        {
          id: "2",
          name: "Priya Sharma",
          email: "priya@example.com",
          phone: "+91 9876543211",
          documents: { aadhar: "aadhar2.pdf", pan: "pan2.pdf", bank: "bank2.pdf" },
          products: ["Masala", "Oil", "Spices"],
          status: "pending",
          rating: 0,
        },
      ],
      setUser: (user) => set({ user }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      addSeller: (seller) => set((state) => ({ sellers: [...state.sellers, seller] })),
      updateSellerStatus: (id, status) =>
        set((state) => ({
          sellers: state.sellers.map((s) => (s.id === id ? { ...s, status } : s)),
        })),
      updateProductRating: (productName, rating) =>
        set((state) => ({
          products: state.products.map((p) => (p.name === productName ? { ...p, rating } : p)),
        })),
    }),
    {
      name: "rasoisetu-store",
    },
  ),
)
