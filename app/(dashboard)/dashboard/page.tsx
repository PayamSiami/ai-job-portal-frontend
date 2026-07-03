"use client";

import React from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  FileText,
  Bell,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "12", change: "+2" },
    { icon: Users, label: "Applications", value: "34", change: "+5" },
    { icon: FileText, label: "Resumes", value: "3", change: "+1" },
    { icon: Bell, label: "Notifications", value: "7", change: "New" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.fullName || "User"}! 👋
        </h1>
        <p className="text-blue-100 mt-2">
          Here&apos;s what&apos;s happening with your job search today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-green-600">
                    {stat.change} from last week
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Senior React Developer
                    </p>
                    <p className="text-sm text-gray-600">TechCorp Inc.</p>
                  </div>
                  <span className="text-sm text-green-600">
                    Applied 2 days ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Frontend Developer
                    </p>
                    <p className="text-sm text-gray-600">Google</p>
                  </div>
                  <span className="text-sm text-blue-600">
                    Tomorrow, 2:00 PM
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
