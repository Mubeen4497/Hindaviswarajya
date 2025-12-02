import { Home, HeartHandshake, Plus, Users, User, TrendingUp } from "lucide-react";
import { TabType } from "./BottomNavigation";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SidebarNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "home" as TabType, icon: Home, label: "Home", description: "Latest seva activities" },
  { id: "help" as TabType, icon: HeartHandshake, label: "Help Requests", description: "Find ways to serve" },
  { id: "post" as TabType, icon: Plus, label: "Share Seva", description: "Post your service" },
  { id: "community" as TabType, icon: Users, label: "Community", description: "Maharaj's teachings" },
  { id: "profile" as TabType, icon: User, label: "Profile", description: "Your seva journey" },
];

export default function SidebarNavigation({ activeTab, onTabChange }: SidebarNavigationProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Header */}
      <div className="px-6  border-b border-gray-200">
        <div className="flex items-center gap-3 ">
          {/* logo removed */}
          <div>
<img 
  src="src/components/1.png"
  style={{width:"180px"}}
  alt="Hindavi Swarajya Logo"

/>
 <p className="text-lg opacity-90 max-w-md mx-auto leading-relaxed">
            "महाराजांचे स्वप्न, आमचे कर्तव्य"
          </p>

          </div>
        </div>
      
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isPost = tab.id === "post";
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full p-4 rounded-xl transition-all duration-200 text-left
                ${isPost 
                  ? "bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white shadow-lg hover:shadow-xl" 
                  : isActive 
                    ? "bg-[#FFF3E0] text-[#FF6F00] border border-[#FF6F00]/20" 
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-center gap-3 bg-[rgba(251,69,69,0)]">
                <Icon className={`w-5 h-5 ${isActive && !isPost ? "text-[#FF6F00]" : ""}`} />
                <div>
                  <p className={`font-medium ${isPost ? "text-white" : isActive ? "text-[#FF6F00]" : "text-gray-900"}`}>
                    {tab.label}
                  </p>
                  <p className={`text-xs ${isPost ? "text-orange-100" : isActive ? "text-[#FF6F00]/70" : "text-gray-500"}`}>
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
  );
}