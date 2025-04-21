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
          created_at: string
          description: string | null
          discount_percentage: number
          end_date: string
          id: string
          is_active: boolean
          maximum_discount: number | null
          minimum_purchase: number | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          advertiser_id?: string | null
          advertiser_image?: string | null
          advertiser_logo?: string | null
          advertiser_name?: string | null
          conditions?: string | null
          created_at?: string
          description?: string | null
          discount_percentage: number
          end_date: string
          id?: string
          is_active?: boolean
          maximum_discount?: number | null
          minimum_purchase?: number | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          advertiser_id?: string | null
          advertiser_image?: string | null
          advertiser_logo?: string | null
          advertiser_name?: string | null
          conditions?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number
          end_date?: string
          id?: string
          is_active?: boolean
          maximum_discount?: number | null
          minimum_purchase?: number | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cashback_redemptions: {
        Row: {
          amount: number
          campaign_id: string | null
          code: string
          created_at: string
          id: string
          redeemed_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          code: string
          created_at?: string
          id?: string
          redeemed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          code?: string
          created_at?: string
          id?: string
          redeemed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cashback_redemptions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "cashback_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          advertiser_id: string
          business_type: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          points: number
          requirements: Json | null
          start_date: string | null
          target_audience_age_max: number | null
          target_audience_age_min: number | null
          target_audience_gender: string | null
          target_audience_region: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          advertiser_id: string
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          points?: number
          requirements?: Json | null
          start_date?: string | null
          target_audience_age_max?: number | null
          target_audience_age_min?: number | null
          target_audience_gender?: string | null
          target_audience_region?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          advertiser_id?: string
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          points?: number
          requirements?: Json | null
          start_date?: string | null
          target_audience_age_max?: number | null
          target_audience_age_min?: number | null
          target_audience_gender?: string | null
          target_audience_region?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          credits: number | null
          description: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          phone: string | null
          points: number | null
          profile_completed: boolean | null
          profile_data: Json | null
          push_notifications: boolean | null
          updated_at: string | null
          user_type: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          description?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          phone?: string | null
          points?: number | null
          profile_completed?: boolean | null
          profile_data?: Json | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_type?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          description?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          phone?: string | null
          points?: number | null
          profile_completed?: boolean | null
          profile_data?: Json | null
          push_notifications?: boolean | null
          updated_at?: string | null
          user_type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      raffle_numbers: {
        Row: {
          created_at: string
          id: string
          number: number
          raffle_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          number: number
          raffle_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          number?: number
          raffle_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "raffle_numbers_raffle_id_fkey"
            columns: ["raffle_id"]
            isOneToOne: false
            referencedRelation: "raffles"
            referencedColumns: ["id"]
          },
        ]
      }
      raffles: {
        Row: {
          created_at: string
          description: string
          detailed_description: string | null
          draw_date: string | null
          end_date: string
          id: string
          image_url: string | null
          min_points: number
          numbers_total: number
          points_per_number: number
          prize_type: string
          prize_value: number
          start_date: string
          status: string
          title: string
          updated_at: string
          winner_user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          detailed_description?: string | null
          draw_date?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          min_points?: number
          numbers_total?: number
          points_per_number?: number
          prize_type: string
          prize_value: number
          start_date: string
          status?: string
          title: string
          updated_at?: string
          winner_user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          detailed_description?: string | null
          draw_date?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          min_points?: number
          numbers_total?: number
          points_per_number?: number
          prize_type?: string
          prize_value?: number
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
          winner_user_id?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string | null
          id: string
          mission_id: string
          points_awarded: number | null
          status: string
          submission_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mission_id: string
          points_awarded?: number | null
          status?: string
          submission_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mission_id?: string
          points_awarded?: number | null
          status?: string
          submission_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
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
      get_mission_submissions: {
        Args: { mission_ids: string[]; status_filter: string }
        Returns: Json[]
      }
      select_raffle_winner: {
        Args: { raffle_id: string }
        Returns: string
      }
      update_submission_status: {
        Args: { submission_id: string; new_status: string }
        Returns: undefined
      }
      update_user_credits: {
        Args: { user_id: string; new_credits: number }
        Returns: undefined
      }
      update_user_type: {
        Args: { user_id: string; new_type: string; mark_completed: boolean }
        Returns: undefined
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
