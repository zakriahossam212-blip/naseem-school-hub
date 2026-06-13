/**
 * Color & Tailwind Constants
 * Centralized color schemes and gradients
 */

export const COLORS = {
  gradients: {
    blue: "from-blue-500 to-blue-700",
    emerald: "from-emerald-500 to-emerald-700",
    purple: "from-purple-500 to-purple-700",
    orange: "from-orange-500 to-orange-700",
    amber: "from-amber-500 to-amber-700",
    teal: "from-teal-500 to-teal-700",
  },
  textColors: {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
    amber: "text-amber-600",
    pink: "text-pink-600",
  },
  bgColors: {
    blue: "bg-blue-50",
    green: "bg-green-50",
    orange: "bg-orange-50",
    purple: "bg-purple-50",
    yellow: "bg-yellow-50",
    red: "bg-red-50",
  },
  borders: {
    blue: "border-blue-200",
    green: "border-green-200",
    orange: "border-orange-200",
    purple: "border-purple-200",
    yellow: "border-yellow-200",
    red: "border-red-200",
  },
  glows: {
    blue: "group-hover:shadow-blue-100",
    green: "group-hover:shadow-green-100",
    orange: "group-hover:shadow-orange-100",
    purple: "group-hover:shadow-purple-100",
    yellow: "group-hover:shadow-yellow-100",
    red: "group-hover:shadow-red-100",
  },
} as const;
