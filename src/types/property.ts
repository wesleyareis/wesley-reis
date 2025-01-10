import type { Json } from "@/integrations/supabase/types";

export interface PropertyFormData {
  id?: string;
  title: string;
  price: number;
  description?: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  total_area?: number;
  city: string;
  neighborhood: string;
  street_address?: string;
  building_name?: string;
  property_code?: string;
  agent_id?: string;
  status?: string;
  features: Json | Record<string, any>;
  images?: string[];
  condominium_fee?: number;
  property_tax?: number;
}

export interface PropertyData extends PropertyFormData {
  created_at?: string;
  updated_at?: string;
}