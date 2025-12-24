"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
        setIsSubmitting(false);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-blue-950 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-blue-400 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">Sign in to continue your secret conversations</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email / Username</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input 
                        {...field}
                        className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter your email or username"
                      />
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <Input 
                        type="password" 
                        {...field}
                        className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter your password"
                      />
                    </div>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02]" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors inline-flex items-center gap-1"
              >
                Forgot password?
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800/50 px-2 text-gray-500">Or</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Not a member yet?{" "}
                <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
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
}