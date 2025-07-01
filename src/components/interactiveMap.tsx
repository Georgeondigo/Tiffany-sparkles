import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

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

interface InteractiveMapProps {
  locations: StoreLocation[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const defaultApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const [userApiKey, setUserApiKey] = useState(defaultApiKey);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!defaultApiKey);

  const loadMap = async (key: string) => {
    if (!key.trim()) {
      // toast.error("Please enter a valid Google Maps API key");
      return;
    }

    setIsLoading(true);

    try {
      const loader = new Loader({
        apiKey: key,
        version: "weekly",
        libraries: ["places"],
      });

      await loader.load();
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!mapRef.current) {
        // toast.error("Map container not ready. Please try again.");
        return;
      }

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const defaultCenter =
        locations.length > 0 && locations[0].latitude && locations[0].longitude
          ? {
              lat: Number(locations[0].latitude),
              lng: Number(locations[0].longitude),
            }
          : { lat: -1.286389, lng: 36.817223 }; // Default to Nairobi if no locations

      const map = new google.maps.Map(mapRef.current, {
        zoom: locations.length > 1 ? 6 : 12,
        center: defaultCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
          },
        ],
      });

      mapInstanceRef.current = map;

      const bounds = new google.maps.LatLngBounds();
      let hasValidCoordinates = false;

      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          hasValidCoordinates = true;

          const marker = new google.maps.Marker({
            position: {
              lat: Number(location.latitude),
              lng: Number(location.longitude),
            },
            map: map,
            title: location.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#8B5CF6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 250px; padding: 10px;">
                <h3 style="margin: 0 0 8px 0; color: #8B5CF6; font-size: 16px; font-weight: 600;">${
                  location.name
                }</h3>
                <p style="margin: 0 0 6px 0; color: #6B7280; font-size: 14px;">${
                  location.address
                }</p>
                ${
                  location.phone
                    ? `<p style="margin: 0 0 6px 0; color: #6B7280; font-size: 14px;">📞 ${location.phone}</p>`
                    : ""
                }
                <span style="background: #F3F4F6; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #374151;">${
                  location.store_type
                }</span>
              </div>
            `,
          });

          marker.addListener("click", () => {
            markersRef.current.forEach((m) => {
              const inf = (m as any).infoWindow;
              if (inf) inf.close();
            });

            infoWindow.open(map, marker);
          });

          (marker as any).infoWindow = infoWindow;
          markersRef.current.push(marker);

          bounds.extend(marker.getPosition()!);
        }
      });

      if (hasValidCoordinates && locations.length > 1) {
        map.fitBounds(bounds, 50);
      }

      setMapLoaded(true);
      setShowApiKeyInput(false);
      // toast.success("Google Maps loaded successfully!");
    } catch (error) {
      console.error("Google Maps error:", error);
     // toast.error("Failed to load Google Maps. Please check your API key and permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMap = () => {
    if (userApiKey.trim()) loadMap(userApiKey);
  };

  useEffect(() => {
    if (defaultApiKey && !mapLoaded && !isLoading) {
      setTimeout(() => {
        loadMap(defaultApiKey);
      }, 200);
    }
  }, [defaultApiKey, mapLoaded, isLoading]);

  if (showApiKeyInput || (!defaultApiKey && !mapLoaded)) {
    return (
      <Card className="w-full min-h-[450px]">
        <CardContent className="flex items-center justify-center h-full p-6">
          <div className="text-center max-w-md">
            <MapPin className="text-secondary mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-primary mb-2">
              Interactive Google Maps
            </h3>

            <p className="text-muted-foreground mb-6">
              Enter your Google Maps API key to enable the interactive map
            </p>

            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter Google Maps API Key"
                value={userApiKey}
                onChange={(e) => setUserApiKey(e.target.value)}
                className="w-full"
              />

              <Button
                onClick={handleLoadMap}
                disabled={isLoading || !userApiKey.trim()}
                className="w-full"
              >
                {isLoading ? "Loading Map..." : "Load Interactive Map"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[550px] lg:h-full rounded-xl overflow-hidden shadow-lg border">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};

export default InteractiveMap;
