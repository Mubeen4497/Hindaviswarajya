import { Home, PlusCircle, Trophy, User, LogOut, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { useApp } from "./AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import NotificationBell from "./NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DesktopNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function DesktopNav({ currentScreen, onNavigate }: DesktopNavProps) {
  const { state, logout } = useApp();
  const { currentUser } = state;
  
  if (!currentUser) return null;

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "create", icon: PlusCircle, label: "Create Post" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6F00] to-[#F57C00] rounded-full flex items-center justify-center">
              <span className="text-white text-xl">ह</span>
            </div>
            <div>
              <h1 className="text-xl text-[#FF6F00]">हिंदवी स्वराज्य</h1>
              <p className="text-xs text-gray-600">Hindavi Swarajya</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onNavigate(item.id)}
                  className={isActive ? "bg-[#FF6F00] hover:bg-[#E65100] text-white" : ""}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <ImageWithFallback
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm">{currentUser.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate("profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
