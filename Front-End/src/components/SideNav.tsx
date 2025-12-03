import { Home, HeartHandshake, Plus, Users, User, TrendingUp, AlertCircle, MessageCircle, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { ReactNode } from "react";

interface SideNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  children: ReactNode;
}

const tabs = [
  { id: "home", icon: Home, label: "Home", description: "Latest seva activities" },
  { id: "events", icon: Calendar, label: "Events", description: "Join seva events" },
  { id: "create", icon: Plus, label: "Share Seva", description: "Post your service" },
  { id: "help-request", icon: AlertCircle, label: "Help Requests", description: "Find or offer help" },
  { id: "community", icon: Users, label: "Community", description: "Connect with sevaks" },
  { id: "leaderboard", icon: TrendingUp, label: "Leaderboard", description: "Top contributors" },
  { id: "profile", icon: User, label: "Profile", description: "Your seva journey" },
];

export default function SideNav({ currentScreen, onNavigate, children }: SideNavProps) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div>
              <img 
                src="src/components/1.png"
                style={{width:"180px"}}
                alt="Hindavi Swarajya Logo"
              />
              <p className="text-sm opacity-90 leading-relaxed mt-2">
                "महाराजांचे स्वप्न, आमचे कर्तव्य"
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;
            const isCreate = tab.id === "create";
            
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`
                  w-full p-4 rounded-xl transition-all duration-200 text-left
                  ${isCreate 
                    ? "bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white shadow-lg hover:shadow-xl" 
                    : isActive 
                      ? "bg-[#FFF3E0] text-[#FF6F00] border border-[#FF6F00]/20" 
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive && !isCreate ? "text-[#FF6F00]" : ""}`} />
                  <div>
                    <p className={`font-medium ${isCreate ? "text-white" : isActive ? "text-[#FF6F00]" : "text-gray-900"}`}>
                      {tab.label}
                    </p>
                    <p className={`text-xs ${isCreate ? "text-orange-100" : isActive ? "text-[#FF6F00]/70" : "text-gray-500"}`}>
                      {tab.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stats Card */}
        <div className="p-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Community Impact</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-blue-700">Total Seva Acts</span>
                <span className="font-medium text-blue-800">1,247</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-700">People Helped</span>
                <span className="font-medium text-blue-800">15,632</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-700">Active Sevaks</span>
                <span className="font-medium text-blue-800">2,847</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Daily Quote */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-[#FF6F00] font-medium mb-1">
              "स्वराज्य हा माझा जन्मसिद्ध हक्क आहे"
            </p>
            <p className="text-xs text-gray-500">
              Daily inspiration from Maharaj
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-80 flex-1">
        {children}
      </div>
    </div>
  );
}