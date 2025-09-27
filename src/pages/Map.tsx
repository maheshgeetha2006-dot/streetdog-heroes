import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Heart, Stethoscope, Home, Search } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SafeZone {
  id: string;
  name: string;
  type: "shelter" | "veterinary" | "feeding_spot" | "rescue_center";
  lat: number;
  lng: number;
  description: string;
  contact: string;
  timings: string;
  verified: boolean;
  addedBy: string;
}

// Mock data for safe zones
const mockSafeZones: SafeZone[] = [
  {
    id: "1",
    name: "Paws & Hearts Animal Shelter",
    type: "shelter",
    lat: 19.0760,
    lng: 72.8777,
    description: "24/7 animal shelter providing food, medical care, and adoption services",
    contact: "+91 98765 43210",
    timings: "24/7",
    verified: true,
    addedBy: "NGO Admin"
  },
  {
    id: "2",
    name: "VetCare Clinic",
    type: "veterinary",
    lat: 19.0896,
    lng: 72.8656,
    description: "Full-service veterinary clinic with emergency care for street animals",
    contact: "+91 87654 32109",
    timings: "9 AM - 8 PM",
    verified: true,
    addedBy: "Dr. Sharma"
  },
  {
    id: "3",
    name: "Community Feeding Point",
    type: "feeding_spot",
    lat: 19.0825,
    lng: 72.8735,
    description: "Regular feeding spot managed by local volunteers",
    contact: "Volunteers WhatsApp Group",
    timings: "7 AM & 7 PM daily",
    verified: false,
    addedBy: "Local Volunteer"
  }
];

// Custom marker icons for different types
const getMarkerIcon = (type: SafeZone['type']) => {
  const colors = {
    shelter: '#ef4444',
    veterinary: '#10b981',
    feeding_spot: '#f59e0b',
    rescue_center: '#3b82f6'
  };
  
  return L.divIcon({
    html: `<div style="background-color: ${colors[type]}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });
};

function AddLocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={L.divIcon({
      html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; animation: pulse 2s infinite;"></div>',
      className: 'new-location-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })}>
      <Popup>New location selected</Popup>
    </Marker>
  );
}

export default function Map() {
  const [safeZones, setSafeZones] = useState<SafeZone[]>(mockSafeZones);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [newLocation, setNewLocation] = useState({
    name: "",
    type: "feeding_spot" as SafeZone['type'],
    description: "",
    contact: "",
    timings: ""
  });

  const filteredZones = safeZones.filter(zone => {
    const matchesType = selectedType === "all" || zone.type === selectedType;
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddLocation = () => {
    if (!selectedPosition) return;
    
    const newZone: SafeZone = {
      id: Date.now().toString(),
      ...newLocation,
      lat: selectedPosition[0],
      lng: selectedPosition[1],
      verified: false,
      addedBy: "Current User"
    };
    
    setSafeZones([...safeZones, newZone]);
    setIsAddingLocation(false);
    setSelectedPosition(null);
    setNewLocation({
      name: "",
      type: "feeding_spot",
      description: "",
      contact: "",
      timings: ""
    });
  };

  const getTypeIcon = (type: SafeZone['type']) => {
    switch (type) {
      case 'shelter': return Home;
      case 'veterinary': return Stethoscope;
      case 'feeding_spot': return Heart;
      case 'rescue_center': return MapPin;
    }
  };

  const getTypeName = (type: SafeZone['type']) => {
    switch (type) {
      case 'shelter': return 'Animal Shelter';
      case 'veterinary': return 'Veterinary Clinic';
      case 'feeding_spot': return 'Feeding Spot';
      case 'rescue_center': return 'Rescue Center';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 bg-gradient-card border-b">
        <div className="container">
          <h1 className="text-3xl font-bold mb-4">Safe Zones & Resources</h1>
          <p className="text-muted-foreground mb-6">
            Discover shelters, veterinary clinics, feeding spots, and other safe spaces for street dogs in your area.
          </p>
          
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 min-w-[200px]"
                />
              </div>
              
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All Types" },
                  { value: "shelter", label: "Shelters" },
                  { value: "veterinary", label: "Veterinary" },
                  { value: "feeding_spot", label: "Feeding Spots" },
                  { value: "rescue_center", label: "Rescue Centers" }
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={selectedType === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            
            <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Safe Zone</DialogTitle>
                  <DialogDescription>
                    Click on the map to select a location, then fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      placeholder="Enter location name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      value={newLocation.type}
                      onChange={(e) => setNewLocation({...newLocation, type: e.target.value as SafeZone['type']})}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="feeding_spot">Feeding Spot</option>
                      <option value="shelter">Animal Shelter</option>
                      <option value="veterinary">Veterinary Clinic</option>
                      <option value="rescue_center">Rescue Center</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newLocation.description}
                      onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                      placeholder="Describe this location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact">Contact Information</Label>
                    <Input
                      id="contact"
                      value={newLocation.contact}
                      onChange={(e) => setNewLocation({...newLocation, contact: e.target.value})}
                      placeholder="Phone number or contact details"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timings">Timings</Label>
                    <Input
                      id="timings"
                      value={newLocation.timings}
                      onChange={(e) => setNewLocation({...newLocation, timings: e.target.value})}
                      placeholder="e.g., 9 AM - 6 PM, 24/7"
                    />
                  </div>
                  <Button 
                    onClick={handleAddLocation} 
                    disabled={!selectedPosition || !newLocation.name}
                    className="w-full"
                  >
                    Add Location
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="flex-1">
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Map */}
            <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-card">
              <MapContainer
                center={[19.0760, 72.8777]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Existing markers */}
                {filteredZones.map((zone) => (
                  <Marker 
                    key={zone.id} 
                    position={[zone.lat, zone.lng]} 
                    icon={getMarkerIcon(zone.type)}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-semibold text-base mb-1">{zone.name}</h3>
                        <Badge variant="outline" className="mb-2 text-xs">
                          {getTypeName(zone.type)}
                        </Badge>
                        {zone.verified && (
                          <Badge variant="default" className="mb-2 ml-1 text-xs">
                            Verified
                          </Badge>
                        )}
                        <p className="text-sm text-gray-600 mb-2">{zone.description}</p>
                        <div className="text-xs text-gray-500">
                          <p><strong>Contact:</strong> {zone.contact}</p>
                          <p><strong>Timings:</strong> {zone.timings}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Add location functionality */}
                {isAddingLocation && (
                  <AddLocationMarker onLocationSelect={(lat, lng) => setSelectedPosition([lat, lng])} />
                )}
              </MapContainer>
            </div>

            {/* Sidebar with locations list */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <h3 className="font-semibold text-lg">
                Nearby Locations ({filteredZones.length})
              </h3>
              
              {filteredZones.map((zone) => {
                const IconComponent = getTypeIcon(zone.type);
                return (
                  <Card key={zone.id} className="hover:shadow-soft transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-primary" />
                            {zone.name}
                          </CardTitle>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getTypeName(zone.type)}
                            </Badge>
                            {zone.verified && (
                              <Badge variant="default" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm mb-2">
                        {zone.description}
                      </CardDescription>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><strong>Contact:</strong> {zone.contact}</p>
                        <p><strong>Timings:</strong> {zone.timings}</p>
                        <p><strong>Added by:</strong> {zone.addedBy}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-6 bg-secondary/20 border-t">
        <div className="container">
          <h3 className="font-semibold mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'shelter', color: '#ef4444', name: 'Animal Shelters' },
              { type: 'veterinary', color: '#10b981', name: 'Veterinary Clinics' },
              { type: 'feeding_spot', color: '#f59e0b', name: 'Feeding Spots' },
              { type: 'rescue_center', color: '#3b82f6', name: 'Rescue Centers' }
            ].map(({ type, color, name }) => (
              <div key={type} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
