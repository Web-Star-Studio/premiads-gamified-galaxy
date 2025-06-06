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
      daily_streaks: {
        Row: {
          created_at: string | null
          current_streak: number
          id: string
          last_completion_date: string
          max_streak: number
          mission_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number
          id?: string
          last_completion_date: string
          max_streak?: number
          mission_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number
          id?: string
          last_completion_date?: string
          max_streak?: number
          mission_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_streaks_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
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
        Relationships: [
          {
            foreignKeyName: "mission_validation_logs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "mission_submissions"
            referencedColumns: ["id"]
          },
        ]
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
          sequence_bonus: boolean | null
          start_date: string | null
          status: string | null
          streak_multiplier: number | null
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
          sequence_bonus?: boolean | null
          start_date?: string | null
          status?: string | null
          streak_multiplier?: number | null
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
          sequence_bonus?: boolean | null
          start_date?: string | null
          status?: string | null
          streak_multiplier?: number | null
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
        Relationships: [
          {
            foreignKeyName: "participations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "credit_purchases_package_id_fkey"
            columns: ["rifa_package_id"]
            isOneToOne: false
            referencedRelation: "rifa_packages"
            referencedColumns: ["id"]
          },
        ]
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
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          type?: Database["public"]["Enums"]["transaction_type"]
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
        Relationships: [
          {
            foreignKeyName: "user_badges_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
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
      add_points_to_user: {
        Args: { p_user_id: string; p_points_to_add: number }
        Returns: undefined
      }
      add_tokens_to_user: {
        Args: { user_id: string; reward: number }
        Returns: undefined
      }
      confirm_rifa_purchase: {
        Args: { p_purchase_id: string }
        Returns: undefined
      }
      crm_dashboard: {
        Args: {
          p_advertiser_id: string
          campaign_filter?: string
          date_filter?: string
        }
        Returns: Json
      }
      delete_user_account: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      finalize_submission: {
        Args: {
          p_submission_id: string
          p_approver_id: string
          p_decision: string
          p_stage: string
        }
        Returns: Json
      }
      get_active_cashback_campaigns: {
        Args: Record<PropertyKey, never>
        Returns: {
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
        }[]
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      get_user_cashback_balance: {
        Args: { user_id: string }
        Returns: {
          cashback_balance: number
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      increment: {
        Args: { x: number; row_id: string; table_name: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_moderator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      process_mission_rewards: {
        Args: {
          p_submission_id: string
          p_user_id: string
          p_mission_id: string
        }
        Returns: Json
      }
      process_mission_rewards_simplified: {
        Args: {
          p_submission_id: string
          p_user_id: string
          p_mission_id: string
        }
        Returns: Json
      }
      redeem_cashback: {
        Args: { p_user_id: string; p_campaign_id: string; p_amount: number }
        Returns: {
          amount: number
          campaign_id: string | null
          code: string | null
          created_at: string | null
          id: string
          redeemed_at: string | null
          status: string | null
          user_id: string | null
        }[]
      }
      retroactively_award_badges: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reward_participant_for_submission: {
        Args: { submission_id: string }
        Returns: undefined
      }
      update_user_status: {
        Args: { user_id: string; is_active: boolean }
        Returns: boolean
      }
      validate_mission: {
        Args: { p_submission_id: string; p_admin_id: string }
        Returns: undefined
      }
      validate_mission_submission: {
        Args: {
          p_submission_id: string
          p_validator_id: string
          p_result: string
          p_is_admin?: boolean
          p_notes?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      transaction_type:
        | "purchase_rifas"
        | "earn_rifas"
        | "earn_cashback"
        | "spend_rifas"
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
    Enums: {
      transaction_type: [
        "purchase_rifas",
        "earn_rifas",
        "earn_cashback",
        "spend_rifas",
      ],
    },
  },
} as const
