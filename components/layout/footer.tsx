'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">JobAI</span>
            </Link>
            <p className="text-sm text-gray-600 max-w-sm">
              Find your dream job with AI-powered search. Connect with top companies and take your career to the next level.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/jobs" className="hover:text-blue-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/resumes" className="hover:text-blue-600 transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-blue-600 transition-colors">
                  AI Search
                </Link>
              </li>
              <li>
                <Link href="/saved-jobs" className="hover:text-blue-600 transition-colors">
                  Saved Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/employer/dashboard" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/employer/jobs/create" className="hover:text-blue-600 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/employer/applications" className="hover:text-blue-600 transition-colors">
                  Review Applications
                </Link>
              </li>
              <li>
                <Link href="/employer/company" className="hover:text-blue-600 transition-colors">
                  Company Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>&copy; 2026 JobAI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-blue-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};