// import { HttpClient } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Observable } from 'rxjs';

// import {
//   ApiResponse,
//   AgentPackageListDto,
//   DeploymentPackageListDto,
//   DeploymentJobListDto,
//   DeploymentJobDetailsDto,
//   DocumentationResourceListDto,
// } from '../models/models/deployment.model';
// import { KioskDto, KioskFilterDto, PagedResult } from '../models/models/kioskGeneral';

// @Injectable({
//   providedIn: 'root',
// })
// export class DeploymentService {
//   private http = inject(HttpClient);
//   private base = '/api/DeploymentTab';

//   // =========================
//   // Kiosk Agent
//   // =========================

//   getAgentPackages(): Observable<ApiResponse<AgentPackageListDto[]>> {
//     return this.http.post<ApiResponse<AgentPackageListDto[]>>(
//       `${this.base}/get-all-agents`,
//       {}
//     );
//   }

//   getAgentById(id: number): Observable<ApiResponse<AgentPackageListDto>> {
//     return this.http.post<ApiResponse<AgentPackageListDto>>(
//       `${this.base}/get-agent-${id}`,
//       {}
//     );
//   }

//   createAgent(formData: FormData): Observable<ApiResponse<string>> {
//   return this.http.post<ApiResponse<string>>(
//     `${this.base}/add-agent`,
//     formData
//   );
// }

//   deleteAgent(id: number): Observable<ApiResponse<string>> {
//     return this.http.post<ApiResponse<string>>(
//       `${this.base}/delete-agent-${id}`,
//       {}
//     );
//   }

//   // =========================
//   // Deployment Packages
//   // =========================

//   getAllDeploymentPackages(): Observable<ApiResponse<DeploymentPackageListDto[]>> {
//     return this.http.post<ApiResponse<DeploymentPackageListDto[]>>(
//       `${this.base}/get-all-deployment-packages`,
//       {}
//     );
//   }

//   getDeploymentPackageById(id: number): Observable<ApiResponse<DeploymentPackageListDto>> {
//     return this.http.post<ApiResponse<DeploymentPackageListDto>>(
//       `${this.base}/get-deployment-package-${id}`,
//       {}
//     );
//   }

//   createDeploymentPackage(formData: FormData): Observable<ApiResponse<string>> {
//     return this.http.post<ApiResponse<string>>(
//       `${this.base}/add-deployment-package`,
//       formData
//     );
//   }

//   deleteDeploymentPackage(id: number): Observable<ApiResponse<string>> {
//     return this.http.post<ApiResponse<string>>(
//       `${this.base}/delete-deployment-package-${id}`,
//       {}
//     );
//   }

  

//   // =========================
//   // Deployment Jobs
//   // =========================

//   getAllJobs(): Observable<ApiResponse<DeploymentJobListDto[]>> {
//     return this.http.post<ApiResponse<DeploymentJobListDto[]>>(
//       `${this.base}/get-all-jobs`,
//       {}
//     );
//   }

//   getJobById(id: number): Observable<ApiResponse<DeploymentJobDetailsDto>> {
//     return this.http.post<ApiResponse<DeploymentJobDetailsDto>>(
//       `${this.base}/get-job-${id}`,
//       {}
//     );
//   }

//   createDeploymentJob(payload: unknown): Observable<ApiResponse<string>> {
//     return this.http.post<ApiResponse<string>>(
//       `${this.base}/add-deployment-job`,
//       payload
//     );
//   }

//   deleteJob(id: number): Observable<ApiResponse<string>> {
//     return this.http.post<ApiResponse<string>>(
//       `${this.base}/delete-job-${id}`,
//       {}
//     );
//   }

//   // =========================
//   // Documentation Resources
//   // =========================

// getAllDocumentationResources(): Observable<ApiResponse<DocumentationResourceListDto[]>> {
//   return this.http.post<ApiResponse<DocumentationResourceListDto[]>>(
//     `${this.base}/get-all-documenation-resources`,
//     {}
//   );
// }

//   createDocumentationResource(formData: FormData): Observable<ApiResponse<string>> {
//   return this.http.post<ApiResponse<string>>(
//     `${this.base}/create-documenation`,
//     formData
//   );
// }

// getDocumentationResourceById(id: number): Observable<ApiResponse<DocumentationResourceListDto>> {
//   return this.http.post<ApiResponse<DocumentationResourceListDto>>(
//     `${this.base}/get-documenation-resource-${id}`,
//     {}
//   );
// }

// deleteDocumentationResource(id: number): Observable<ApiResponse<string>> {
//   return this.http.post<ApiResponse<string>>(
//     `${this.base}/delete-documenation-resouce-${id}`,
//     {}
//   );
// }

  

//   // =========================
//   // Helpers
//   // =========================

// downloadFile(filePath: string): void {
//   if (!filePath) return;

//   const encodedPath = encodeURIComponent(filePath);

//   this.http
//     .get(`/api/Files/download?path=${encodedPath}`, {
//       responseType: 'blob',
//     })
//     .subscribe({
//       next: (blob) => {
//         const url = window.URL.createObjectURL(blob);

//         const a = document.createElement('a');
//         a.href = url;

//         // اسم الملف
//         const fileName = filePath.split('\\').pop() || 'download.zip';
//         a.download = fileName;

//         a.click();
//         window.URL.revokeObjectURL(url);
//       },
//       error: (err) => {
//         console.error('Download failed:', err);
//       },
//     });
// }


// getAllKiosks(filter: KioskFilterDto): Observable<ApiResponse<PagedResult<KioskDto>>> {
//   return this.http.post<ApiResponse<PagedResult<KioskDto>>>(
//     `/api/KioskDashboard/get-all`,
//     filter
//   );
// }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiResponse,
  AgentPackageListDto,
  DeploymentPackageListDto,
  DeploymentJobListDto,
  DeploymentJobDetailsDto,
  DocumentationResourceListDto,
} from '../models/models/deployment.model';
import { KioskDto, KioskFilterDto, PagedResult } from '../models/models/kioskGeneral';

@Injectable({
  providedIn: 'root',
})
export class DeploymentService {
  private http = inject(HttpClient);
  private base = '/api/DeploymentTab';

  // =========================
  // Kiosk Agent
  // =========================

  getAgentPackages(): Observable<ApiResponse<AgentPackageListDto[]>> {
    return this.http.post<ApiResponse<AgentPackageListDto[]>>(
      `${this.base}/get-all-agents`,
      {}
    );
  }

  getAgentById(id: number): Observable<ApiResponse<AgentPackageListDto>> {
    return this.http.post<ApiResponse<AgentPackageListDto>>(
      `${this.base}/get-agent-${id}`,
      {}
    );
  }

  createAgent(formData: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.base}/add-agent`,
      formData
    );
  }

  deleteAgent(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.base}/delete-agent-${id}`,
      {}
    );
  }

  // =========================
  // Deployment Packages
  // =========================

  getAllDeploymentPackages(): Observable<ApiResponse<DeploymentPackageListDto[]>> {
    return this.http.post<ApiResponse<DeploymentPackageListDto[]>>(
      `${this.base}/get-all-deployment-packages`,
      {}
    );
  }

  getDeploymentPackageById(id: number): Observable<ApiResponse<DeploymentPackageListDto>> {
    return this.http.post<ApiResponse<DeploymentPackageListDto>>(
      `${this.base}/get-deployment-package-${id}`,
      {}
    );
  }

  createDeploymentPackage(formData: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.base}/add-deployment-package`,
      formData
    );
  }

  deleteDeploymentPackage(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.base}/delete-deployment-package-${id}`,
      {}
    );
  }

  // =========================
  // Deployment Jobs
  // =========================

  getAllJobs(): Observable<ApiResponse<DeploymentJobListDto[]>> {
    return this.http.post<ApiResponse<DeploymentJobListDto[]>>(
      `${this.base}/get-all-jobs`,
      {}
    );
  }

  getJobById(id: number): Observable<ApiResponse<DeploymentJobDetailsDto>> {
    return this.http.post<ApiResponse<DeploymentJobDetailsDto>>(
      `${this.base}/get-job-${id}`,
      {}
    );
  }

  createDeploymentJob(payload: {
    deploymentPackageId: number;
    kioskIds: number[];
    notes?: string | null;
  }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.base}/add-deployment-job`,
      payload
    );
  }

  deleteJob(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.base}/delete-job-${id}`,
      {}
    );
  }

  // =========================
  // Documentation Resources
  // =========================

  getAllDocumentationResources(): Observable<ApiResponse<DocumentationResourceListDto[]>> {
    return this.http.post<ApiResponse<DocumentationResourceListDto[]>>(
      `${this.base}/get-all-documenation-resources`,
      {}
    );
  }

  createDocumentationResource(formData: FormData): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.base}/create-documenation`,
      formData
    );
  }

  getDocumentationResourceById(id: number): Observable<ApiResponse<DocumentationResourceListDto>> {
    return this.http.post<ApiResponse<DocumentationResourceListDto>>(
      `${this.base}/get-documenation-resource-${id}`,
      {}
    );
  }

  deleteDocumentationResource(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.base}/delete-documenation-resouce-${id}`,
      {}
    );
  }

  // =========================
  // Kiosks
  // =========================

  getAllKiosks(filter: KioskFilterDto): Observable<ApiResponse<PagedResult<KioskDto>>> {
    return this.http.post<ApiResponse<PagedResult<KioskDto>>>(
      `/api/KioskDashboard/get-all`,
      filter
    );
  }

  // =========================
  // Helpers
  // =========================

  downloadFile(filePath: string): void {
    if (!filePath) return;

    const encodedPath = encodeURIComponent(filePath);

    this.http
      .get(`/api/Files/download?path=${encodedPath}`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;

          const fileName = filePath.split('\\').pop() || 'download.zip';
          a.download = fileName;

          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Download failed:', err);
        },
      });
  }
}