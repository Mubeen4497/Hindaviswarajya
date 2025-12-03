import { Heart, MessageCircle, Share, PlusCircle, Trophy, Search } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function QuickGuide() {
  const features = [
    {
      icon: PlusCircle,
      title: "Share Your Seva",
      description: "Post about your community service activities and inspire others",
      color: "text-[#FF6F00]",
    },
    {
      icon: Heart,
      title: "Like & Support",
      description: "Show appreciation for others' seva by liking their posts",
      color: "text-red-500",
    },
    {
      icon: MessageCircle,
      title: "Engage & Discuss",
      description: "Comment on posts to share ideas and collaborate",
      color: "text-blue-500",
    },
    {
      icon: Trophy,
      title: "Earn Ranks",
      description: "Help more people to earn points and climb the leaderboard",
      color: "text-yellow-500",
    },
    {
      icon: Search,
      title: "Discover Seva",
      description: "Search and filter to find specific types of community service",
      color: "text-green-500",
    },
    {
      icon: Share,
      title: "Spread the Word",
      description: "Share inspiring posts to motivate others to serve",
      color: "text-purple-500",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          How it Works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#FF6F00]">
            Welcome to हिंदवी स्वराज्य
          </DialogTitle>
          <DialogDescription>
            Learn how to use the platform and make an impact in your community
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">What is Hindavi Swarajya?</h3>
            <p className="text-sm text-gray-600">
              A platform to share, celebrate, and inspire community service. Join thousands of sevaks 
              making a difference in their communities. Share your activities, track your impact, and 
              connect with like-minded individuals.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${feature.color} mt-1`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Rank System</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span>🙏 Sevak</span>
                <span className="text-gray-600">0 - 9 points</span>
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-2 rounded">
                <span>⚔️ Mavla</span>
                <span className="text-gray-600">10 - 99 points</span>
              </div>
              <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                <span>🗡️ Talveer</span>
                <span className="text-gray-600">100 - 249 points</span>
              </div>
              <div className="flex justify-between items-center bg-purple-50 p-2 rounded">
                <span>🛡️ Yoddha</span>
                <span className="text-gray-600">250 - 999 points</span>
              </div>
              <div className="flex justify-between items-center bg-indigo-50 p-2 rounded">
                <span>🏇 Shiledar</span>
                <span className="text-gray-600">1,000+ points</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF3E0] p-4 rounded-lg border border-[#FF6F00]/20">
            <h3 className="font-medium text-[#FF6F00] mb-2">Getting Started</h3>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Tap the + button to create your first seva post</li>
              <li>Describe your activity and how many people you helped</li>
              <li>Add a photo and relevant tags</li>
              <li>Share and inspire others in the community!</li>
              <li>Engage with others by liking and commenting</li>
            </ol>
          </div>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 italic">
              "गवार राज्यापेक्षा स्वराज्य बरे"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Self-rule is better than foreign rule
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}