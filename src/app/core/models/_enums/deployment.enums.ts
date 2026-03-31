export enum AgentType {
  KioskAgent = 1,
  DigitalSignageAgent = 2,
}

export enum PlatformType {
  WindowsX64 = 1,
  WindowsX86 = 2,
  LinuxX64 = 3,
  Android = 4,
  RaspberryPiOS = 5,
}

export enum LicenseTier {
  Basic = 1,
  Professional = 2,
  Enterprise = 3,
  Unlimited = 4,
}

export enum LicenseStatus {
  Active = 1,
  Expired = 2,
  Suspended = 3,
  Pending = 4,
}

export enum DeploymentPackageType {
  Software = 1,
  Update = 2,
  SecurityPatch = 3,
  Configuration = 4,
}

export enum DeploymentTargetStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Failed = 4,
  Cancelled = 5,
}

export enum DeploymentJobStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Failed = 4,
  Cancelled = 5,
}

export enum DocumentationResourceType {
  PdfDocument = 1,
  VideoTutorial = 2,
  ExternalLink = 3,
  APIDocumenation = 4,
}

export enum DocumentationCategory {
  GettingStarted = 1,
  UserGuide = 2,
  VideoTutorial = 3,
  AdditionalSupport = 4,
}