import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  CreditCard,
  MessageSquare,
  Webhook,
  Shield,
  Ticket,
  Save,
  RefreshCw,
  ChevronDown,
  CircleAlert
} from 'lucide-angular';
import { IntegrationSettingsService } from '../../core/services/integration-settings.service';
import { IntegrationSettingsPageDto } from '../../core/models/models/integrations-settings.model';


const icons = {
  CreditCard,
  MessageSquare,
  Webhook,
  Shield,
  Ticket,
  Save,
  RefreshCw,
  ChevronDown,
  CircleAlert
};

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './integrations.component.html'
})
export class IntegrationsComponent implements OnInit {
  private integrationService = inject(IntegrationSettingsService);

  readonly iconList = icons;

  loading = signal(false);

  stripeEnabled = signal(true);
  paypalEnabled = signal(false);
  squareEnabled = signal(false);

  twilioEnabled = signal(true);
  vonageEnabled = signal(false);
  awsEnabled = signal(false);

  stripeApiKey = '';
  stripeWebhookSecret = '';
  stripeCurrency = 'USD';

  paypalClientId = '';
  paypalClientSecret = '';
  paypalMode = 'live';

  squareApplicationId = '';
  squareAccessToken = '';
  squareLocationId = '';

  twilioAccountSid = '';
  twilioAuthToken = '';
  twilioPhoneNumber = '';

  vonageApiKey = '';
  vonageApiSecret = '';
  vonageFromNumber = '';

  awsAccessKeyId = '';
  awsSecretAccessKey = '';
  awsRegion = 'us-east-1';

  paymentWebhook = '';
  smsWebhook = '';

  identityProvider = 'None';
  ticketingSystem = 'None';

  currencies = ['USD', 'EUR', 'GBP'];
  identityProviders = ['None', 'LDAP', 'Microsoft'];
  ticketingSystems = ['Remedy', 'FTS'];

  ngOnInit(): void {
    this.loadSettings();
  }

  toggleSignal(signalRef: WritableSignal<boolean>) {
    signalRef.update(value => !value);
  }

  testConnection(type: string) {
    console.log('Test connection:', type);
  }

  loadSettings() {
    this.loading.set(true);

    this.integrationService.getSettings().subscribe({
      next: (res) => {
        this.loading.set(false);

        console.log('Integration settings response:', res);

        if (!res?.status || !res?.data) {
          return;
        }

        const data = res.data;

        this.stripeEnabled.set(data.paymentGateways?.stripe?.isEnabled ?? false);
        this.stripeApiKey = data.paymentGateways?.stripe?.apiKey ?? '';
        this.stripeWebhookSecret = data.paymentGateways?.stripe?.webhookSecret ?? '';
        this.stripeCurrency = data.paymentGateways?.stripe?.currency ?? 'USD';

        this.paypalEnabled.set(data.paymentGateways?.payPal?.isEnabled ?? false);
        this.paypalClientId = data.paymentGateways?.payPal?.clientId ?? '';
        this.paypalClientSecret = data.paymentGateways?.payPal?.clientSecret ?? '';
        this.paypalMode = data.paymentGateways?.payPal?.mode ?? 'live';

        this.squareEnabled.set(data.paymentGateways?.square?.isEnabled ?? false);
        this.squareApplicationId = data.paymentGateways?.square?.applicationId ?? '';
        this.squareAccessToken = data.paymentGateways?.square?.accessToken ?? '';
        this.squareLocationId = data.paymentGateways?.square?.locationId ?? '';

        this.twilioEnabled.set(data.smsGateways?.twilio?.isEnabled ?? false);
        this.twilioAccountSid = data.smsGateways?.twilio?.accountSid ?? '';
        this.twilioAuthToken = data.smsGateways?.twilio?.authToken ?? '';
        this.twilioPhoneNumber = data.smsGateways?.twilio?.phoneNumber ?? '';

        this.vonageEnabled.set(data.smsGateways?.vonage?.isEnabled ?? false);
        this.vonageApiKey = data.smsGateways?.vonage?.apiKey ?? '';
        this.vonageApiSecret = data.smsGateways?.vonage?.apiSecret ?? '';
        this.vonageFromNumber = data.smsGateways?.vonage?.fromNumber ?? '';

        this.awsEnabled.set(data.smsGateways?.awsSns?.isEnabled ?? false);
        this.awsAccessKeyId = data.smsGateways?.awsSns?.accessKeyId ?? '';
        this.awsSecretAccessKey = data.smsGateways?.awsSns?.secretAccessKey ?? '';
        this.awsRegion = data.smsGateways?.awsSns?.region ?? 'us-east-1';

        this.paymentWebhook = data.webhookUrls?.paymentSuccessWebhook ?? '';
        this.smsWebhook = data.webhookUrls?.smsDeliveryWebhook ?? '';

        this.identityProvider = this.mapIdentityProviderTypeToName(data.identityProvider?.type ?? 0);
        this.ticketingSystem = this.mapTicketingSystemTypeToName(data.ticketingSystem?.type ?? 0);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Load settings failed', err);
      }
    });
  }

  saveAllSettings() {
    const dto: IntegrationSettingsPageDto = {
      paymentGateways: {
        stripe: {
          isEnabled: this.stripeEnabled(),
          apiKey: this.stripeApiKey,
          webhookSecret: this.stripeWebhookSecret,
          currency: this.stripeCurrency
        },
        payPal: {
          isEnabled: this.paypalEnabled(),
          clientId: this.paypalClientId,
          clientSecret: this.paypalClientSecret,
          mode: this.paypalMode
        },
        square: {
          isEnabled: this.squareEnabled(),
          applicationId: this.squareApplicationId,
          accessToken: this.squareAccessToken,
          locationId: this.squareLocationId
        }
      },
      smsGateways: {
        twilio: {
          isEnabled: this.twilioEnabled(),
          accountSid: this.twilioAccountSid,
          authToken: this.twilioAuthToken,
          phoneNumber: this.twilioPhoneNumber
        },
        vonage: {
          isEnabled: this.vonageEnabled(),
          apiKey: this.vonageApiKey,
          apiSecret: this.vonageApiSecret,
          fromNumber: this.vonageFromNumber
        },
        awsSns: {
          isEnabled: this.awsEnabled(),
          accessKeyId: this.awsAccessKeyId,
          secretAccessKey: this.awsSecretAccessKey,
          region: this.awsRegion
        }
      },
      webhookUrls: {
        paymentSuccessWebhook: this.paymentWebhook,
        smsDeliveryWebhook: this.smsWebhook
      },
      identityProvider: {
        type: this.mapIdentityProviderNameToType(this.identityProvider),
        isEnabled: this.identityProvider !== 'None',
        ldap: {
          serverUrl: '',
          baseDn: '',
          bindDn: '',
          bindPassword: '',
          searchFilter: ''
        },
        microsoft: {
          tenantId: '',
          clientId: '',
          clientSecret: '',
          redirectUri: ''
        }
      },
      ticketingSystem: {
        type: this.mapTicketingSystemNameToType(this.ticketingSystem),
        isEnabled: this.ticketingSystem !== 'None',
        remedy: {
          serverUrl: '',
          username: '',
          password: '',
          queue: ''
        },
        fts: {
          serverUrl: '',
          apiKey: '',
          organizationId: ''
        }
      }
    };

    console.log('Save DTO:', dto);

    this.integrationService.saveSettings(dto).subscribe({
      next: (res) => {
        console.log('Save response:', res);

        if (res?.status) {
          alert(res.message || 'Settings saved successfully');
        } else {
          alert(res?.message || 'Save failed');
        }
      },
      error: (err) => {
        console.error('Save settings failed', err);
        alert('Save failed');
      }
    });
  }

  mapIdentityProviderTypeToName(type: number): string {
    switch (type) {
      case 1:
        return 'LDAP';
      case 2:
        return 'Microsoft';
      default:
        return 'None';
    }
  }

  mapIdentityProviderNameToType(name: string): number {
    switch (name) {
      case 'LDAP':
        return 1;
      case 'Microsoft':
        return 2;
      default:
        return 0;
    }
  }

  mapTicketingSystemTypeToName(type: number): string {
    switch (type) {
      case 1:
        return 'Remedy';
      case 2:
        return 'FTS';
      default:
        return 'Remedy';
    }
  }

  mapTicketingSystemNameToType(name: string): number {
    switch (name) {
      case 'FTS':
        return 2;
      case 'Remedy':
      default:
        return 1;
    }
  }
}