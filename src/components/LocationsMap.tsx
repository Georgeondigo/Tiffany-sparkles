import React, { useState, useEffect } from "react";
import { MapPin, Store, Phone, ExternalLink, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import InteractiveMap from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  store_type: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}

const LocationsMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    fetchStoreLocations();
  }, []);

  const fetchStoreLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("store_locations")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setStoreLocations(data || []);
    } catch (error) {
      console.error("Error fetching store locations:", error);

      // Fallback sample data with coordinates
      setStoreLocations([
        {
          id: "1",
          name: "Premium Homeware Mumbai",
          address: "123 Shopping Mall, Bandra West, Mumbai 400050",
          phone: "+91 98765 43210",
          store_type: "Retail Partner",
          latitude: 19.0596,
          longitude: 72.8295,
          is_active: true,
        },
        {
          id: "2",
          name: "Quality Essentials Delhi",
          address: "456 Market Street, Connaught Place, New Delhi 110001",
          phone: "+91 98765 43211",
          store_type: "Authorized Dealer",
          latitude: 28.6139,
          longitude: 77.209,
          is_active: true,
        },
        {
          id: "3",
          name: "Home Solutions Bangalore",
          address: "789 Commercial Complex, MG Road, Bangalore 560001",
          phone: "+91 98765 43212",
          store_type: "Retail Partner",
          latitude: 12.9716,
          longitude: 77.5946,
          is_active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = (location: StoreLocation) => {
    const query = encodeURIComponent(`${location.name} ${location.address}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <section id="locations" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Where to Find Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover Tiffany Sparkles products at these premium retail locations
            across the country
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Interactive Map Section */}
          <div className="order-2 lg:order-1 h-full">
            <div className="h-full bg-background rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <div className="flex-1 min-h-[400px]">
                <InteractiveMap locations={storeLocations} />
              </div>

              {/* Fallback Instructions */}
              {!googleMapsApiKey && (
                <div className="p-4 border-t bg-muted/50 flex items-start gap-4">
                  <Settings
                    className="text-primary mt-1 flex-shrink-0"
                    size={20}
                  />
                  <div className="text-sm">
                    <p className="font-medium text-primary mb-1">
                      To enable the interactive map:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>
                        Get a Google Maps API key from{" "}
                        <a
                          href="https://console.cloud.google.com/google/maps-apis"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary hover:underline"
                        >
                          Google Cloud Console
                        </a>
                      </li>
                      <li>Enable the Maps JavaScript API</li>
                      <li>
                        Configure your API key in the <code>.env.local</code>{" "}
                        file as <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Store Locations List */}
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center">
              <Store className="text-secondary mr-3" size={28} />
              Our Retail Partners
            </h3>

            {loading ? (
              <div className="text-center py-8">Loading store locations...</div>
            ) : (
              <div className="space-y-4">
                {storeLocations.map((location) => (
                  <div
                    key={location.id}
                    className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-secondary/20"
                    onClick={() => setSelectedLocation(location.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-primary">
                        {location.name}
                      </h4>
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                        {location.store_type}
                      </span>
                    </div>

                    <div className="flex items-start text-muted-foreground mb-3">
                      <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{location.address}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {location.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone size={16} className="mr-2" />
                          <span className="text-sm">{location.phone}</span>
                        </div>
                      )}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInGoogleMaps(location);
                        }}
                        variant="outline"
                        size="sm"
                        className="ml-auto"
                      >
                        <ExternalLink size={16} className="mr-1" />
                        View on Maps
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-8 bg-gradient-to-r from-primary to-secondary p-6 rounded-xl text-primary-foreground">
              <h4 className="text-lg font-semibold mb-3">
                Interested in Partnership?
              </h4>
              <p className="text-sm opacity-90 mb-4">
                Join our network of premium retail partners and bring Tiffany
                Sparkles to your customers.
              </p>
              <button className="bg-background text-primary px-4 py-2 rounded-lg font-medium hover:bg-background/90 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-background rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Can't Find a Store Near You?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're constantly expanding our retail network. Contact us to find
              the nearest authorized dealer or to inquire about direct
              purchasing options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Find Nearest Store
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                Contact Sales Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsMap;
