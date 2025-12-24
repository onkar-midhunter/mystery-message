"use client";
import { User } from "next-auth";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCard } from "@/components/MessageCard";
import { Loader2, RefreshCcw, Copy, Link2, Mail, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { SkeletonCard } from "@/components/loading_skelton";
import { HomeSkelton } from "@/components/HomeSkelton";

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessage");

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg._id !== messageId));
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessage", response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setMessages([]);
      try {
        const response = await axios.get<ApiResponse>("/api/get-message");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error in fetchMessages",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessage", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error in switch",
        description:
          axiosError.response?.data.message ??
          "Failed to update switch setting",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-blue-950">
        <HomeSkelton/>
      </div>
    );
  }

  const { userName } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${userName}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-blue-950 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-blue-400 mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-400">Manage your anonymous feedback messages</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-in-up delay-100">
          <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Messages</p>
                <p className="text-3xl font-bold text-white">{messages.length}</p>
              </div>
              <Mail className="w-10 h-10 text-blue-400" />
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Profile Views</p>
                <p className="text-3xl font-bold text-white">--</p>
              </div>
              <Link2 className="w-10 h-10 text-purple-400" />
            </div>
          </div>

          <div className="bg-linear-to-br from-green-500/10 to-green-600/10 backdrop-blur-md border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-xl font-semibold text-white flex items-center gap-2">
                  {acceptMessages ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                      Paused
                    </>
                  )}
                </p>
              </div>
              {acceptMessages ? <ToggleRight className="w-10 h-10 text-green-400" /> : <ToggleLeft className="w-10 h-10 text-gray-400" />}
            </div>
          </div>
        </div>

        {/* Profile Link Card */}
        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 mb-6 animate-fade-in-up delay-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-blue-400" />
                Your Unique Link
              </h2>
              <p className="text-gray-400 text-sm">Share this link to receive anonymous messages</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-300 font-mono text-sm overflow-x-auto">
              {profileUrl}
            </div>
            <Button 
              onClick={copyToClipboard}
              className="bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>

        {/* Message Settings Card */}
        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 mb-6 animate-fade-in-up delay-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Accept Messages</h3>
              <p className="text-gray-400 text-sm">
                {acceptMessages 
                  ? "You're currently accepting anonymous messages" 
                  : "Message receiving is paused"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${acceptMessages ? 'text-green-400' : 'text-gray-500'}`}>
                {acceptMessages ? 'On' : 'Off'}
              </span>
              <Switch
                {...register("acceptMessage")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-gray-800" />

        {/* Messages Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up delay-400">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-400" />
            Your Messages
            {messages.length > 0 && (
              <span className="text-sm font-normal text-gray-400">
                ({messages.length})
              </span>
            )}
          </h2>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={isLoading}
            className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-white transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-500">
          {isLoading ? (
            <SkeletonCard />
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-gray-800/30 rounded-full p-6 mb-4">
                <Mail className="w-16 h-16 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No messages yet</h3>
              <p className="text-gray-500 text-center max-w-md">
                Share your profile link to start receiving anonymous feedback messages!
              </p>
            </div>
          )}
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
        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;