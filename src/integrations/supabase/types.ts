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
      admin_notification_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: boolean
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: boolean
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      advertiser_profiles: {
        Row: {
          company_address: string | null
          company_description: string | null
          company_email: string | null
          company_logo: string | null
          company_name: string | null
          company_phone: string | null
          company_website: string | null
          created_at: string | null
          id: string
          rifas: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_address?: string | null
          company_description?: string | null
          company_email?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_website?: string | null
          created_at?: string | null
          id?: string
          rifas?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_address?: string | null
          company_description?: string | null
          company_email?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_website?: string | null
          created_at?: string | null
          id?: string
          rifas?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: string
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
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
          role: string | null
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
          role?: string | null
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
          role?: string | null
          updated_at?: string | null
          user_type?: string | null
          website?: string | null
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
          form_schema: Json | null
          has_badge: boolean | null
          has_lootbox: boolean | null
          id: string
          is_active: boolean | null
          max_cashback_redemptions: number | null
          max_participants: number | null
          min_purchase: number | null
          points_range: Json | null
          random_points: boolean | null
          requirements: Json | null
          rifas: number
          rifas_per_mission: number
          selected_lootbox_rewards: Json | null
          start_date: string | null
          status: string | null
          target_audience: string | null
          target_filter: Json
          tickets_reward: number | null
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
          form_schema?: Json | null
          has_badge?: boolean | null
          has_lootbox?: boolean | null
          id?: string
          is_active?: boolean | null
          max_cashback_redemptions?: number | null
          max_participants?: number | null
          min_purchase?: number | null
          points_range?: Json | null
          random_points?: boolean | null
          requirements?: Json | null
          rifas?: number
          rifas_per_mission?: number
          selected_lootbox_rewards?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          target_filter?: Json
          tickets_reward?: number | null
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
          form_schema?: Json | null
          has_badge?: boolean | null
          has_lootbox?: boolean | null
          id?: string
          is_active?: boolean | null
          max_cashback_redemptions?: number | null
          max_participants?: number | null
          min_purchase?: number | null
          points_range?: Json | null
          random_points?: boolean | null
          requirements?: Json | null
          rifas?: number
          rifas_per_mission?: number
          selected_lootbox_rewards?: Json | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
          target_filter?: Json
          tickets_reward?: number | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
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
          }
        ]
      }
      rifas_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          mission_id: string | null
          submission_id: string | null
          transaction_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          mission_id?: string | null
          submission_id?: string | null
          transaction_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          mission_id?: string | null
          submission_id?: string | null
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rifas_transactions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rifas_transactions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "mission_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rifas_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_category?: string
          p_data?: Json
        }
        Returns: string
      }
      notify_admins: {
        Args: {
          p_title: string
          p_message: string
          p_type?: string
          p_category?: string
          p_data?: Json
        }
        Returns: number
      }
      notify_advertiser: {
        Args: {
          p_advertiser_id: string
          p_title: string
          p_message: string
          p_type?: string
          p_category?: string
          p_data?: Json
        }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_notification_enabled: {
        Args: { setting_key: string }
        Returns: boolean
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
 