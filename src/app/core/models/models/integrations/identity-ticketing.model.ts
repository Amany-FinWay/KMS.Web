// --- Identity Provider ---
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

export interface IdentityProviderDto {
  type: number;
  isEnabled: boolean;
  ldap: LdapSettingsDto;
  microsoft: MicrosoftIdentitySettingsDto;
}

// --- Ticketing System ---
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

export interface TicketingSystemDto {
  type: number;
  isEnabled: boolean;
  remedy: RemedySettingsDto;
  fts: FtsSettingsDto;
}