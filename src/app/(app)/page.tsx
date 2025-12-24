"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/message.json';
import { Mail, MessageSquare, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-linear-to-br from-gray-950 via-gray-900 to-blue-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="text-center mb-16 md:mb-20 z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-300">100% Anonymous & Secure</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-blue-300 animate-fade-in-up">
          Dive into the World of
          <br />
          <span className="text-blue-400">Anonymous Feedback</span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-200">
          True Feedback - Where your identity remains secret. Share honest thoughts, 
          receive genuine feedback, all while staying completely anonymous.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in-up delay-300">
          <Link href="/sign-up">
            <Button size="lg" className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 px-8">
              Get Started Free
              <MessageSquare className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white transition-all duration-300 hover:scale-105 px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl z-10 animate-fade-in-up delay-400">
        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">100% Anonymous</h3>
          <p className="text-gray-400 text-sm">Your identity is completely protected. Send and receive messages without revealing who you are.</p>
        </div>

        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Honest Feedback</h3>
          <p className="text-gray-400 text-sm">Get real, unfiltered opinions. People share more when they can do it anonymously.</p>
        </div>

        <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div className="bg-green-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
          <p className="text-gray-400 text-sm">Share your unique link and start receiving anonymous messages instantly.</p>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="w-full max-w-2xl z-10 animate-fade-in-up delay-500">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          What People Are Saying
        </h2>
        <Carousel 
          plugins={[Autoplay({delay:3000})]}
          className="w-full"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-3">
                    <p className="text-gray-300 leading-relaxed">{message.content}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {message.received}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-gray-800/50 border-gray-700 hover:bg-gray-700" />
          <CarouselNext className="bg-gray-800/50 border-gray-700 hover:bg-gray-700" />
        </Carousel>
      </section>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
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
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
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
    </main>
  )
}

export default Home