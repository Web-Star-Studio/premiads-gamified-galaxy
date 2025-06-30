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
      admin_notifications_log: {
        Row: {
          data: Json | null
          id: string
          message: string
          recipients_count: number | null
          sent_at: string | null
          sent_by: string | null
          target_type: string
          title: string
        }
        Insert: {
          data?: Json | null
          id?: string
          message: string
          recipients_count?: number | null
          sent_at?: string | null
          sent_by?: string | null
          target_type: string
          title: string
        }
        Update: {
          data?: Json | null
          id?: string
          message?: string
          recipients_count?: number | null
          sent_at?: string | null
          sent_by?: string | null
          target_type?: string
          title?: string
        }
        Relationships: []
      }
      advertiser_crm_unlocks: {
        Row: {
          advertiser_id: string
          created_at: string | null
          id: string
          mission_id: string
          rifas_cost: number | null
          unlocked_at: string | null
        }
        Insert: {
          advertiser_id: string
          created_at?: string | null
          id?: string
          mission_id: string
          rifas_cost?: number | null
          unlocked_at?: string | null
        }
        Update: {
          advertiser_id?: string
          created_at?: string | null
          id?: string
          mission_id?: string
          rifas_cost?: number | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_crm_unlocks_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      advertiser_participant_unlocks: {
        Row: {
          advertiser_id: string
          created_at: string | null
          id: string
          mission_id: string
          participant_id: string
          rifas_cost: number | null
          unlocked_at: string | null
        }
        Insert: {
          advertiser_id: string
          created_at?: string | null
          id?: string
          mission_id: string
          participant_id: string
          rifas_cost?: number | null
          unlocked_at?: string | null
        }
        Update: {
          advertiser_id?: string
          created_at?: string | null
          id?: string
          mission_id?: string
          participant_id?: string
          rifas_cost?: number | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_participant_unlocks_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
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
      cashback_tokens: {
        Row: {
          advertiser_id: string | null
          campaign_id: string | null
          cashback_percentage: number
          created_at: string | null
          id: string
          sha_code: string
          status: string
          updated_at: string | null
          user_id: string
          validade: string
        }
        Insert: {
          advertiser_id?: string | null
          campaign_id?: string | null
          cashback_percentage: number
          created_at?: string | null
          id?: string
          sha_code: string
          status?: string
          updated_at?: string | null
          user_id: string
          validade: string
        }
        Update: {
          advertiser_id?: string | null
          campaign_id?: string | null
          cashback_percentage?: number
          created_at?: string | null
          id?: string
          sha_code?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          validade?: string
        }
        Relationships: [
          {
            foreignKeyName: "cashback_tokens_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "cashback_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      indicacoes: {
        Row: {
          convidado_id: string
          criado_em: string | null
          id: string
          referencia_id: string
          status: string | null
        }
        Insert: {
          convidado_id: string
          criado_em?: string | null
          id?: string
          referencia_id: string
          status?: string | null
        }
        Update: {
          convidado_id?: string
          criado_em?: string | null
          id?: string
          referencia_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "indicacoes_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencias"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          type: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          type: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          type?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      lotteries: {
        Row: {
          created_at: string | null
          description: string | null
          detailed_description: string | null
          draw_date: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_auto_scheduled: boolean | null
          min_points: number | null
          name: string | null
          number_range: Json | null
          numbers_sold: number | null
          numbers_total: number | null
          points_per_number: number | null
          prize_type: string | null
          prize_value: number | null
          progress: number | null
          start_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          winner: Json | null
          winning_number: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          draw_date?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_auto_scheduled?: boolean | null
          min_points?: number | null
          name?: string | null
          number_range?: Json | null
          numbers_sold?: number | null
          numbers_total?: number | null
          points_per_number?: number | null
          prize_type?: string | null
          prize_value?: number | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          winner?: Json | null
          winning_number?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          draw_date?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_auto_scheduled?: boolean | null
          min_points?: number | null
          name?: string | null
          number_range?: Json | null
          numbers_sold?: number | null
          numbers_total?: number | null
          points_per_number?: number | null
          prize_type?: string | null
          prize_value?: number | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          winner?: Json | null
          winning_number?: number | null
        }
        Relationships: []
      }
      lotteries_backup: {
        Row: {
          created_at: string | null
          description: string | null
          detailed_description: string | null
          draw_date: string | null
          end_date: string | null
          id: string | null
          image_url: string | null
          is_auto_scheduled: boolean | null
          min_points: number | null
          name: string | null
          number_range: Json | null
          numbers_sold: number | null
          numbers_total: number | null
          points_per_number: number | null
          prize_type: string | null
          prize_value: number | null
          progress: number | null
          start_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          winner: Json | null
          winning_number: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          draw_date?: string | null
          end_date?: string | null
          id?: string | null
          image_url?: string | null
          is_auto_scheduled?: boolean | null
          min_points?: number | null
          name?: string | null
          number_range?: Json | null
          numbers_sold?: number | null
          numbers_total?: number | null
          points_per_number?: number | null
          prize_type?: string | null
          prize_value?: number | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          winner?: Json | null
          winning_number?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          draw_date?: string | null
          end_date?: string | null
          id?: string | null
          image_url?: string | null
          is_auto_scheduled?: boolean | null
          min_points?: number | null
          name?: string | null
          number_range?: Json | null
          numbers_sold?: number | null
          numbers_total?: number | null
          points_per_number?: number | null
          prize_type?: string | null
          prize_value?: number | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          winner?: Json | null
          winning_number?: number | null
        }
        Relationships: []
      }
      lottery_participants: {
        Row: {
          created_at: string | null
          id: string
          lottery_id: string
          numbers: number[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lottery_id: string
          numbers?: number[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lottery_id?: string
          numbers?: number[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lottery_participants_backup: {
        Row: {
          created_at: string | null
          id: string | null
          lottery_id: string | null
          numbers: number[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          lottery_id?: string | null
          numbers?: number[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          lottery_id?: string | null
          numbers?: number[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      lottery_winners: {
        Row: {
          created_at: string | null
          id: string | null
          lottery_id: string | null
          prize_name: string | null
          prize_value: number | null
          user_id: string | null
          winning_number: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          lottery_id?: string | null
          prize_name?: string | null
          prize_value?: number | null
          user_id?: string | null
          winning_number?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          lottery_id?: string | null
          prize_name?: string | null
          prize_value?: number | null
          user_id?: string | null
          winning_number?: number | null
        }
        Relationships: []
      }
      lottery_winners_backup: {
        Row: {
          created_at: string | null
          id: string | null
          lottery_id: string | null
          prize_name: string | null
          prize_value: number | null
          user_id: string | null
          winning_number: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          lottery_id?: string | null
          prize_name?: string | null
          prize_value?: number | null
          user_id?: string | null
          winning_number?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          lottery_id?: string | null
          prize_name?: string | null
          prize_value?: number | null
          user_id?: string | null
          winning_number?: number | null
        }
        Relationships: []
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
      recompensas_indicacao: {
        Row: {
          criado_em: string | null
          id: string
          referencia_id: string
          status: string | null
          tipo: string
          valor: number
        }
        Insert: {
          criado_em?: string | null
          id?: string
          referencia_id: string
          status?: string | null
          tipo: string
          valor?: number
        }
        Update: {
          criado_em?: string | null
          id?: string
          referencia_id?: string
          status?: string | null
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "recompensas_indicacao_referencia_id_fkey"
            columns: ["referencia_id"]
            isOneToOne: false
            referencedRelation: "referencias"
            referencedColumns: ["id"]
          },
        ]
      }
      referencias: {
        Row: {
          codigo: string
          criado_em: string | null
          id: string
          participante_id: string
        }
        Insert: {
          codigo: string
          criado_em?: string | null
          id?: string
          participante_id: string
        }
        Update: {
          codigo?: string
          criado_em?: string | null
          id?: string
          participante_id?: string
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
      advertiser_unlocks_summary: {
        Row: {
          advertiser_id: string | null
          first_unlock_at: string | null
          last_unlock_at: string | null
          mission_id: string | null
          mission_title: string | null
          participants_unlocked: number | null
          total_rifas_spent: number | null
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_participant_unlocks_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_advertiser_role: {
        Args: { user_id: string }
        Returns: undefined
      }
      add_log: {
        Args: {
          log_type: string
          log_action: string
          log_user_id: string
          log_user_name: string
          log_details?: Json
        }
        Returns: string
      }
      add_points_to_user: {
        Args: { p_user_id: string; p_points_to_add: number }
        Returns: undefined
      }
      add_tokens_to_user: {
        Args: { user_id: string; reward: number }
        Returns: undefined
      }
      admin_reject_submission: {
        Args: { p_submission_id: string; p_admin_id: string }
        Returns: undefined
      }
      admin_return_submission_to_advertiser: {
        Args: { p_submission_id: string; p_admin_id: string }
        Returns: undefined
      }
      approve_submission_first_instance: {
        Args: { p_submission_id: string; p_advertiser_id: string }
        Returns: undefined
      }
      approve_submission_second_instance: {
        Args: { p_submission_id: string; p_advertiser_id: string }
        Returns: undefined
      }
      check_campaign_deadlines: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          advertiser_id: string
          end_date: string
          days_remaining: number
        }[]
      }
      check_high_engagement_campaigns: {
        Args: Record<PropertyKey, never>
        Returns: {
          mission_id: string
          mission_title: string
          advertiser_id: string
          submission_count: number
          hours_since_created: number
        }[]
      }
      check_low_balance_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          rifas: number
          full_name: string
          company_name: string
        }[]
      }
      check_low_conversion_campaigns: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          advertiser_id: string
          total_submissions: number
          approved_submissions: number
          conversion_rate: number
        }[]
      }
      check_participant_unlocked: {
        Args: {
          p_advertiser_id: string
          p_participant_id: string
          p_mission_id: string
        }
        Returns: boolean
      }
      check_raffle_deadlines: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_user_rifa_balance: {
        Args: { user_id: string; required_rifas: number }
        Returns: boolean
      }
      confirm_rifa_purchase: {
        Args: { p_purchase_id: string }
        Returns: Json
      }
      convert_to_advertiser: {
        Args: { user_id: string }
        Returns: undefined
      }
      count_logs_today: {
        Args: { start_date: string; end_date: string }
        Returns: number
      }
      create_campaign_and_debit_credits: {
        Args:
          | {
              p_title: string
              p_description: string
              p_type: string
              p_audience: string
              p_requirements: Json
              p_start_date: string
              p_end_date: string
              p_has_badges: boolean
              p_has_lootbox: boolean
              p_streak_bonus: boolean
              p_streak_multiplier: number
              p_random_points: boolean
              p_points_range: number[]
              p_rifas: number
              p_tickets_reward: number
              p_cashback_reward: number
              p_max_participants: number
              p_cashback_amount_per_raffle: number
              p_target_filter: Json
              p_badge_image_url: string
              p_min_purchase: number
              p_selected_loot_box_rewards: string[]
              p_form_schema: Json
            }
          | {
              p_title: string
              p_description: string
              p_type: string
              p_target_audience: string
              p_requirements: string
              p_end_date: string
              p_rifas: number
              p_tickets_reward: number
              p_cashback_reward: number
              p_max_participants: number
            }
        Returns: string
      }
      create_campaign_atomic: {
        Args: {
          p_title: string
          p_description: string
          p_type: string
          p_target_audience: string
          p_requirements: string
          p_end_date: string
          p_rifas: number
          p_tickets_reward: number
          p_cashback_reward: number
          p_max_participants: number
        }
        Returns: string
      }
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
      create_user_profile: {
        Args: {
          user_id: string
          user_email: string
          user_full_name: string
          user_type?: string
        }
        Returns: Json
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
      draw_raffle_with_winner_info: {
        Args: { p_lottery_id: string }
        Returns: Json
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
          start_date: string
          title: string
          updated_at: string | null
        }[]
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_type: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_recent_activities: {
        Args: { limit_count: number }
        Returns: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          type: string
          user_id: string | null
          user_name: string | null
        }[]
      }
      get_unlocked_missions_for_advertiser: {
        Args: { advertiser_id: string }
        Returns: {
          mission_id: string
        }[]
      }
      get_user_cashback_balance: {
        Args: { user_id: string }
        Returns: {
          cashback_balance: number
        }[]
      }
      get_user_cashback_tokens: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          user_id: string
          advertiser_id: string
          sha_code: string
          cashback_percentage: number
          status: string
          validade: string
          campaign_id: string
          created_at: string
          updated_at: string
          campaign_title: string
          advertiser_name: string
        }[]
      }
      get_user_profile: {
        Args: { user_id?: string }
        Returns: Json
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_weekly_summaries: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          full_name: string
          company_name: string
          total_campaigns: number
          total_submissions: number
          approved_submissions: number
          rifas_spent: number
        }[]
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
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_advertiser_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_notification_enabled: {
        Args: { setting_key: string }
        Returns: boolean
      }
      log_admin_notification: {
        Args: {
          p_title: string
          p_message: string
          p_target_type: string
          p_recipients_count?: number
          p_data?: Json
        }
        Returns: string
      }
      map_mission_status_for_frontend: {
        Args: { db_status: string }
        Returns: string
      }
      migrate_existing_advertiser_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      normalize_mission_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      normalize_mission_submission_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      participate_in_raffle: {
        Args: {
          p_user_id: string
          p_lottery_id: string
          p_number_of_tickets: number
        }
        Returns: Json
      }
      process_mission_rewards: {
        Args:
          | { p_submission_id: string; p_user_id: string; p_mission_id: string }
          | { p_submission_id: string; p_user_id: string; p_mission_id: string }
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
      reject_submission_second_instance: {
        Args: { p_submission_id: string; p_advertiser_id: string }
        Returns: undefined
      }
      reject_submission_to_second_instance: {
        Args: { p_submission_id: string; p_advertiser_id: string }
        Returns: undefined
      }
      reset_user_ban_by_email: {
        Args: { user_email: string }
        Returns: boolean
      }
      reset_user_ban_by_id: {
        Args: { user_id: string }
        Returns: boolean
      }
      retroactively_award_badges: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reward_participant_for_submission: {
        Args: { submission_id: string }
        Returns: undefined
      }
      send_notification_to_users: {
        Args: { p_title: string; p_message: string; p_target_type?: string }
        Returns: {
          recipients_count: number
        }[]
      }
      test_advertiser_campaigns_visibility: {
        Args: { p_advertiser_id: string }
        Returns: {
          id: string
          title: string
          advertiser_id: string
          created_by: string
          status: string
        }[]
      }
      unlock_crm_mission_details: {
        Args: { p_advertiser_id: string; p_mission_id: string }
        Returns: Json
      }
      unlock_crm_participant_details: {
        Args: { p_advertiser_id: string; p_participant_id: string }
        Returns: undefined
      }
      unlock_participant_demographics: {
        Args: {
          p_advertiser_id: string
          p_participant_id: string
          p_mission_id: string
        }
        Returns: Json
      }
      update_user_role: {
        Args: { target_user_id: string; new_role: string }
        Returns: boolean
      }
      update_user_status: {
        Args: { user_id: string; is_active: boolean }
        Returns: boolean
      }
      validate_admin_token: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_cashback_coupon: {
        Args: { p_sha_code: string; p_advertiser_id: string }
        Returns: {
          success: boolean
          message: string
          token_data: Json
        }[]
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
      validate_referral_code_direct: {
        Args: { input_code: string }
        Returns: {
          participante_id: string
          full_name: string
          active: boolean
        }[]
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
