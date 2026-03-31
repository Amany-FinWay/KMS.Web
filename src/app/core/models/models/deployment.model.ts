import { AgentType, DeploymentPackageType, DocumentationCategory, DocumentationResourceType, PlatformType } from "../_enums/deployment.enums";


export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface AgentPackageCreateDto {
  agentType: AgentType;
  platform: PlatformType;
  name: string;
  version: string;
  releasedAt: string;
  minimumOs: string;
  active: boolean;
  isLatest: boolean;
  packageFile: File;
}

export interface AgentPackageListDto {
  id: number;
  agentType: AgentType;
  agentTypeName: string;
  platform: PlatformType;
  platformName: string;
  name: string;
  version: string;
  sizeInMb: number;
  releasedAt: string;
  minimumOs: string;
  originalFileName: string;
  filePath: string;
  active: boolean;
  isLatest: boolean;
}

export interface DeploymentPackageCreateDto {
  name: string;
  description: string;
  version: string;
  packageType: DeploymentPackageType;
  active: boolean;
  packageFile: File;
}

export interface DeploymentPackageListDto {
  id: number;
  name: string;
  description: string;
  version: string;
  sizeInMb: number;
  packageType: DeploymentPackageType;
  packageTypeName: string;
  filePath: string;
  originalFileName: string;
  active: boolean;
}

export interface DeploymentJobCreateDto {
  deploymentPackageId: number;
  kioskIds: number[];
  notes?: string | null;
}

export interface DeploymentTargetDto {
  id: number;
  kioskId: number;
  kioskName: string;
  kioskCode: string;
  status: number;
  statusName: string;
  progressPercentage: number;
  startedAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
}

export interface DeploymentJobListDto {
  id: number;
  deploymentPackageId: number;
  deploymentPackageName: string;
  deploymentPackageVersion: string;
  status: number;
  statusName: string;
  totalTargets: number;
  completedTargets: number;
  startedAt: string;
  completedAt?: string | null;
  notes?: string | null;
}

export interface DeploymentJobDetailsDto extends DeploymentJobListDto {
  targets: DeploymentTargetDto[];
}

export interface DocumentationResourceCreateDto {
  title: string;
  description: string;
  category: DocumentationCategory;
  resourceType: DocumentationResourceType;
  url?: string | null;
  file?: File | null;
  durationInMinutes?: number | null;
  active: boolean;
}

export interface DocumentationResourceListDto {
  id: number;
  title: string;
  description: string;
  category: DocumentationCategory;
  categoryName: string;
  resourceType: DocumentationResourceType;
  resourceTypeName: string;
  url?: string | null;
  filePath?: string | null;
  originalFileName?: string | null;
  durationInMinutes?: number | null;
  active: boolean;
}