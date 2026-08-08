// Hand-authored to match supabase/migrations/0001_init.sql.
// Once the project is linked to a real Supabase project, regenerate with:
//   npx supabase gen types typescript --linked > lib/types/database.types.ts

export type Channel = "general" | "safety" | "buy_sell" | "lost_found" | "events";
export type ServiceCategory =
  | "home_services"
  | "health"
  | "education"
  | "community_faith"
  | "government";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          trust_tier: number;
          karma_score: number;
          home_geofence_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      geofences: {
        Row: {
          id: string;
          label: string;
          pincode: string | null;
          center: unknown;
          radius_m: number;
          type: "home" | "custom";
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["geofences"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["geofences"]["Row"]>;
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          channel: Channel;
          title: string;
          body: string | null;
          location: unknown;
          image_url: string | null;
          moderation_state: "visible" | "pending_review" | "hidden";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
      };
      service_providers: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          category: ServiceCategory;
          description: string | null;
          phone: string | null;
          address: string | null;
          location: unknown;
          verification_tier: number;
          image_url: string | null;
          rating_avg: number;
          rating_count: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_providers"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_providers"]["Row"]>;
      };
      service_reviews: {
        Row: {
          id: string;
          provider_id: string;
          author_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_reviews"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_reviews"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      nearby_posts: {
        Args: {
          lat: number;
          lng: number;
          radius_m?: number;
          channel_filter?: string | null;
        };
        Returns: {
          id: string;
          author_id: string;
          channel: Channel;
          title: string;
          body: string | null;
          lat: number;
          lng: number;
          image_url: string | null;
          created_at: string;
          distance_m: number;
          author_display_name: string;
          author_avatar_url: string | null;
        }[];
      };
      nearby_providers: {
        Args: {
          lat: number;
          lng: number;
          radius_m?: number;
          category_filter?: string | null;
        };
        Returns: {
          id: string;
          name: string;
          category: ServiceCategory;
          description: string | null;
          phone: string | null;
          address: string | null;
          lat: number;
          lng: number;
          verification_tier: number;
          image_url: string | null;
          rating_avg: number;
          rating_count: number;
          distance_m: number;
        }[];
      };
      get_provider: {
        Args: { provider_id: string };
        Returns: {
          id: string;
          owner_id: string | null;
          name: string;
          category: ServiceCategory;
          description: string | null;
          phone: string | null;
          address: string | null;
          lat: number;
          lng: number;
          verification_tier: number;
          image_url: string | null;
          rating_avg: number;
          rating_count: number;
          created_at: string;
        }[];
      };
    };
    Enums: Record<string, never>;
  };
}

export type NearbyPost = Database["public"]["Functions"]["nearby_posts"]["Returns"][number];
export type NearbyProvider = Database["public"]["Functions"]["nearby_providers"]["Returns"][number];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
