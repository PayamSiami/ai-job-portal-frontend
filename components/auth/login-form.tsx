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

const loginSchema = z.object({
  email: z.string().email("لطفاً یک آدرس ایمیل معتبر وارد کنید"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login({ email: data.email, password: data.password });
      toast.success("خوش آمدید!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ورود با شکست مواجه شد");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle(credential);
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ورود با گوگل ناموفق بود");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg" >
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center font-bold">
          خوش آمدید
        </CardTitle>
        <CardDescription className="text-center">
          برای ادامه، وارد حساب کاربری خود شوید
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Google Login Button */}
        <CardContent className="space-y-4 mb-2">
          <GoogleLoginButton
            onSuccess={handleGoogleLogin}
            disabled={isLoading || googleLoading}
          />

          {/* Divider */}
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              یا با ایمیل وارد شوید
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ایمیل</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={`${errors.email ? "border-red-500" : ""} pl-10`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">رمز عبور</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-red-500 pl-10" : "pl-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال ورود...
              </>
            ) : (
              "ورود"
            )}
          </Button>

          <div className="text-sm text-center text-gray-600">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              ثبت نام کنید
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};