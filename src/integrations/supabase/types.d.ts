
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          user_type: string | null
          email: string | null
          phone: string | null
          website: string | null
          description: string | null
          points: number | null
          credits: number | null
          profile_completed: boolean | null
          profile_data: Json | null
          email_notifications: boolean | null
          push_notifications: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          user_type?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          description?: string | null
          points?: number | null
          credits?: number | null
          profile_completed?: boolean | null
          profile_data?: Json | null
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          user_type?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          description?: string | null
          points?: number | null
          credits?: number | null
          profile_completed?: boolean | null
          profile_data?: Json | null
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      missions: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          points: number
          requirements: Json | null
          advertiser_id: string | null
          start_date: string | null
          end_date: string | null
          is_active: boolean | null
          business_type: string | null
          target_audience_gender: string | null
          target_audience_age_min: number | null
          target_audience_age_max: number | null
          target_audience_region: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          points?: number
          requirements?: Json | null
          advertiser_id?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean | null
          business_type?: string | null
          target_audience_gender?: string | null
          target_audience_age_min?: number | null
          target_audience_age_max?: number | null
          target_audience_region?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          points?: number
          requirements?: Json | null
          advertiser_id?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean | null
          business_type?: string | null
          target_audience_gender?: string | null
          target_audience_age_min?: number | null
          target_audience_age_max?: number | null
          target_audience_region?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      mission_submissions: {
        Row: {
          id: string
          mission_id: string | null
          user_id: string | null
          submission_data: Json | null
          status: string | null
          feedback: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          mission_id?: string | null
          user_id?: string | null
          submission_data?: Json | null
          status?: string | null
          feedback?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          mission_id?: string | null
          user_id?: string | null
          submission_data?: Json | null
          status?: string | null
          feedback?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
      }
      cashback_campaigns: {
        Row: {
          id: string
          title: string
          description: string | null
          advertiser_id: string | null
          advertiser_name: string | null
          advertiser_logo: string | null
          advertiser_image: string | null
          discount_percentage: number
          min_purchase: number | null
          conditions: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          advertiser_id?: string | null
          advertiser_name?: string | null
          advertiser_logo?: string | null
          advertiser_image?: string | null
          discount_percentage: number
          min_purchase?: number | null
          conditions?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          advertiser_id?: string | null
          advertiser_name?: string | null
          advertiser_logo?: string | null
          advertiser_image?: string | null
          discount_percentage?: number
          min_purchase?: number | null
          conditions?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          expires_at?: string | null
        }
      }
      cashback_redemptions: {
        Row: {
          id: string
          campaign_id: string | null
          user_id: string | null
          amount: number
          status: string | null
          code: string | null
          created_at: string | null
          redeemed_at: string | null
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          user_id?: string | null
          amount: number
          status?: string | null
          code?: string | null
          created_at?: string | null
          redeemed_at?: string | null
        }
        Update: {
          id?: string
          campaign_id?: string | null
          user_id?: string | null
          amount?: number
          status?: string | null
          code?: string | null
          created_at?: string | null
          redeemed_at?: string | null
        }
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
