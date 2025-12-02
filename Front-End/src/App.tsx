import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import SplashScreen from "./components/SplashScreen";
import BottomNavigation, { TabType } from "./components/BottomNavigation";
import SidebarNavigation from "./components/SidebarNavigation";
import HomeScreen from "./components/HomeScreen";
import HelpRequests from "./components/HelpRequests";
import PostCreation from "./components/PostCreation";
import Community from "./components/Community";
import Profile from "./components/Profile";
import { useScreenSize } from "./components/ui/use-screen-size";
import { AppProvider } from "./components/AppContext";

declare module "react/jsx-runtime";
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const { isDesktop, isMobile } = useScreenSize();

  useEffect(() => {
    // Auto-hide splash screen after 3.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "help":
        return <HelpRequests />;
      case "post":
        return <PostCreation />;
      case "community":
        return <Community />;
      case "profile":
        return <Profile />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* Main Application */}
      {!showSplash && (
        <div className="flex h-screen">
          {/* Desktop Sidebar Navigation */}
          {isDesktop && (
            <SidebarNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
            />
          )}

          {/* Main Content Area */}
          <div className={`flex-1 ${isDesktop ? 'ml-80' : ''} overflow-auto`}>
            <main className={`min-h-screen ${isDesktop ? 'h-screen' : ''}`}>
              {renderActiveScreen()}
            </main>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
              <BottomNavigation 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
            border: '1px solid #FF6F00',
          },
        }}
      />
    </AppProvider>
  );
}