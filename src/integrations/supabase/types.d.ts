
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
      // Add other table definitions if needed
      raffles: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          points: number
          numbers_total: number
          status: 'active' | 'pending' | 'completed' | 'canceled' | 'draft' | 'finished'
          start_date: string
          end_date: string
          draw_date: string
          prize_type: string
          prize_value: number
          detailed_description?: string
          numbers: {
            id: string
          }[]
          winner_user_id?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          points: number
          numbers_total: number
          status?: 'active' | 'pending' | 'completed' | 'canceled' | 'draft' | 'finished'
          start_date: string
          end_date: string
          draw_date: string
          prize_type: string
          prize_value: number
          detailed_description?: string
          numbers?: {
            id: string
          }[]
          winner_user_id?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          points?: number
          numbers_total?: number
          status?: 'active' | 'pending' | 'completed' | 'canceled' | 'draft' | 'finished'
          start_date?: string
          end_date?: string
          draw_date?: string
          prize_type?: string
          prize_value?: number
          detailed_description?: string
          numbers?: {
            id: string
          }[]
          winner_user_id?: string
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
