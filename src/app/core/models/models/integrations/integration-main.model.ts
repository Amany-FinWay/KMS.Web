import { PaymentGatewaysDto, SmsGatewaysDto } from './gateways.model';
import { IdentityProviderDto, TicketingSystemDto } from './identity-ticketing.model';

export interface WebhookUrlsDto {
  paymentSuccessWebhook: string;
  smsDeliveryWebhook: string;
}

export interface IntegrationSettingsPageDto {
  paymentGateways: PaymentGatewaysDto;
  smsGateways: SmsGatewaysDto;
  webhookUrls: WebhookUrlsDto;
  identityProvider: IdentityProviderDto;
  ticketingSystem: TicketingSystemDto;
}