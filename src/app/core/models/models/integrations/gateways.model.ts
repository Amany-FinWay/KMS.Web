// --- Payment Gateways ---
export interface StripeSettingsDto {
  isEnabled: boolean;
  apiKey: string;
  webhookSecret: string;
  currency: string;
}

export interface PayPalSettingsDto {
  isEnabled: boolean;
  clientId: string;
  clientSecret: string;
  mode: string;
}

export interface SquareSettingsDto {
  isEnabled: boolean;
  applicationId: string;
  accessToken: string;
  locationId: string;
}

export interface PaymentGatewaysDto {
  stripe: StripeSettingsDto;
  payPal: PayPalSettingsDto;
  square: SquareSettingsDto;
}

// --- SMS Gateways ---
export interface TwilioSettingsDto {
  isEnabled: boolean;
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface VonageSettingsDto {
  isEnabled: boolean;
  apiKey: string;
  apiSecret: string;
  fromNumber: string;
}

export interface AwsSnsSettingsDto {
  isEnabled: boolean;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface SmsGatewaysDto {
  twilio: TwilioSettingsDto;
  vonage: VonageSettingsDto;
  awsSns: AwsSnsSettingsDto;
}