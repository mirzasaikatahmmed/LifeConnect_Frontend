
export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define the user type based on your API response
export interface UserData {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  bloodType: string;
  userType: string;
  role: Role;
  roleId: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
// Define the complete API response structure
export interface ApiResponse {
  access_token: string;
  admin: UserData;
}