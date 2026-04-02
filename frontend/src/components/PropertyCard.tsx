import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  image_url?: string;
  description?: string;
}

interface PropertyCardProps {
  property: Property;
  isFavourited: boolean;
  onToggleFavourite: (id: number) => void;
}

export const PropertyCard = ({ property, isFavourited, onToggleFavourite }: PropertyCardProps) => {
  return (
    <Card className="rounded-none border-2 border-slate-200 shadow-none hover:border-slate-400 transition-colors">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {property.image_url ? (
          <img
            src={property.image_url}
            alt={property.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        <button
          onClick={() => onToggleFavourite(property.id)}
          className="absolute right-3 top-3 bg-white/80 p-2 hover:bg-white transition-colors border border-slate-200"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isFavourited ? "fill-red-500 text-red-500" : "text-slate-400"
            )}
          />
        </button>
      </div>
      <CardHeader className="p-4 py-3">
        <CardTitle className="text-lg font-bold truncate">{property.title}</CardTitle>
        <CardDescription className="text-xs">{property.location}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-2xl font-black text-slate-900">
          Rs. {property.price.toLocaleString()}
        </div>
        <div className="text-sm text-slate-500 mt-1">
          {property.bedrooms} Bedrooms
        </div>
      </CardContent>
    </Card>
  );
};
