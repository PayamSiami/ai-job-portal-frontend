import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - Job Portal",
  description: "Sign in to your job portal account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
