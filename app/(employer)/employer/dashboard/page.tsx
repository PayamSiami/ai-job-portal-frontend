// "use client";
// import type { Metadata } from 'next';

// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Briefcase, Users, FileText, TrendingUp, Sparkles } from "lucide-react";
// import AIScreeningDashboard from "@/components/employer/ai-screening-dashboard";

// export const metadata: Metadata = {
//   title: 'داشبورد کارفرما | جاب‌آی',
//   description: 'مدیریت آگهی‌های استخدام، بررسی درخواست‌ها و پایش آمار استخدام با هوش مصنوعی',
//   robots: {
//     index: false,
//     follow: false,
//   },
// };

// export default function EmployerDashboardPage() {
//   const stats = [
//     { icon: Briefcase, label: "Active Jobs", value: "8", change: "+3" },
//     { icon: Users, label: "Total Applicants", value: "156", change: "+12" },
//     { icon: FileText, label: "Pending Reviews", value: "23", change: "+5" },
//     { icon: TrendingUp, label: "Hiring Rate", value: "67%", change: "+8%" },
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Welcome Section */}
//       <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
//         <div className="flex items-center gap-3">
//           <Sparkles className="w-8 h-8" />
//           <div>
//             <h1 className="text-3xl font-bold">Employer Dashboard</h1>
//             <p className="text-purple-100 mt-1">
//               Manage your job postings and applications with AI-powered insights
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <Card key={stat.label}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">{stat.label}</p>
//                     <p className="text-2xl font-bold text-gray-900">
//                       {stat.value}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-purple-50 rounded-full">
//                     <Icon className="w-6 h-6 text-purple-600" />
//                   </div>
//                 </div>
//                 <div className="mt-2">
//                   <span className="text-sm text-green-600">
//                     {stat.change} from last week
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* AI Screening Dashboard */}
//       <AIScreeningDashboard />
//     </div>
//   );
// }