import { Home, HeartHandshake, Plus, Users, User } from "lucide-react";

export type TabType = "home" | "help" | "post" | "community" | "profile";

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "home" as TabType, icon: Home, label: "Home" },
  { id: "help" as TabType, icon: HeartHandshake, label: "Help" },
  { id: "post" as TabType, icon: Plus, label: "Post" },
  { id: "community" as TabType, icon: Users, label: "Community" },
  { id: "profile" as TabType, icon: User, label: "Profile" },
];

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isPost = tab.id === "post";
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center p-2 rounded-lg transition-all duration-200
                ${isPost 
                  ? "bg-[#FF6F00] text-white scale-110 shadow-lg" 
                  : isActive 
                    ? "text-[#FF6F00]" 
                    : "text-gray-500"
                }
                ${!isPost && "hover:bg-gray-100"}
              `}
            >
              <Icon 
                className={`
                  ${isPost ? "w-6 h-6" : "w-5 h-5"} 
                  mb-1
                  ${isActive && !isPost ? "fill-current" : ""}
                `} 
              />
              <span className={`text-xs ${isPost ? "font-medium" : ""}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}