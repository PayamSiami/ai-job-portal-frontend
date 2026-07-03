import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register - Job Portal",
  description: "Create your job portal account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}
