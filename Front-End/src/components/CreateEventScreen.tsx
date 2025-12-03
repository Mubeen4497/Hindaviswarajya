import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Image as ImageIcon, Tag, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp, EventType, SevaCategory } from './AppContext';
import { toast } from 'sonner@2.0.3';
import { useScreenSize } from './ui/use-screen-size';

interface CreateEventScreenProps {
  onBack: () => void;
}

const eventTypes: EventType[] = [
  'Seminar',
  'Cleaning Drive',
  'Food Distribution',
  'Medical Camp',
  'Blood Donation',
  'Tree Plantation',
  'Awareness Campaign',
  'Workshop',
  'Other'
];

const categories: SevaCategory[] = ['Food', 'Education', 'Health', 'Shelter', 'Other'];

export default function CreateEventScreen({ onBack }: CreateEventScreenProps) {
  const { createEvent } = useApp();
  const { isMobile } = useScreenSize();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '' as EventType,
    category: '' as SevaCategory,
    date: '',
    time: '',
    location: '',
    address: '',
    volunteersNeeded: '',
    duration: '',
    requirements: '',
    contactInfo: '',
    tags: '',
    image: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Event description is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time) newErrors.time = 'Event time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.volunteersNeeded || parseInt(formData.volunteersNeeded) <= 0) {
      newErrors.volunteersNeeded = 'Number of volunteers must be greater than 0';
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = 'Event date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    createEvent({
      title: formData.title,
      description: formData.description,
      eventType: formData.eventType,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      address: formData.address,
      organizerId: '', // Will be set by context
      volunteersNeeded: parseInt(formData.volunteersNeeded),
      image: formData.image || undefined,
      tags: tagsArray,
      duration: formData.duration || undefined,
      requirements: formData.requirements || undefined,
      contactInfo: formData.contactInfo || undefined,
    });

    toast.success('Event created successfully! 🎉');
    onBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl text-[#FF6F00]">Create Event</h1>
            <p className="text-sm text-gray-600">Organize a seva event</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 lg:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#FF6F00]">
                  Event Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Community Cleaning Drive"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Event Type & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-[#FF6F00]">
                    Event Type *
                  </Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) => handleInputChange('eventType', value)}
                  >
                    <SelectTrigger className={errors.eventType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.eventType && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.eventType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-[#FF6F00]">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#FF6F00]">
                  Event Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[#FF6F00] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Event Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className={errors.date ? 'border-red-500' : ''}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-[#FF6F00] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Event Time *
                  </Label>
                  <Input
                    id="time"
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={errors.time ? 'border-red-500' : ''}
                  />
                  {errors.time && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* Location & Address */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[#FF6F00] flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location (City, State) *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Pune, Maharashtra"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#FF6F00]">
                    Full Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g., Community Hall, MG Road"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Volunteers & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volunteersNeeded" className="text-[#FF6F00] flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Volunteers Needed *
                  </Label>
                  <Input
                    id="volunteersNeeded"
                    type="number"
                    min="1"
                    placeholder="e.g., 20"
                    value={formData.volunteersNeeded}
                    onChange={(e) => handleInputChange('volunteersNeeded', e.target.value)}
                    className={errors.volunteersNeeded ? 'border-red-500' : ''}
                  />
                  {errors.volunteersNeeded && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.volunteersNeeded}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-[#FF6F00]">
                    Duration (Optional)
                  </Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2 hours, 3 hours"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-[#FF6F00] flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Requirements (Optional)
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="What should volunteers bring? (e.g., gloves, water bottle)"
                  rows={2}
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <Label htmlFor="contactInfo" className="text-[#FF6F00]">
                  Contact Information (Optional)
                </Label>
                <Input
                  id="contactInfo"
                  placeholder="e.g., email@example.com or +91-XXXXXXXXXX"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-[#FF6F00] flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags (Optional)
                </Label>
                <Input
                  id="tags"
                  placeholder="e.g., cleaning, environment, community (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                />
                <p className="text-xs text-gray-500">Separate multiple tags with commas</p>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-[#FF6F00] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Event Image URL (Optional)
                </Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#FF6F00] hover:bg-[#E65100] text-white"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
