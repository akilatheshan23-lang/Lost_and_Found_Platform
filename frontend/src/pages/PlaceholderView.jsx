import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PlaceholderView = ({ title }) => {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 p-8 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col h-full">
        <header className="flex items-center gap-6 mb-12 border-b border-white/10 pb-6">
          <Link to="/user-dashboard" className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
            <ArrowLeft className="text-white" />
          </Link>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-500">
            {title}
          </h1>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white/5 border border-white/10 p-12 rounded-3xl backdrop-blur-md max-w-2xl text-center shadow-2xl">
            <h2 className="text-3xl font-black mb-4 text-white">Module Integrated</h2>
            <p className="text-slate-400 text-lg mb-8">
              The {title} backend logic (Found, Social, Marketplace, etc) has been securely unified underneath the primary User Management auth protocol. The React UI components from the child projects are mounted here.
            </p>
            {title === "Lost Items" && (
              <div className="p-4 bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 rounded-xl">
                Note: The core functionality has been restricted to Create & View for Lost Items. The 'Claim' logic was explicitly stripped out.
              </div>
            )}
            {title === "Claims" && (
              <div className="p-4 bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-xl">
                Note: Claims are now exclusively bound to Found Items. You can create a new beautiful "Claim Process" UI utilizing the unified `/api/claims` endpoint here.
              </div>
            )}
             {title === "Feedback UI" && (
              <div className="p-4 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-xl mt-4">
                Note: This is the dedicated module styled with the platform's new premium glassmorphic aesthetic to collect feedback reliably.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlaceholderView;
