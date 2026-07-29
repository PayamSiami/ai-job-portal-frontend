import { CheckCircle, ClockIcon, Eye, Filter, MessageCircle, XCircle } from "lucide-react";

export const STATUS_FILTERS = [
  { value: "all", label: "همه", icon: Filter, color: "text-gray-600" },
  {
    value: "pending",
    label: "درحال بررسی",
    icon: ClockIcon,
    color: "text-amber-600",
  },
  {
    value: "reviewing",
    label: "در حال بررسی",
    icon: Eye,
    color: "text-blue-600",
  },
  {
    value: "interview",
    label: "مصاحبه",
    icon: MessageCircle,
    color: "text-purple-600",
  },
  {
    value: "accepted",
    label: "پذیرفته شده",
    icon: CheckCircle,
    color: "text-emerald-600",
  },
  { value: "rejected", label: "رد شده", icon: XCircle, color: "text-rose-600" },
];
