
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
          advertiser_logo: string | null
          advertiser_name: string | null
          cashback_percentage: number
          category: string | null
          created_at: string | null
          description: string | null
          end_date: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          min_purchase: number | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          advertiser_id?: string | null
          advertiser_logo?: string | null
          advertiser_name?: string | null
          cashback_percentage: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          min_purchase?: number | null
          start_date?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          advertiser_id?: string | null
          advertiser_logo?: string | null
          advertiser_name?: string | null
          cashback_percentage?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          min_purchase?: number | null
          start_date?: string
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

      mission_rewards: {
        Row: {
          cashback_earned: number | null
          id: string
          mission_id: string
          rewarded_at: string | null
          rifas_earned: number
          submission_id: string
          user_id: string
        }
        Insert: {
          cashback_earned?: number | null
          id?: string
          mission_id: string
          rewarded_at?: string | null
          rifas_earned?: number
          submission_id: string
          user_id: string
        }
        Update: {
          cashback_earned?: number | null
          id?: string
          mission_id?: string
          rewarded_at?: string | null
          rifas_earned?: number
          submission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_rewards_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_rewards_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "mission_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_submissions: {
        Row: {
          admin_validated: boolean | null
          id: string
          mission_id: string | null
          review_stage: string | null
          second_instance: boolean | null
          second_instance_status: string | null
          status: string | null
          submission_data: Json | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
          validated_by: string | null
        }
        Insert: {
          admin_validated?: boolean | null
          id?: string
          mission_id?: string | null
          review_stage?: string | null
          second_instance?: boolean | null
          second_instance_status?: string | null
          status?: string | null
          submission_data?: Json | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          validated_by?: string | null
        }
        Update: {
          admin_validated?: boolean | null
          id?: string
          mission_id?: string | null
          review_stage?: string | null
          second_instance?: boolean | null
          second_instance_status?: string | null
          status?: string | null
          submission_data?: Json | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          validated_by?: string | null
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
      mission_validation_logs: {
        Row: {
          created_at: string | null
          id: string
          is_admin: boolean | null
          notes: string | null
          result: string
          submission_id: string
          validated_by: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          notes?: string | null
          result: string
          submission_id: string
          validated_by: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          notes?: string | null
          result?: string
          submission_id?: string
          validated_by?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          advertiser_id: string | null
          badge_image_url: string | null
          cashback_amount_per_raffle: number | null
          cashback_reward: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          has_badge: boolean | null
          has_lootbox: boolean | null
          id: string
          is_active: boolean | null
          max_cashback_redemptions: number | null
          max_participants: number | null
          requirements: Json | null
          rifas: number
          rifas_per_mission: number
          selected_lootbox_rewards: string[] | null
          start_date: string | null
          status: string | null
          target_audience: string | null
          target_filter: Json
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          advertiser_id?: string | null
          badge_image_url?: string | null
          cashback_amount_per_raffle?: number | null
          cashback_reward?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          has_badge?: boolean | null
          has_lootbox?: boolean | null
          id?: string
          is_active?: boolean | null
          max_cashback_redemptions?: number | null
          max_participants?: number | null
          requirements?: Json | null
          rifas?: number
          rifas_per_mission?: number
          selected_lootbox_rewards?: string[] | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          target_filter?: Json
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          advertiser_id?: string | null
          badge_image_url?: string | null
          cashback_amount_per_raffle?: number | null
          cashback_reward?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          has_badge?: boolean | null
          has_lootbox?: boolean | null
          id?: string
          is_active?: boolean | null
          max_cashback_redemptions?: number | null
          max_participants?: number | null
          requirements?: Json | null
          rifas?: number
          rifas_per_mission?: number
          selected_lootbox_rewards?: string[] | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          target_filter?: Json
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      participations: {
        Row: {
          campaign_id: string
          completed_at: string | null
          id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          completed_at?: string | null
          id?: string
          started_at?: string
          status: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          completed_at?: string | null
          id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean | null
          avatar_url: string | null
          cashback_balance: number
          created_at: string | null
          description: string | null
          email: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          income_range: string | null
          phone: string | null
          profile_completed: boolean | null
          profile_data: Json | null
          push_notifications: boolean | null
          rifas: number
          updated_at: string | null
          user_type: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          avatar_url?: string | null
          cashback_balance?: number
          created_at?: string | null
          description?: string | null
          email?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          income_range?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          profile_data?: Json | null
          push_notifications?: boolean | null
          rifas?: number
          updated_at?: string | null
          user_type?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          avatar_url?: string | null
          cashback_balance?: number
          created_at?: string | null
          description?: string | null
          email?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          income_range?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          profile_data?: Json | null
          push_notifications?: boolean | null
          rifas?: number
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
        Relationships: []
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
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          rifas_awarded: number
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          rifas_awarded?: number
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          rifas_awarded?: number
          status?: string | null
        }
        Relationships: []
      }
      rifa_packages: {
        Row: {
          active: boolean
          created_at: string | null
          id: string
          price: number
          rifas_amount: number
          rifas_bonus: number
          updated_at: string | null
          validity_months: number
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          id?: string
          price: number
          rifas_amount: number
          rifas_bonus?: number
          updated_at?: string | null
          validity_months?: number
        }
        Update: {
          active?: boolean
          created_at?: string | null
          id?: string
          price?: number
          rifas_amount?: number
          rifas_bonus?: number
          updated_at?: string | null
          validity_months?: number
        }
        Relationships: []
      }
      rifa_purchases: {
        Row: {
          base: number
          bonus: number
          created_at: string | null
          id: string
          payment_id: string | null
          payment_method: string
          payment_provider: string
          price: number
          rifa_package_id: string | null
          status: string
          total_rifas: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          base: number
          bonus?: number
          created_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method: string
          payment_provider: string
          price: number
          rifa_package_id?: string | null
          status: string
          total_rifas: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          base?: number
          bonus?: number
          created_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string
          payment_provider?: string
          price?: number
          rifa_package_id?: string | null
          status?: string
          total_rifas?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          id: string
          stripe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_id?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_description: string | null
          badge_image_url: string | null
          badge_name: string
          created_at: string | null
          earned_at: string | null
          id: string
          mission_id: string
          user_id: string
        }
        Insert: {
          badge_description?: string | null
          badge_image_url?: string | null
          badge_name: string
          created_at?: string | null
          earned_at?: string | null
          id?: string
          mission_id: string
          user_id: string
        }
        Update: {
          badge_description?: string | null
          badge_image_url?: string | null
          badge_name?: string
          created_at?: string | null
          earned_at?: string | null
          id?: string
          mission_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_cashbacks: {
        Row: {
          created_at: string | null
          id: string
          redeemed_cashback: number
          total_cashback: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          redeemed_cashback?: number
          total_cashback?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          redeemed_cashback?: number
          total_cashback?: number
          updated_at?: string | null
          user_id?: string
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
