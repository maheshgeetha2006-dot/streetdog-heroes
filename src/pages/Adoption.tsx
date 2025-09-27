import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Calendar, Stethoscope, Search } from "lucide-react";

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: "Male" | "Female";
  size: "Small" | "Medium" | "Large";
  health: "Excellent" | "Good" | "Needs Care";
  location: string;
  description: string;
  photo: string;
  ngo: string;
  vaccinated: boolean;
  neutered: boolean;
}

// Mock data - will be replaced with API calls
const mockDogs: Dog[] = [
  {
    id: "1",
    name: "Charlie",
    breed: "Indian Pariah",
    age: "2 years",
    gender: "Male",
    size: "Medium",
    health: "Excellent",
    location: "Mumbai, Maharashtra",
    description: "Charlie is a friendly and energetic dog who loves playing fetch. He's great with children and other dogs.",
    photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    ngo: "Paws & Hearts NGO",
    vaccinated: true,
    neutered: true
  },
  {
    id: "2",
    name: "Bella",
    breed: "Mixed Breed",
    age: "1.5 years",
    gender: "Female",
    size: "Small",
    health: "Good",
    location: "Delhi, NCR",
    description: "Bella is a sweet and gentle companion, perfect for families. She's been rescued and is looking for her forever home.",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
    ngo: "Delhi Dog Rescue",
    vaccinated: true,
    neutered: false
  },
  {
    id: "3",
    name: "Max",
    breed: "Labrador Mix",
    age: "3 years",
    gender: "Male",
    size: "Large",
    health: "Excellent",
    location: "Bangalore, Karnataka",
    description: "Max is an intelligent and loyal companion. He knows basic commands and is great for active families.",
    photo: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=300&fit=crop",
    ngo: "Bangalore Animal Care",
    vaccinated: true,
    neutered: true
  }
];

export default function Adoption() {
  const [dogs, setDogs] = useState<Dog[]>(mockDogs);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>(mockDogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Extract unique values for filters
  const breeds = Array.from(new Set(dogs.map(dog => dog.breed)));
  const sizes = Array.from(new Set(dogs.map(dog => dog.size)));
  const locations = Array.from(new Set(dogs.map(dog => dog.location)));

  // Filter dogs based on search and filter criteria
  useEffect(() => {
    let filtered = dogs;

    if (searchTerm) {
      filtered = filtered.filter(dog => 
        dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBreed !== "all") {
      filtered = filtered.filter(dog => dog.breed === selectedBreed);
    }

    if (selectedSize !== "all") {
      filtered = filtered.filter(dog => dog.size === selectedSize);
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(dog => dog.location === selectedLocation);
    }

    setFilteredDogs(filtered);
  }, [dogs, searchTerm, selectedBreed, selectedSize, selectedLocation]);

  const handleApplyForAdoption = (dogId: string) => {
    // This will be connected to backend API
    console.log(`Applying for adoption of dog with ID: ${dogId}`);
    alert("Adoption application submitted! The NGO will contact you soon.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <section className="py-16 bg-gradient-card">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Companion</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our loving dogs waiting for their forever homes. Each one has been rescued, 
              cared for, and is ready to bring joy to your life.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-card p-6 rounded-lg shadow-card">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, breed, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedBreed} onValueChange={setSelectedBreed}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by breed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Breeds</SelectItem>
                {breeds.map(breed => (
                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {sizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Dog Listings */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Available Dogs ({filteredDogs.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDogs.map((dog) => (
              <Card key={dog.id} className="overflow-hidden hover:shadow-card transition-shadow duration-300 bg-gradient-card">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={dog.photo}
                    alt={dog.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{dog.name}</CardTitle>
                      <CardDescription className="text-base">{dog.breed}</CardDescription>
                    </div>
                    <Heart className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer transition-colors" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{dog.age}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={dog.health === "Excellent" ? "default" : "secondary"}>
                        {dog.health}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{dog.location}</span>
                    </div>
                    <div className="flex gap-1">
                      {dog.vaccinated && (
                        <Badge variant="outline" className="text-xs">Vaccinated</Badge>
                      )}
                      {dog.neutered && (
                        <Badge variant="outline" className="text-xs">Neutered</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {dog.description}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-3">
                      Cared for by: <span className="font-medium text-foreground">{dog.ngo}</span>
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => handleApplyForAdoption(dog.id)}
                    >
                      Apply for Adoption
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDogs.length === 0 && (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Dogs Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later for new arrivals.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}