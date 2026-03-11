import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {LucideAngularModule, CreditCard, MessageSquare, Webhook, Shield, Ticket, Save,RefreshCw,ChevronDown,CircleAlert
} from 'lucide-angular';

const icons = {
  CreditCard, MessageSquare, Webhook, Shield,Ticket,Save, RefreshCw, ChevronDown,CircleAlert
};

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './integrations.component.html'
})
export class IntegrationsComponent {
  readonly iconList = icons;

  stripeEnabled = signal(true);
  paypalEnabled = signal(false);
  squareEnabled = signal(false);

  twilioEnabled = signal(true);
  vonageEnabled = signal(false);
  awsEnabled = signal(false);

  stripeApiKey = '••••••••••••••••••••••••';
  stripeWebhookSecret = '••••••••••••••••';
  stripeCurrency = 'USD';

  twilioAccountSid = 'AC••••••••••••••••••••••••••';
  twilioAuthToken = '••••••••••••••••••••••••';
  twilioPhoneNumber = '+1234567890';

  paymentWebhook = 'https://your-domain.com/webhooks/payment-success';
  smsWebhook = 'https://your-domain.com/webhooks/sms-delivery';

  identityProvider = 'None';
  ticketingSystem = 'None';

  currencies = ['USD', 'EUR', 'GBP'];
  identityProviders = ['None', 'Okta', 'Auth0', 'Azure AD'];
  ticketingSystems = ['None', 'Zendesk', 'Freshdesk', 'Jira'];

  toggleSignal(signalRef: ReturnType<typeof signal<boolean>>) {
    signalRef.update((value) => !value);
  }

  testConnection(type: string) {
    console.log('Test connection:', type);
  }

  saveAllSettings() {
    console.log('Save all settings');
  }
}