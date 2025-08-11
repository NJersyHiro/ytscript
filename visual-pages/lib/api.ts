// API Service placeholder for visual demonstration
export interface ApiError {
  error: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export function isApiError(response: any): response is ApiError {
  return response && typeof response.error === 'string';
}

export const apiService = {
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    // Mock login
    return {
      data: {
        user: {
          id: '1',
          name: 'Demo User',
          email: email,
          subscription_status: 'free'
        },
        access_token: 'mock-token',
        refresh_token: 'mock-refresh'
      }
    };
  },

  async register(name: string, email: string, password: string): Promise<ApiResponse<any>> {
    // Mock register
    return {
      data: {
        user: {
          id: '1',
          name: name,
          email: email,
          subscription_status: 'free'
        },
        access_token: 'mock-token',
        refresh_token: 'mock-refresh'
      }
    };
  },

  async logout(): Promise<void> {
    // Mock logout
    return Promise.resolve();
  },

  async getProfile(): Promise<ApiResponse<any>> {
    // Mock profile
    return {
      data: {
        user: {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          subscription_status: 'free'
        }
      }
    };
  },

  async refreshToken(token: string): Promise<ApiResponse<any>> {
    // Mock refresh
    return {
      data: {
        access_token: 'new-mock-token'
      }
    };
  },

  async getUsageStats(): Promise<ApiResponse<any>> {
    // Mock usage stats
    return {
      data: {
        period: 'month',
        total_requests: 150,
        total_tokens: 45000,
        total_cost: 2.50,
        tier: 'free'
      }
    };
  },

  async getRecentJobs(): Promise<ApiResponse<any>> {
    // Mock recent jobs
    return {
      data: []
    };
  },

  async getSubscriptionDetails(): Promise<ApiResponse<any>> {
    // Mock subscription
    return {
      data: {
        plan: 'free',
        status: 'active'
      }
    };
  }
};