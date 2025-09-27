import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Heart, MapPin, MessageCircle, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Street dog being rescued by caring volunteer" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        </div>
        
        <div className="container relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Protecting Our 
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Four-Legged Friends
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-8 text-gray-100 mb-8">
            Connect with NGOs, report injured dogs, find safe zones, and help with adoptions. 
            Together we can make our streets safer for every dog.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg">
              <Link to="/report">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Report Emergency
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/adoption">
                <Heart className="h-5 w-5 mr-2" />
                Find a Companion
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Street Dog Safety App bridges the gap between caring citizens and dedicated NGOs. 
              We provide a comprehensive platform for reporting injured or abandoned dogs, 
              coordinating rescue efforts, facilitating adoptions, and creating a network of 
              safe spaces throughout our communities.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How We Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Emergency Reporting",
                description: "Quickly report injured or abandoned dogs with photo evidence and GPS location",
                icon: AlertTriangle,
                color: "text-destructive",
                href: "/report"
              },
              {
                title: "Safe Zone Mapping",
                description: "Discover feeding spots, shelters, and veterinary clinics in your area",
                icon: MapPin,
                color: "text-success",
                href: "/map"
              },
              {
                title: "Adoption Network",
                description: "Browse adoptable dogs and connect with verified NGOs for a smooth adoption process",
                icon: Heart,
                color: "text-primary",
                href: "/adoption"
              },
              {
                title: "Real-time Communication",
                description: "Chat directly with NGOs, volunteers, and veterinarians for coordinated care",
                icon: MessageCircle,
                color: "text-accent",
                href: "/chat"
              },
              {
                title: "Community Protection",
                description: "Work together to create safer environments for street dogs in your neighborhood",
                icon: Shield,
                color: "text-success",
                href: "/map"
              },
              {
                title: "Volunteer Network",
                description: "Connect with like-minded individuals and organizations making a difference",
                icon: Users,
                color: "text-accent",
                href: "/chat"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-card transition-shadow duration-300 bg-gradient-card border-border/50">
                  <CardHeader>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <Button asChild variant="outline" size="sm">
                      <Link to={feature.href}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="mx-auto max-w-2xl text-lg mb-8 opacity-90">
            Join our community of compassionate individuals working to improve the lives of street dogs. 
            Every report, every adoption, every act of kindness counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/report">Start Helping Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/map">Explore Safe Zones</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}