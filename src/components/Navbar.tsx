'use client'
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { LogOut, User as UserIcon, MessageSquare } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
                                                
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-400">
              True Feedback
            </span>
          </Link>

          {/* User Section */}
          {session ? (
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700/50">
                <div className="bg-linear-to-br from-blue-500 to-purple-500 p-1.5 rounded-full">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300 font-medium">
                  {user?.userName || user?.email}
                </span>
              </div>

              {/* Logout Button */}
              <Button 
                onClick={() => signOut()} 
                className="bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-105"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-up">
                <Button 
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
                  size="sm"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button 
                  className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                  size="sm"
                >
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;