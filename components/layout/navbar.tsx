"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Briefcase,
  Heart,
  User,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  FileText,
  LayoutDashboard,
  FileCheck,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

const baseNavItems = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/jobs", label: "مشاغل", icon: Briefcase },
];

const protectedNavItems = [
  { href: "/saved-jobs", label: "ذخیره شده", icon: Heart },
  { href: "/resumes", label: "رزومه‌ها", icon: FileText },
  { href: "/applications", label: "درخواست‌ها", icon: FileCheck },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = user ? [...baseNavItems, ...protectedNavItems] : baseNavItems;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setIsMenuOpen(false);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b bg-background/90 backdrop-blur-md shadow-xs"
          : "border-b/50 bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 flex h-18 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
          onClick={handleLinkClick}
        >
          <div className="relative flex h-10 w-10 items-center justify-center">
            <Image src="/logo.svg" alt="JobMatch Logo" className="h-auto w-auto" width={20} height={20} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xl font-black tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              جاب مچ
            </span>
            <span className="text-[10px] font-medium text-muted-foreground leading-none hidden sm:block">
              پیدا کردن شغل رویایی
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-full border border-border/40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-blue-600 dark:text-blue-400")} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 rounded-full bg-background shadow-xs border border-border/50 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <Link href="/search" className="lg:hidden" onClick={handleLinkClick}>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {/* Theme Toggle */}
          <div className="rounded-full overflow-hidden">
            <ThemeToggle />
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full hover:bg-muted"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-border/80">
                  <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <h4 className="text-sm font-bold">اعلان‌ها</h4>
                    <Button variant="ghost" size="sm" className="text-xs text-blue-600 h-auto px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                      مشاهده همه
                    </Button>
                  </div>
                  <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/55 transition-colors cursor-pointer">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          شغل جدید: توسعه‌دهنده React
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">۲ ساعت پیش</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/55 transition-colors cursor-pointer">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <FileCheck className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          درخواست شما بررسی شد
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">۵ ساعت پیش</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Avatar className="h-10 w-10 border-2 border-border/60 hover:border-blue-500 transition-colors">
                      <AvatarImage src="/avatars/default.png" alt={user.fullName || "User"} loading="lazy" decoding="async" />
                      <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-xl border-border/80" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-3 rounded-xl bg-muted/30 mb-1">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/avatars/default.png" alt={user.fullName || "User"} loading="lazy" decoding="async" />
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                          {user.fullName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5 min-w-0 text-right">
                        <p className="text-sm font-bold text-foreground truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                    <Link href="/dashboard" className="flex items-center gap-3">
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      <span>داشبورد</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                    <Link href="/profile" className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>پروفایل</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                    <Link href="/settings" className="flex items-center gap-3">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>تنظیمات</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-xl cursor-pointer py-2.5 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 flex items-center gap-3"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>خروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full px-5 font-medium">
                  ورود
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all">
                  ثبت‌نام
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-full"
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t bg-background/95 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-4 py-5 space-y-4">
              {/* Mobile Search Bar */}
              <div className="sm:hidden">
                <Link href="/search" onClick={handleLinkClick}>
                  <Button variant="outline" className="w-full justify-start gap-3 h-11 rounded-xl bg-muted/40 border-border/60 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <span>جستجوی مشاغل...</span>
                  </Button>
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-border/60 pt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/40">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src="/avatars/default.png" alt={user.fullName || "User"} loading="lazy" decoding="async" />
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                          {user.fullName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-sm font-bold text-foreground truncate">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        handleLinkClick();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>خروج از حساب</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={handleLinkClick}>
                      <Button variant="outline" className="w-full h-11 rounded-xl">
                        ورود
                      </Button>
                    </Link>
                    <Link href="/register" onClick={handleLinkClick}>
                      <Button className="w-full h-11 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                        ثبت‌نام
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};