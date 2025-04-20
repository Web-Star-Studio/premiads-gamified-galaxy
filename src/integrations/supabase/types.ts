export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cashback_campaigns: {
        Row: {
          advertiser_id: string | null
          advertiser_image: string | null
          advertiser_logo: string | null
          advertiser_name: string | null
          conditions: string | null
          created_at: string | null
          description: string | null
          discount_percentage: number
          end_date: string | null
          id: string
          is_active: boolean | null
          maximum_discount: number | null
          minimum_purchase: number | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          advertiser_id?: string | null
          advertiser_image?: string | null
          advertiser_logo?: string | null
          advertiser_name?: string | null
          conditions?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          maximum_discount?: number | null
          minimum_purchase?: number | null
          start_date?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          advertiser_id?: string | null
          advertiser_image?: string | null
          advertiser_logo?: string | null
          advertiser_name?: string | null
          conditions?: string | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          maximum_discount?: number | null
          minimum_purchase?: number | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cashback_redemptions: {
        Row: {
          amount: number
          campaign_id: string
          code: string
          created_at: string | null
          id: string
          redeemed_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          campaign_id: string
          code: string
          created_at?: string | null
          id?: string
          redeemed_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          campaign_id?: string
          code?: string
          created_at?: string | null
          id?: string
          redeemed_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cashback_redemptions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "cashback_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cashback_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_submissions: {
        Row: {
          feedback: string | null
          id: string
          mission_id: string
          status: string
          submission_data: Json | null
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          feedback?: string | null
          id?: string
          mission_id: string
          status?: string
          submission_data?: Json | null
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          feedback?: string | null
          id?: string
          mission_id?: string
          status?: string
          submission_data?: Json | null
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_submissions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          advertiser_id: string | null
          business_type: string | null
          created_at: string
          description: string
          end_date: string | null
          id: string
          is_active: boolean | null
          points: number
          requirements: Json | null
          start_date: string
          target_audience_age_max: number | null
          target_audience_age_min: number | null
          target_audience_gender: string | null
          target_audience_region: string | null
          title: string
          type: string
        }
        Insert: {
          advertiser_id?: string | null
          business_type?: string | null
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          points: number
          requirements?: Json | null
          start_date?: string
          target_audience_age_max?: number | null
          target_audience_age_min?: number | null
          target_audience_gender?: string | null
          target_audience_region?: string | null
          title: string
          type: string
        }
        Update: {
          advertiser_id?: string | null
          business_type?: string | null
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          points?: number
          requirements?: Json | null
          start_date?: string
          target_audience_age_max?: number | null
          target_audience_age_min?: number | null
          target_audience_gender?: string | null
          target_audience_region?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: number | null
          current_level_id: number | null
          description: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          next_points_threshold: number | null
          phone: string | null
          points: number
          profile_completed: boolean | null
          profile_data: Json | null
          push_notifications: boolean | null
          updated_at: string
          user_type: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          current_level_id?: number | null
          description?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          next_points_threshold?: number | null
          phone?: string | null
          points?: number
          profile_completed?: boolean | null
          profile_data?: Json | null
          push_notifications?: boolean | null
          updated_at?: string
          user_type?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: number | null
          current_level_id?: number | null
          description?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          next_points_threshold?: number | null
          phone?: string | null
          points?: number
          profile_completed?: boolean | null
          profile_data?: Json | null
          push_notifications?: boolean | null
          updated_at?: string
          user_type?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "user_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      raffle_numbers: {
        Row: {
          id: string
          number_value: number
          purchased_at: string
          raffle_id: string
          user_id: string
        }
        Insert: {
          id?: string
          number_value: number
          purchased_at?: string
          raffle_id: string
          user_id: string
        }
        Update: {
          id?: string
          number_value?: number
          purchased_at?: string
          raffle_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "raffle_numbers_raffle_id_fkey"
            columns: ["raffle_id"]
            isOneToOne: false
            referencedRelation: "raffles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raffle_numbers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      raffles: {
        Row: {
          created_at: string
          description: string
          detailed_description: string
          draw_date: string | null
          end_date: string | null
          id: string
          image_url: string
          min_points: number
          numbers_total: number
          points_per_number: number
          prize_type: string
          prize_value: number
          start_date: string | null
          status: string
          title: string
          updated_at: string
          winner_user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          detailed_description: string
          draw_date?: string | null
          end_date?: string | null
          id?: string
          image_url: string
          min_points?: number
          numbers_total: number
          points_per_number: number
          prize_type: string
          prize_value: number
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          winner_user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          detailed_description?: string
          draw_date?: string | null
          end_date?: string | null
          id?: string
          image_url?: string
          min_points?: number
          numbers_total?: number
          points_per_number?: number
          prize_type?: string
          prize_value?: number
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          winner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "raffles_winner_user_id_fkey"
            columns: ["winner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          points_awarded: boolean | null
          referral_code: string
          referred_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          points_awarded?: boolean | null
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          points_awarded?: boolean | null
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          id: string
          quantity: number
          raffle_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quantity?: number
          raffle_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quantity?: number
          raffle_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_levels: {
        Row: {
          benefits: Json | null
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: number
          max_points: number | null
          min_points: number
          name: string
          points_multiplier: number
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          max_points?: number | null
          min_points: number
          name: string
          points_multiplier: number
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          max_points?: number | null
          min_points?: number
          name?: string
          points_multiplier?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      increment_points_with_multiplier: {
        Args: { points_to_add: number; user_id: string }
        Returns: undefined
      }
      select_raffle_winner: {
        Args: { raffle_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
