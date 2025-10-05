import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to login by default
  // In a real implementation, check auth state server-side
  redirect('/login');
}
