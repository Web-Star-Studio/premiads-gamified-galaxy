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
          expires_at: string | null
          id: string
          is_active: boolean | null
          min_purchase: number | null
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
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          min_purchase?: number | null
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
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          min_purchase?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cashback_redemptions: {
        Row: {
          amount: number
          campaign_id: string | null
          code: string | null
          created_at: string | null
          id: string
          redeemed_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          redeemed_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          redeemed_at?: string | null
          status?: string | null
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
      mission_submissions: {
        Row: {
          feedback: string | null
          id: string
          mission_id: string | null
          status: string | null
          submission_data: Json | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          feedback?: string | null
          id?: string
          mission_id?: string | null
          status?: string | null
          submission_data?: Json | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          feedback?: string | null
          id?: string
          mission_id?: string | null
          status?: string | null
          submission_data?: Json | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
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
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          points: number
          requirements: Json | null
          start_date: string | null
          target_audience_age_max: number | null
          target_audience_age_min: number | null
          target_audience_gender: string | null
          target_audience_region: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          advertiser_id?: string | null
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          points?: number
          requirements?: Json | null
          start_date?: string | null
          target_audience_age_max?: number | null
          target_audience_age_min?: number | null
          target_audience_gender?: string | null
          target_audience_region?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          advertiser_id?: string | null
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          points?: number
          requirements?: Json | null
          start_date?: string | null
          target_audience_age_max?: number | null
          target_audience_age_min?: number | null
          target_audience_gender?: string | null
          target_audience_region?: string | null
          title?: string
          type?: string
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
          email: string | null
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
          email?: string | null
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
          email?: string | null
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
          created_at: string | null
          id: string
          number: number
          raffle_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          number: number
          raffle_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          number?: number
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
        ]
      }
      raffles: {
        Row: {
          created_at: string | null
          description: string
          detailed_description: string | null
          draw_date: string
          end_date: string
          id: string
          numbers_total: number
          points: number
          prize_type: string
          prize_value: number
          start_date: string
          status: string
          title: string
          type: string
          updated_at: string | null
          winner_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          detailed_description?: string | null
          draw_date: string
          end_date: string
          id?: string
          numbers_total: number
          points: number
          prize_type: string
          prize_value: number
          start_date: string
          status: string
          title: string
          type: string
          updated_at?: string | null
          winner_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          detailed_description?: string | null
          draw_date?: string
          end_date?: string
          id?: string
          numbers_total?: number
          points?: number
          prize_type?: string
          prize_value?: number
          start_date?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
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
          created_at: string | null
          id: string
          points_awarded: number | null
          referral_code: string
          referred_id: string | null
          referrer_id: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_awarded?: number | null
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          points_awarded?: number | null
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          status?: string | null
        }
        Relationships: []
      }
      user_levels: {
        Row: {
          benefits: Json
          color: string
          description: string
          icon: string
          id: number
          max_points: number | null
          min_points: number
          name: string
          points_multiplier: number
        }
        Insert: {
          benefits?: Json
          color?: string
          description?: string
          icon?: string
          id?: number
          max_points?: number | null
          min_points: number
          name: string
          points_multiplier?: number
        }
        Update: {
          benefits?: Json
          color?: string
          description?: string
          icon?: string
          id?: number
          max_points?: number | null
          min_points?: number
          name?: string
          points_multiplier?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
