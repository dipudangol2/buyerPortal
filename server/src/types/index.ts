export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  created_at?: Date;
}

export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  image_url?: string;
  description?: string;
  isFavourited?: boolean;
}

export interface Favourite {
  id: number;
  user_id: number;
  property_id: number;
  created_at: Date;
}

export interface JWTPayload {
  email: string;
  userId: string;
  iat?: number;
  exp?: number;
}
