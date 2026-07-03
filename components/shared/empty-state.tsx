"use client";

import React from "react";
import { Search, Briefcase, FileText, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "search" | "briefcase" | "file" | "users" | "alert";
  actionText?: string;
  onAction?: () => void;
}

const iconMap = {
  search: Search,
  briefcase: Briefcase,
  file: FileText,
  users: Users,
  alert: AlertCircle,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = "search",
  actionText,
  onAction,
}) => {
  const Icon = iconMap[icon];

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};
