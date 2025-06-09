
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do Supabase para testes
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
  })),
  rpc: vi.fn(),
};

// Mock do createClient
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('moderate-mission-submission Edge Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock environment variables
    vi.stubGlobal('Deno', {
      env: {
        get: vi.fn((key: string) => {
          if (key === 'SUPABASE_URL') return 'https://test.supabase.co';
          if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'test-service-role-key';
          return undefined;
        }),
      },
    });
  });

  it('should reject request when user_type is not advertiser for advertiser actions', async () => {
    // Mock authentication success
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    // Mock user profile with wrong user_type
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: { id: 'test-user-id', user_type: 'participant' },
      error: null,
    });

    // Mock request
    const mockRequest = new Request('https://test.com', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submission_id: 'test-submission-id',
        action: 'ADVERTISER_APPROVE_FIRST_INSTANCE',
      }),
    });

    // Import and execute the edge function
    const { default: handler } = await import('../../supabase/functions/moderate-mission-submission/index.ts');
    
    const response = await handler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toContain("Permission denied: User is not an 'advertiser'");
  });

  it('should allow request when user_type is advertiser for advertiser actions', async () => {
    // Mock authentication success
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    // Mock user profile with correct user_type
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: { id: 'test-user-id', user_type: 'advertiser' },
      error: null,
    });

    // Mock successful RPC call
    mockSupabaseClient.rpc.mockResolvedValue({
      data: { success: true },
      error: null,
    });

    // Mock request
    const mockRequest = new Request('https://test.com', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submission_id: 'test-submission-id',
        action: 'ADVERTISER_APPROVE_FIRST_INSTANCE',
      }),
    });

    // Import and execute the edge function
    const { default: handler } = await import('../../supabase/functions/moderate-mission-submission/index.ts');
    
    const response = await handler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('approve_submission_first_instance', {
      p_submission_id: 'test-submission-id',
      p_advertiser_id: 'test-user-id',
    });
  });

  it('should reject request when user_type is not administrador for admin actions', async () => {
    // Mock authentication success
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    // Mock user profile with wrong user_type
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: { id: 'test-user-id', user_type: 'advertiser' },
      error: null,
    });

    // Mock request
    const mockRequest = new Request('https://test.com', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submission_id: 'test-submission-id',
        action: 'ADMIN_REJECT',
      }),
    });

    // Import and execute the edge function
    const { default: handler } = await import('../../supabase/functions/moderate-mission-submission/index.ts');
    
    const response = await handler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toContain("Permission denied: User is not an 'administrador'");
  });

  it('should handle CORS preflight requests', async () => {
    const mockRequest = new Request('https://test.com', {
      method: 'OPTIONS',
    });

    // Import and execute the edge function
    const { default: handler } = await import('../../supabase/functions/moderate-mission-submission/index.ts');
    
    const response = await handler(mockRequest);

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
  });

  it('should return error for invalid action', async () => {
    // Mock authentication success
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });

    // Mock user profile
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: { id: 'test-user-id', user_type: 'advertiser' },
      error: null,
    });

    // Mock request with invalid action
    const mockRequest = new Request('https://test.com', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submission_id: 'test-submission-id',
        action: 'INVALID_ACTION',
      }),
    });

    // Import and execute the edge function
    const { default: handler } = await import('../../supabase/functions/moderate-mission-submission/index.ts');
    
    const response = await handler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe('Invalid action');
  });
});
