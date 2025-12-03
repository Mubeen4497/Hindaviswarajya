import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { AppProvider, useApp } from "./components/AppContext";
import { Toaster } from "./components/ui/sonner";
import { useScreenSize } from "./components/ui/use-screen-size";
import HomeScreen from "./components/HomeScreen";
import CreatePostScreen from "./components/CreatePostScreen";
import CreateEventScreen from "./components/CreateEventScreen";
import EventsScreen from "./components/EventsScreen";
import EnhancedProfileScreen from "./components/EnhancedProfileScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import HelpRequestScreen from "./components/HelpRequestScreen";
import CommunityScreen from "./components/CommunityScreen";
import BottomNav from "./components/BottomNav";
import SideNav from "./components/SideNav";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import RankCelebration from "./components/RankCelebration";
import { RankInfo } from "./components/AppContext";

function AppContent() {
  const { state, login, signup } = useApp();
  const [currentScreen, setCurrentScreen] = useState("home");
  const [showSplash, setShowSplash] = useState(true);
  const [authScreen, setAuthScreen] = useState<"login" | "signup">("login");
  const [showRankCelebration, setShowRankCelebration] = useState(false);
  const [celebrationRank, setCelebrationRank] = useState<RankInfo | null>(null);
  const { isMobile, isDesktop } = useScreenSize();

  useEffect(() => {
    // Auto-hide splash after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleLogin = (email: string, password: string) => {
    const success = login(email, password);
    if (success) {
      setShowSplash(false);
    }
  };

  const handleSignup = (userData: { name: string; email: string; password: string; location: string }) => {
    const success = signup(userData);
    if (success) {
      setShowSplash(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={handleNavigate} />;
      case "create":
        return <CreatePostScreen onBack={() => setCurrentScreen("home")} />;
      case "create-event":
        return <CreateEventScreen onBack={() => setCurrentScreen("home")} />;
      case "help-request":
        return <HelpRequestScreen onBack={() => setCurrentScreen("home")} />;
      case "community":
        return <CommunityScreen onBack={() => setCurrentScreen("home")} />;
      case "leaderboard":
        return <LeaderboardScreen onBack={() => setCurrentScreen("home")} />;
      case "profile":
        return <EnhancedProfileScreen onBack={() => setCurrentScreen("home")} />;
      case "events":
        return <EventsScreen onBack={() => setCurrentScreen("home")} onCreateEvent={() => setCurrentScreen("create-event")} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  // Show authentication screens if not authenticated
  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {authScreen === "login" ? (
          <LoginScreen
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthScreen("signup")}
          />
        ) : (
          <SignupScreen
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthScreen("login")}
          />
        )}
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <>
          {isDesktop ? (
            <SideNav currentScreen={currentScreen} onNavigate={handleNavigate}>
              {renderScreen()}
            </SideNav>
          ) : (
            <>
              {renderScreen()}
              <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
            </>
          )}
        </>
      )}
      <Toaster position="top-center" richColors />
      {showRankCelebration && celebrationRank && (
        <RankCelebration
          rankInfo={celebrationRank}
          onClose={() => setShowRankCelebration(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}