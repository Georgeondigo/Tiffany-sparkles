import React from "react";
import { MessageCircle, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OrderNowButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"Microfibre
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const OrderNowButton = ({
  className,
  size = "default",
  variant = "default",
}: OrderNowButtonProps) => {
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      "Hi, I'm interested in Tiffany Sparkles Microfibre cloths. Can I place an order?"
    );
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  const handleFindRetailers = () => {
    const element = document.getElementById("locations");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className} size={size} variant={variant}>
          <ShoppingBag className="mr-2" size={size === "sm" ? 16 : 18} />
          Order Now
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-primary text-center mb-3">
            How would you like to order?
          </h3>

          <Button
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-500 hover:bg-green-600 text-white justify-start"
            size="lg"
          >
            <MessageCircle className="mr-3" size={20} />
            <div className="text-left">
              <div className="font-medium">Order via WhatsApp</div>
              <div className="text-xs opacity-90">
                Instant chat with our team
              </div>
            </div>
          </Button>

          <Button
            onClick={handleFindRetailers}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground justify-start"
            size="lg"
          >
            <MapPin className="mr-3" size={20} />
            <div className="text-left">
              <div className="font-medium">Find Nearby Retailers</div>
              <div className="text-xs opacity-70">Locate stores near you</div>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OrderNowButton;
