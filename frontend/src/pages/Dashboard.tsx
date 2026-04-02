import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/apiClient';
import { useSyncFavorites } from '../hooks/useSyncFavorites';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  image_url?: string;
  description?: string;
  isFavourited: boolean;
}

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const serverIds = useMemo(
    () => new Set(properties.filter(p => p.isFavourited).map(p => p.id)),
    [properties]
  );

  const { favoriteIds, toggleFavorite } = useSyncFavorites(
    serverIds,
    !loading
  );

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await apiClient.get<{ properties: Property[] }>('/properties');
        setProperties(data.properties);
      } catch (error) {
        console.error('Fetch Properties Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleToggle = (id: number) => {
    toggleFavorite(id);
  };

  const favouritedProperties = useMemo(
    () => properties.filter(p => favoriteIds.has(p.id)),
    [properties, favoriteIds]
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-slate-900 font-mono text-sm tracking-widest">
        LOADING DASHBOARD...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col selection:bg-slate-900 selection:text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Buyer Portal</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              <UserIcon size={10} strokeWidth={3} />
              <span>{user?.name}</span>
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              <span className="text-slate-900">{user?.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="rounded-none hover:bg-red-50 hover:text-red-600 h-8 w-8"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-16">
        {/* Favourites Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl font-black uppercase tracking-tight">My Favourites</h2>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                {favouritedProperties.length} Properties Saved
              </p>
            </div>
          </div>

          {favouritedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favouritedProperties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavourited={true}
                  onToggleFavourite={handleToggle}
                />
              ))}
            </div>
          ) : (
            <div className="border-4 border-slate-50 p-12 flex flex-col items-center justify-center text-center">
              <div className="text-slate-200 font-black text-4xl mb-4">EMPTY_LIST</div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Start exploring to save your favorite picks.
              </p>
            </div>
          )}
        </section>

        {/* Catalog Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl font-black uppercase tracking-tight">Explore Property</h2>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Available Listings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavourited={favoriteIds.has(property.id)}
                onToggleFavourite={handleToggle}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
