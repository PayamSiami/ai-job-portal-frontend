"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/use-auth";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import toast from "react-hot-toast";

const registerSchema = z.object({
  username: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["job-seeker", "employer"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser, loginWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "job-seeker",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("حساب کاربری با موفقیت ایجاد شد!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ثبت نام با شکست مواجه شد",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async (credential: string) => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle(credential);
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ثبت نام با گوگل ناموفق بود");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-bold">
          ایجاد حساب کاربری
        </CardTitle>
        <CardDescription className="text-center">
          برای دسترسی به تمام امکانات جاب مچ، ثبت نام کنید
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Google Register Button */}
        <CardContent className="space-y-4">
          <GoogleLoginButton
            onSuccess={handleGoogleRegister}
            disabled={isLoading || googleLoading}
          />

          {/* Divider */}
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              یا با ایمیل ثبت نام کنید
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">نام کامل</label>
            <Input
              placeholder="مثال: علی محمدی"
              {...register("username")}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ایمیل</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`${errors.email ? "border-red-500" : ""} pl-10`}
                dir="ltr"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2 mb-2">
            <label className="text-sm font-medium">رمز عبور</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading || googleLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                در حال ایجاد حساب...
              </>
            ) : (
              "ثبت نام"
            )}
          </Button>

          <div className="text-sm text-center text-gray-600">
            قبلاً ثبت نام کرده‌اید؟{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              ورود
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
