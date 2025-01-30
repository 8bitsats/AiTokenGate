interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const API_BASE_URL = '/api';

export interface RegisterUserData {
  username: string;
  walletAddress: string;
  verificationToken: string;
  twitterHandle?: string;
  telegramHandle?: string;
  discordId?: string;
}

export interface VerifyUserData {
  walletAddress: string;
  verificationToken: string;
}

export interface UserData {
  username: string;
  walletAddress: string;
  isVerified: boolean;
  twitterHandle?: string;
  telegramHandle?: string;
  discordId?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async registerUser(data: RegisterUserData): Promise<ApiResponse<UserData>> {
    return this.request<UserData>('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyUser(data: VerifyUserData): Promise<ApiResponse<UserData>> {
    return this.request<UserData>('/users/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUser(walletAddress: string): Promise<ApiResponse<UserData>> {
    return this.request<UserData>(`/users/${walletAddress}`);
  }

  async checkUsername(username: string): Promise<ApiResponse<{ available: boolean }>> {
    return this.request<{ available: boolean }>(`/users/check-username/${username}`);
  }
}

export const api = new ApiService();
