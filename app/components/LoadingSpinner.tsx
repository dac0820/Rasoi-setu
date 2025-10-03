"use client"

export function LoadingSpinner({ size = "md", color = "orange" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const colorClasses = {
    orange: "border-orange-500",
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-gray-200 ${colorClasses[color]} border-t-transparent ${sizeClasses[size]}`}
      ></div>
    </div>
  )
}
