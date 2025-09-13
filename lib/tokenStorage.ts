interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface TokenData {
  token: string;
  expiresAt: number;
  rememberMe: boolean;
  user?: User;
}

export const TOKEN_STORAGE_KEY = 'lifeconnect-secret-key';

export class TokenStorage {
  static setToken(token: string, rememberMe: boolean = false, user?: User): void {
    const expirationDays = rememberMe ? 30 : 7;
    const expiresAt = Date.now() + (expirationDays * 24 * 60 * 60 * 1000);
    
    const tokenData: TokenData = {
      token,
      expiresAt,
      rememberMe,
      user
    };
    
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
  }
  
  static getToken(): string | null {
    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!stored) return null;
      
      const tokenData: TokenData = JSON.parse(stored);
      
      // Check if token has expired
      if (Date.now() > tokenData.expiresAt) {
        this.removeToken();
        return null;
      }
      
      return tokenData.token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      this.removeToken();
      return null;
    }
  }
  
  static removeToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  
  static isTokenExpired(): boolean {
    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!stored) return true;
      
      const tokenData: TokenData = JSON.parse(stored);
      return Date.now() > tokenData.expiresAt;
    } catch (error) {
      return true;
    }
  }
  
  static getRemainingTime(): number {
    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!stored) return 0;
      
      const tokenData: TokenData = JSON.parse(stored);
      const remaining = tokenData.expiresAt - Date.now();
      return Math.max(0, remaining);
    } catch (error) {
      return 0;
    }
  }
  
  static getTokenInfo(): TokenData | null {
    try {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!stored) return null;
      
      return JSON.parse(stored);
    } catch (error) {
      return null;
    }
  }

  static getUser(): User | null {
    try {
      const tokenData = this.getTokenInfo();
      return tokenData?.user || null;
    } catch (error) {
      return null;
    }
  }

  static setUser(user: User): void {
    try {
      const tokenData = this.getTokenInfo();
      if (tokenData) {
        tokenData.user = user;
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
      }
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }
}