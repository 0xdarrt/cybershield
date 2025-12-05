import React from "react";
import { Shield, Users, Target, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-cyan-300 flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8" />
          About CyberShield
        </h1>

        <p className="text-gray-300 text-lg mb-6">
          CyberShield is an open cybersecurity learning & automation platform 
          designed to help users stay safe, informed, and prepared against 
          real-world security threats.
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Mission
            </h2>
            <p className="text-gray-400">
              Make cybersecurity education accessible, practical, and interactive.
            </p>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-5">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Target className="h-5 w-5 text-red-400" />
              What We Offer
            </h2>
            <ul className="list-disc pl-5 text-gray-400">
              <li>Real-time threat intelligence</li>
              <li>Breach detection</li>
              <li>Interactive learning modules</li>
              <li>Simulations for hacking & defense</li>
            </ul>
          </div>

        </div>

        <div className="bg-gray-900/60 border border-gray-700 rounded-xl p-5 mt-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Built By
          </h2>
          <p className="text-gray-400">
            CyberShield is developed by security enthusiasts to help spread 
            awareness and education about cyber threats, privacy, and digital 
            safety.
          </p>
        </div>

      </div>
    </div>
  );
}
