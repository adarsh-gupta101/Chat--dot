import React from 'react';
import { ArrowRight, Zap, BarChart3, Check } from 'lucide-react';
import Link from 'next/link';

const DemoUI = () => {
  return (
    <div className=" min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">See Chat-dot in Action</h1>
        <p className="text-gray-800 text-center mb-8">Experience the power of unified AI models</p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="bg-gray-800 rounded p-3 mb-3">
              <p className="text-gray-300">User: How would you explain quantum computing?</p>
            </div>

            <div className="bg-gray-800 rounded p-3 mb-3">
              <p className="text-blue-400 mb-2">ChatGPT: • • •</p>
              <p className="text-gray-300">Quantum computing harnesses quantum mechanics to process information...</p>
            </div>

            <div className="bg-gray-800 rounded p-3">
              <p className="text-purple-400 mb-2">Claude: • • •</p>
              <p className="text-gray-300">Let me break down quantum computing in simpler terms...</p>
            </div>

            <div className="bg-gray-800 rounded p-3 mt-4">
              <p className="text-green-400 mb-2">Gemini: • • •</p>
              <p className="text-gray-300">Quantum computing is a type of computing that uses quantum-mechanical phenomena...</p>
</div>
          </div>

          <div className="space-y-6 ">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Real-time Responses</h3>
                <p className="text-gray-500">Get instant answers from multiple AI models simultaneously</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Compare Responses</h3>
                <p className="text-gray-500">Easily compare answers from different AI models side by side</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Simple Interface</h3>
                <p className="text-gray-500">Clean and intuitive design for effortless interaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
            <Link href="/dashboard">
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2">
            Try Demo Now <ArrowRight className="w-5 h-5" />
          </button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default DemoUI;