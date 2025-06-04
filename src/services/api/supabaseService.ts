import { supabase } from '@/integrations/supabase/client';

// Base service class with common functionality
class BaseSupabaseService {
  protected handleError(error: any): never {
    console.error('Supabase service error:', error);
    throw new Error(error.message || 'An unexpected error occurred');
  }

  protected async executeQuery<T = any>(query: any): Promise<T> {
    const { data, error } = await query;
    if (error) this.handleError(error);
    // Some Supabase methods (e.g., signOut) return only an error key
    return data as T;
  }
}

// Auth service
export class AuthService extends BaseSupabaseService {
  async signIn(email: string, password: string) {
    return this.executeQuery(
      supabase.auth.signInWithPassword({ email, password })
    );
  }

  async signUp(email: string, password: string, metadata?: any) {
    return this.executeQuery(
      supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: metadata } 
      })
    );
  }

  async signOut() {
    return this.executeQuery(supabase.auth.signOut());
  }

  async getSession() {
    return this.executeQuery(supabase.auth.getSession());
  }
}

// Missions service
export class MissionsService extends BaseSupabaseService {
  async getMissions(filters?: { userId?: string; isActive?: boolean }) {
    let query = supabase
      .from('missions')
      .select('*');

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters?.userId) {
      query = query.eq('advertiser_id', filters.userId);
    }

    return this.executeQuery(query.order('created_at', { ascending: false }));
  }

  async createMission(missionData: any) {
    return this.executeQuery(
      supabase.from('missions').insert(missionData).select().single()
    );
  }

  async submitMission(submissionData: any) {
    return this.executeQuery(
      supabase.from('mission_submissions').insert(submissionData).select().single()
    );
  }
}

// Profiles service
export class ProfilesService extends BaseSupabaseService {
  async getProfile(userId: string) {
    return this.executeQuery(
      supabase.from('profiles').select('*').eq('id', userId).single()
    );
  }

  async updateProfile(userId: string, profileData: any) {
    return this.executeQuery(
      supabase.from('profiles').update(profileData).eq('id', userId).select().single()
    );
  }
}

// Service instances - Singleton pattern
export const authService = new AuthService();
export const missionsService = new MissionsService();
export const profilesService = new ProfilesService();
