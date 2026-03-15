export interface StatusResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface IntegrationSettingsPageDto {
  paymentGateways: PaymentGatewaysDto;
  smsGateways: SmsGatewaysDto;
  webhookUrls: WebhookUrlsDto;
  identityProvider: IdentityProviderDto;
  ticketingSystem: TicketingSystemDto;
}

export interface PaymentGatewaysDto {
  stripe: StripeSettingsDto;
  payPal: PayPalSettingsDto;
  square: SquareSettingsDto;
}

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

export interface SmsGatewaysDto {
  twilio: TwilioSettingsDto;
  vonage: VonageSettingsDto;
  awsSns: AwsSnsSettingsDto;
}

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

export interface WebhookUrlsDto {
  paymentSuccessWebhook: string;
  smsDeliveryWebhook: string;
}

export interface IdentityProviderDto {
  type: number;
  isEnabled: boolean;
  ldap: LdapSettingsDto;
  microsoft: MicrosoftIdentitySettingsDto;
}

export interface LdapSettingsDto {
  serverUrl: string;
  baseDn: string;
  bindDn: string;
  bindPassword: string;
  searchFilter: string;
}

export interface MicrosoftIdentitySettingsDto {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TicketingSystemDto {
  type: number;
  isEnabled: boolean;
  remedy: RemedySettingsDto;
  fts: FtsSettingsDto;
}

export interface RemedySettingsDto {
  serverUrl: string;
  username: string;
  password: string;
  queue: string;
}

export interface FtsSettingsDto {
  serverUrl: string;
  apiKey: string;
  organizationId: string;
}