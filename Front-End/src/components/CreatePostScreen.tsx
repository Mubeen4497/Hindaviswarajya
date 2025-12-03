import { useState } from "react";
import { Camera, MapPin, Tag, Users, X, ImagePlus, MapIcon, Clock, Zap, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Progress } from "./ui/progress";
import { useApp } from "./AppContext";
import { useScreenSize } from "./ui/use-screen-size";
import { toast } from "sonner@2.0.3";

// Create Post Screen Component

const categories = ["Food", "Education", "Health", "Shelter", "Other"] as const;
type Category = typeof categories[number];

interface FormData {
  content: string;
  category: Category | "";
  location: string;
  peopleHelped: string;
  tags: string[];
  image?: string;
  timeSpent: string;
  resources: string;
  impact: string;
  visibility: "public" | "community" | "private";
  allowComments: boolean;
  enableNotifications: boolean;
}

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1562709911-a355229de124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjb21tdW5pdHklMjBzZXJ2aWNlJTIwaGVscGluZ3xlbnwxfHx8fDE3NTU5MzczMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1710092784814-4a6f158913b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGlzdHJpYnV0aW9uJTIwY2hhcml0eSUyMGNvbW11bml0eXxlbnwxfHx8fDE3NTU5MzczMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1643429096345-9de0d2ab7e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBoZWxwaW5nJTIwY2hpbGRyZW58ZW58MXx8fHwxNzU1OTM3MzIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2FyZSUyMGhlYWx0aHxlbnwxfHx8fDE3NTU5MzczMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzaW5nJTIwc2hlbHRlciUyMGhlbHB8ZW58MXx8fHwxNzU1OTM3MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080"
];

const categoryEmojis = {
  Food: "🍽️",
  Education: "📚",
  Health: "🏥",
  Shelter: "🏠",
  Other: "🤝"
};

const suggestedTags = {
  Food: ["meal-distribution", "hunger-relief", "community-kitchen", "food-donation"],
  Education: ["tutoring", "books", "school-support", "literacy"],
  Health: ["medical-camp", "health-checkup", "medicine", "awareness"],
  Shelter: ["housing", "emergency-shelter", "rehabilitation", "construction"],
  Other: ["community-service", "social-work", "volunteer", "help"]
};

const maharajQuotes = [
  "स्वराज्य हा माझा जन्मसिद्ध हक्क आहे आणि तो मी मिळवीनच",
  "जो वाढविल धर्म सकळांचा सो वाढविल राज्य आपणासि",
  "गवार राज्यापेक्षा स्वराज्य बरे",
  "राजा प्रजाहित चिंतक असावा"
];

export default function PostCreation() {
  const { state, addPost } = useApp();
  const { currentUser } = state;
  const { isDesktop, isMobile } = useScreenSize();
  
  const [formData, setFormData] = useState<FormData>({
    content: "",
    category: "",
    location: currentUser.location,
    peopleHelped: "",
    tags: [],
    image: undefined,
    timeSpent: "",
    resources: "",
    impact: "",
    visibility: "public",
    allowComments: true,
    enableNotifications: true
  });
  
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [completionScore, setCompletionScore] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate completion score
  useState(() => {
    let score = 0;
    if (formData.content.trim()) score += 20;
    if (formData.category) score += 15;
    if (formData.location.trim()) score += 10;
    if (formData.peopleHelped) score += 15;
    if (formData.image) score += 15;
    if (formData.tags.length > 0) score += 10;
    if (formData.timeSpent) score += 5;
    if (formData.resources) score += 5;
    if (formData.impact) score += 5;
    setCompletionScore(score);
  });

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.content.trim()) {
      newErrors.content = "Please describe your seva activity";
    } else if (formData.content.length < 10) {
      newErrors.content = "Please provide more details (at least 10 characters)";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Please enter the location";
    }

    if (!formData.peopleHelped || parseInt(formData.peopleHelped) < 1) {
      newErrors.peopleHelped = "Please enter a valid number of people helped";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      const sevaPoints = parseInt(formData.peopleHelped) * 10;
      
      addPost({
        userId: currentUser.id,
        user: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          rank: currentUser.currentRank,
          location: currentUser.location
        },
        content: formData.content,
        category: formData.category as any,
        image: formData.image,
        helpedPeople: parseInt(formData.peopleHelped),
        tags: formData.tags
      });

      // Show celebration toast
      toast.success(`🎉 Seva shared! You earned ${sevaPoints} seva points!`, {
        duration: 4000
      });

      // Reset form
      setFormData({
        content: "",
        category: "",
        location: currentUser.location,
        peopleHelped: "",
        tags: [],
        image: undefined,
        timeSpent: "",
        resources: "",
        impact: "",
        visibility: "public",
        allowComments: true,
        enableNotifications: true
      });
      setErrors({});
      setCurrentStep(1);

    } catch (error) {
      toast.error("Failed to share seva post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (tag?: string) => {
    const tagToAdd = tag || newTag.trim();
    if (tagToAdd && !formData.tags.includes(tagToAdd) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagToAdd] }));
      setNewTag("");
    } else if (formData.tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  const handleImageSelect = () => {
    const randomImage = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
    setFormData(prev => ({ ...prev, image: randomImage }));
    toast.success("Image selected!");
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding
          const locations = ["Mumbai, Maharashtra", "Pune, Maharashtra", "Nashik, Maharashtra", "Kolhapur, Maharashtra"];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          setFormData(prev => ({ ...prev, location: randomLocation }));
          toast.success("Location detected!");
        },
        () => {
          toast.error("Could not detect location");
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const randomQuote = maharajQuotes[Math.floor(Math.random() * maharajQuotes.length)];

  return (
    <div className={`${isMobile ? 'pb-20' : ''} bg-gray-50 min-h-screen`}>
      {/* Header */}
      <div className={`bg-white border-b border-gray-200 px-4 py-4 ${isDesktop ? '' : 'sticky top-0 z-30'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl text-[#FF6F00]">Share Your Seva</h1>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={completionScore} className="h-2 w-32" />
                <span className="text-xs text-gray-600">{completionScore}% complete</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || completionScore < 50}
            className="bg-[#FF6F00] hover:bg-[#E65100] text-white"
            size="sm"
          >
            {isSubmitting ? "Posting..." : "Share Seva"}
          </Button>
        </div>
      </div>

      <div className={isDesktop ? "flex gap-6 px-6 py-6" : "px-4 py-4 space-y-4"}>
        {/* Main Form */}
        <div className={isDesktop ? "flex-1 max-w-2xl space-y-4" : "space-y-4"}>
          {/* Inspiration Quote */}
          <Card className="p-4 bg-gradient-to-r from-[#FFF3E0] to-white border-[#FF6F00]">
            <p className="text-[#FF6F00] font-medium text-center">"{randomQuote}"</p>
            <p className="text-gray-600 text-sm text-center mt-1">
              Share your seva and inspire others to serve
            </p>
          </Card>

          {/* Step Indicator */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Step {currentStep} of 3</h3>
              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? 'bg-[#FF6F00]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    What seva did you do today? *
                  </label>
                  <Textarea
                    placeholder="Share the story of your seva. What motivated you? How did it feel to help others? Your experience can inspire countless others..."
                    value={formData.content}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, content: e.target.value }));
                      if (errors.content) setErrors(prev => ({ ...prev, content: "" }));
                    }}
                    className={`min-h-[120px] resize-none ${errors.content ? 'border-red-500' : ''}`}
                  />
                  {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                  <p className="text-xs text-gray-500 mt-1">{formData.content.length}/500 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Category *
                    </label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value: Category) => {
                        setFormData(prev => ({ ...prev, category: value }));
                        if (errors.category) setErrors(prev => ({ ...prev, category: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select seva type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            <div className="flex items-center gap-2">
                              <span>{categoryEmojis[cat]}</span>
                              <span>{cat}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      People Helped *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="number"
                        min="1"
                        placeholder="Count"
                        value={formData.peopleHelped}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, peopleHelped: e.target.value }));
                          if (errors.peopleHelped) setErrors(prev => ({ ...prev, peopleHelped: "" }));
                        }}
                        className={`pl-10 ${errors.peopleHelped ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.peopleHelped && <p className="text-red-500 text-xs mt-1">{errors.peopleHelped}</p>}
                    {formData.peopleHelped && (
                      <p className="text-xs text-[#FF6F00] mt-1">
                        You'll earn {parseInt(formData.peopleHelped) * 10} seva points!
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.content || !formData.category || !formData.peopleHelped}
                  className="w-full bg-[#FF6F00] hover:bg-[#E65100]"
                >
                  Continue to Location & Photos
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Where did this happen? *
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Location of seva"
                        value={formData.location}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, location: e.target.value }));
                          if (errors.location) setErrors(prev => ({ ...prev, location: "" }));
                        }}
                        className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <Button 
                      onClick={detectLocation} 
                      variant="outline" 
                      size="sm"
                      className="shrink-0"
                    >
                      <MapIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Add Photo (Optional but Recommended)
                  </label>
                  {formData.image ? (
                    <div className="relative">
                      <img 
                        src={formData.image} 
                        alt="Selected" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button 
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        +15 bonus points for photo!
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleImageSelect}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#FF6F00] transition-colors"
                    >
                      <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-gray-500">Add photo of your seva</span>
                      <span className="text-xs text-[#FF6F00] mt-1">+15 bonus seva points!</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-[#FF6F00] hover:bg-[#E65100]"
                  >
                    Add Tags & Publish
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Add Tags (Optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      onClick={() => addTag()} 
                      variant="outline" 
                      size="sm"
                      disabled={!newTag.trim() || formData.tags.length >= 5}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Suggested Tags */}
                  {formData.category && suggestedTags[formData.category] && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Suggested tags for {formData.category}:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestedTags[formData.category].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => addTag(tag)}
                            disabled={formData.tags.includes(tag)}
                            className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                              formData.tags.includes(tag)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-[#FF6F00] border-[#FF6F00] hover:bg-[#FFF3E0]'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formData.tags.length}/5 tags used
                  </p>
                </div>

                {/* Advanced Options */}
                <div>
                  <Button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    variant="ghost"
                    size="sm"
                    className="text-[#FF6F00] p-0"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                  </Button>
                  
                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Time Spent</label>
                          <Input
                            placeholder="e.g., 3 hours"
                            value={formData.timeSpent}
                            onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Resources Used</label>
                          <Input
                            placeholder="e.g., ₹500, 10kg rice"
                            value={formData.resources}
                            onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Allow Comments</span>
                        <Switch
                          checked={formData.allowComments}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowComments: checked }))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-[#FF6F00] hover:bg-[#E65100]"
                  >
                    {isSubmitting ? "Sharing Seva..." : "Share My Seva!"}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Preview */}
          {formData.content && currentStep === 3 && (
            <Card className="p-4">
              <h3 className="font-medium mb-3 text-[#FF6F00]">Preview</h3>
              <div className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-sm">{currentUser.name}</span>
                  {formData.category && (
                    <Badge variant="secondary" className="text-xs">
                      {categoryEmojis[formData.category]} {formData.category}
                    </Badge>
                  )}
                </div>
                <p className="text-sm mb-2">{formData.content}</p>
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded mb-2" />
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formData.location}</span>
                  <span className="text-[#FF6F00] font-medium">
                    {formData.peopleHelped} people helped
                  </span>
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="text-xs text-gray-500 mr-2">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Desktop Sidebar */}
        {isDesktop && (
          <div className="w-80 space-y-4">
            {/* Completion Progress */}
            <Card className="p-4">
              <h3 className="font-medium mb-3 text-[#FF6F00]">Post Completion</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={formData.content ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Story written
                  </span>
                  <span className="text-[#FF6F00]">+20pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={formData.category ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Category selected
                  </span>
                  <span className="text-[#FF6F00]">+15pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={formData.image ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Photo added
                  </span>
                  <span className="text-[#FF6F00]">+15pts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={formData.tags.length > 0 ? 'text-green-600' : 'text-gray-500'}>
                    ✓ Tags added
                  </span>
                  <span className="text-[#FF6F00]">+10pts</span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Seva Sharing Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Share specific details about your impact</li>
                <li>• Include photos for authenticity</li>
                <li>• Use relevant tags for discoverability</li>
                <li>• Mention what inspired you to help</li>
                <li>• Connect your seva to Maharaj's teachings</li>
              </ul>
            </Card>

            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-medium mb-3 text-[#FF6F00]">Your Impact</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total People Helped</span>
                  <span className="font-medium text-[#FF6F00]">{currentUser.totalHelped}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seva Points</span>
                  <span className="font-medium text-[#FF6F00]">{currentUser.sevaPoints}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Rank</span>
                  <span className="font-medium text-[#FF6F00]">{currentUser.currentRank}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}