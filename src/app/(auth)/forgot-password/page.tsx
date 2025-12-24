'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const res = await axios.patch<ApiResponse>('/api/forgot-password', { userName });
      toast({
        title: "Success",
        description: "OTP sent to your email successfully"
      });
      router.push(`/reset/${userName}`);
    } catch (error) {
      console.error("error in forgot password", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-blue-950 flex flex-col justify-center items-center px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4">
              <KeyRound className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-400 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-400">
              Enter your username to receive a reset code
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your username"
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all h-12"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <Button
              onClick={handleForgotPassword}
              disabled={loading || !userName}
              className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  Send Reset Code
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Remember your password?{" "}
              <a href="/sign-in" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4">
          <p className="text-sm text-blue-300 text-center">
            💡 You'll receive a 6-digit code via email to reset your password
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;