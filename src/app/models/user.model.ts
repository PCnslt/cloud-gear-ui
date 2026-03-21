/**
 * User model representing a Cloud-Gear.com customer.
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
  locked: boolean;
}

/**
 * User registration request DTO.
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * User login request DTO.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Authentication response DTO.
 */
export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: Date;
}

/**
 * User profile update request DTO.
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  currentPassword?: string;
  newPassword?: string;
}

/**
 * User session information.
 */
export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
  lastActivity: Date;
}

/**
 * User preferences.
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    billingAlerts: boolean;
    resourceAlerts: boolean;
  };
  billing: {
    currency: string;
    displayPrecision: number;
    monthlyReport: boolean;
  };
  ui: {
    defaultPageSize: number;
    autoRefresh: boolean;
    compactView: boolean;
  };
}