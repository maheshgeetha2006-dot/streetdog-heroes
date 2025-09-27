import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Camera, MapPin, Clock, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  type: "injured" | "abandoned" | "aggressive" | "dead";
  urgency: "low" | "medium" | "high" | "critical";
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  reporterName: string;
  reporterContact: string;
  timestamp: Date;
  status: "pending" | "in_progress" | "resolved";
}

export default function Report() {
  const [formData, setFormData] = useState({
    type: "",
    urgency: "",
    description: "",
    reporterName: "",
    reporterContact: "",
    address: ""
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        toast.success("Location captured successfully");
        setIsGettingLocation(false);
        
        // Reverse geocoding would happen here to get address
        setFormData({...formData, address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`});
      },
      (error) => {
        toast.error("Unable to get your location. Please enter address manually.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.urgency || !formData.description || !formData.reporterName || !formData.reporterContact) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!location && !formData.address) {
      toast.error("Please provide location information");
      return;
    }

    setIsSubmitting(true);

    // Simulate AI injury detection for uploaded photos
    if (photos.length > 0) {
      toast.info("AI analyzing uploaded photos for injury severity...");
      
      // Simulate AI processing delay
      setTimeout(() => {
        const severityDetected = ["minor injuries", "severe trauma", "possible fracture", "wounds requiring immediate attention"][Math.floor(Math.random() * 4)];
        toast.success(`AI Detection: ${severityDetected} detected in uploaded photos`);
      }, 2000);
    }

    // Simulate form submission
    setTimeout(() => {
      const reportId = `RPT-${Date.now()}`;
      toast.success(`Report submitted successfully! Case ID: ${reportId}`);
      
      // Reset form
      setFormData({
        type: "",
        urgency: "",
        description: "",
        reporterName: "",
        reporterContact: "",
        address: ""
      });
      setPhotos([]);
      setLocation(null);
      setIsSubmitting(false);
    }, 3000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <section className="py-16 bg-gradient-card">
        <div className="container text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Report an Emergency</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us help them. Report injured, abandoned, or distressed street dogs 
            to connect them with immediate care and rescue services.
          </p>
        </div>
      </section>

      {/* Report Form */}
      <section className="py-12">
        <div className="container max-w-2xl">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Emergency Report Form
              </CardTitle>
              <CardDescription>
                Please provide as much detail as possible to help our rescue teams respond quickly and effectively.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Report Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type of Incident *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="injured">Injured Animal</SelectItem>
                        <SelectItem value="abandoned">Abandoned Puppy/Dog</SelectItem>
                        <SelectItem value="aggressive">Aggressive Behavior</SelectItem>
                        <SelectItem value="dead">Deceased Animal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait a few hours</SelectItem>
                        <SelectItem value="medium">Medium - Needs attention today</SelectItem>
                        <SelectItem value="high">High - Urgent, within 2 hours</SelectItem>
                        <SelectItem value="critical">Critical - Immediate response needed</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.urgency && (
                      <Badge className={`mt-2 ${getUrgencyColor(formData.urgency)}`}>
                        {formData.urgency.toUpperCase()} PRIORITY
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the animal's condition, behavior, and circumstances in detail..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <Label>Location Information *</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="flex items-center gap-2"
                      >
                        {isGettingLocation ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Getting Location...
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4" />
                            Use Current Location
                          </>
                        )}
                      </Button>
                      {location && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Location Captured
                        </Badge>
                      )}
                    </div>
                    <Input
                      placeholder="Or enter address manually..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <Label>Photo Evidence (Up to 5 photos)</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Button type="button" variant="outline" asChild>
                        <label className="cursor-pointer flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Upload Photos
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="sr-only"
                          />
                        </label>
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {photos.length}/5 photos uploaded
                      </span>
                    </div>
                    
                    {photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Photos will be analyzed using AI to assess injury severity and prioritize response.
                  </p>
                </div>

                {/* Reporter Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reporterName">Your Name *</Label>
                    <Input
                      id="reporterName"
                      value={formData.reporterName}
                      onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reporterContact">Contact Number *</Label>
                    <Input
                      id="reporterContact"
                      value={formData.reporterContact}
                      onChange={(e) => setFormData({...formData, reporterContact: e.target.value})}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Submit Emergency Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="mt-8 bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                  <div>
                    <p className="font-medium">Immediate Acknowledgment</p>
                    <p className="text-muted-foreground">You'll receive a case ID and confirmation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                  <div>
                    <p className="font-medium">AI Assessment & Routing</p>
                    <p className="text-muted-foreground">Photos are analyzed and report is sent to nearest NGO</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                  <div>
                    <p className="font-medium">Response Team Dispatch</p>
                    <p className="text-muted-foreground">Local rescue team is notified and dispatched to location</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
                  <div>
                    <p className="font-medium">Updates & Follow-up</p>
                    <p className="text-muted-foreground">You'll receive updates on the rescue and care provided</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}