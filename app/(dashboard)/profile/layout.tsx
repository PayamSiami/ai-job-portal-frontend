import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - JobAI',
  description: 'Manage your profile and preferences',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}