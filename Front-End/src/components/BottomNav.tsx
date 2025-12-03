import { Home, PlusCircle, Trophy, User, AlertCircle, Users, Calendar, MoreHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainNavItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "help-request", icon: AlertCircle, label: "Help" },
    { id: "create", icon: PlusCircle, label: "Share Seva" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "more", icon: MoreHorizontal, label: "More" },
  ];

  const moreMenuItems = [
    { id: "events", icon: Calendar, label: "Events", description: "Browse & create events" },
    { id: "community", icon: Users, label: "Community", description: "Connect with helpers" },
  ];

  const handleNavClick = (id: string) => {
    if (id === "more") {
      setShowMoreMenu(!showMoreMenu);
    } else {
      onNavigate(id);
      setShowMoreMenu(false);
    }
  };

  const handleMoreItemClick = (id: string) => {
    onNavigate(id);
    setShowMoreMenu(false);
  };

  const isMoreActive = ["events", "community"].includes(currentScreen);

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMoreMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreMenu(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-w-2xl mx-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">More Options</h3>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                {moreMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMoreItemClick(item.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isActive
                          ? "bg-orange-50 border-2 border-orange-200"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl ${
                          isActive ? "bg-[#FF6F00] text-white" : "bg-white text-gray-600"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className={`font-semibold ${isActive ? "text-[#FF6F00]" : "text-gray-900"}`}>
                          {item.label}
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-[#FF6F00]" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Bottom spacing */}
              <div className="h-4" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around px-4 py-2 max-w-2xl mx-auto relative">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === "more" ? isMoreActive || showMoreMenu : currentScreen === item.id;
            const isShareSeva = item.id === "create";
            
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-1 rounded-lg transition-all relative ${
                  isShareSeva
                    ? "py-1 px-3 -mt-8"
                    : "py-2 px-4"
                } ${
                  isActive && !isShareSeva ? "text-[#FF6F00]" : !isShareSeva ? "text-gray-600" : ""
                }`}
              >
                {isShareSeva ? (
                  <>
                    {/* Elevated CTA Button */}
                    <motion.div
                      animate={{ 
                        scale: isActive ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity 
                      }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6F00] to-[#E65100] rounded-full blur-lg opacity-50" />
                      <div className="relative w-14 h-14 bg-gradient-to-br from-[#FF6F00] to-[#E65100] rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                    </motion.div>
                    <span className="text-xs font-semibold text-[#FF6F00] mt-1">{item.label}</span>
                  </>
                ) : (
                  <>
                    <Icon className={`w-6 h-6 ${isActive ? "fill-[#FF6F00]/10" : ""}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6F00] rounded-t-full"
                      />
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}