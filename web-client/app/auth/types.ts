// Form types
export interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export interface IFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  general?: string;
}

export interface ConformUser {
  email: string;
  role: string;
  password: string;
  username?: string;
}

// Social providers
export enum SocialProviders {
  GOOGLE = "google",
}

export interface SocialProvider {
  name: SocialProviders;
  label: string;
  enabled: boolean;
  redirectUrl: string;
}

// OTP
export interface OTPDialogProps {
  open: boolean;
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  onClose: () => void;
  isLoading: boolean;
}
