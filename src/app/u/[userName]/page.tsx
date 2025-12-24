"use client";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send, UserCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/apiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { Textarea } from "@/components/ui/textarea";

const PublicProfilePage = () => {
  const params = useParams<{ userName: string }>();
  const userName = params.userName;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        userName,
        ...data,
      });
      toast({
        title: "Message Sent!",
        description: response.data.message,
        variant: "default",
      });
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-blue-950 py-12 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Header Card */}
        <Card className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-gray-700/50 mb-8 animate-fade-in-up">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-linear-to-br from-blue-500 to-purple-500 p-4 rounded-2xl">
                <UserCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                  @{userName}
                </h1>
                <p className="text-gray-400">Send me an anonymous message</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Form Card */}
        <Card className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-gray-700/50 mb-8 animate-fade-in-up delay-100">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-white font-semibold mb-3 block">
                        Your Anonymous Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your honest thoughts here... Your identity will remain completely anonymous."
                          className="resize-none min-h-[200px] bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-base"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center mt-2">
                        <FormMessage className="text-red-400" />
                        <span className="text-xs text-gray-500">
                          {messageContent?.length || 0} characters
                        </span>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !messageContent}
                    className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Anonymous Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="bg-linear-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-blue-500/20 animate-fade-in-up delay-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Want your own message board?
            </h3>
            <p className="text-gray-400 mb-4">
              Create your free account and start receiving anonymous feedback
            </p>
            <Link href="/sign-up">
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-8 text-center animate-fade-in-up delay-300">
          <p className="text-gray-500 text-sm">
            🔒 Your message is completely anonymous. The recipient will never know who sent it.
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
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default PublicProfilePage;