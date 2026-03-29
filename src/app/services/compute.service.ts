import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ComputeResource {
  id: number;
  productType: string;
  name: string;
  status: string;
  hourlyCost: number;
  createdAt: string;
  region: string;
  awsResourceId: string;
  computeDetails: {
    instanceType: string;
    os: string;
    diskSize: number;
    launchTime: string;
    lastAwsState: string;
  };
}

export interface ComputeCreateRequest {
  name: string;
  region: string;
  instanceType: string;
  os: string;
  diskSize: number;
}

export interface PriceEstimate {
  awsCost: number;
  awsBreakdown: {
    ec2: number;
    ebs: number;
  };
  markup: number;
  totalHourly: number;
  breakdownText: string;
}

export interface PricingOptions {
  regions: string[];
  instanceTypes: string[];
  operatingSystems: string[];
  diskSizes: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ComputeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all compute resources for the current user
  getComputeResources(): Observable<ComputeResource[]> {
    return this.http.get<ComputeResource[]>(`${this.apiUrl}/resources/compute`);
  }

  // Get a specific compute resource
  getComputeResource(id: number): Observable<ComputeResource> {
    return this.http.get<ComputeResource>(`${this.apiUrl}/resources/compute/${id}`);
  }

  // Create a new compute resource
  createComputeResource(request: ComputeCreateRequest): Observable<ComputeResource> {
    return this.http.post<ComputeResource>(`${this.apiUrl}/resources/compute`, request);
  }

  // Start a compute resource
  startComputeResource(id: number): Observable<ComputeResource> {
    return this.http.put<ComputeResource>(`${this.apiUrl}/resources/compute/${id}/start`, {});
  }

  // Stop a compute resource
  stopComputeResource(id: number): Observable<ComputeResource> {
    return this.http.put<ComputeResource>(`${this.apiUrl}/resources/compute/${id}/stop`, {});
  }

  // Terminate a compute resource
  terminateComputeResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/resources/compute/${id}`);
  }

  // Get price estimate for compute specs
  getPriceEstimate(region: string, instanceType: string, os: string, diskSize: number): Observable<PriceEstimate> {
    return this.http.get<PriceEstimate>(
      `${this.apiUrl}/resources/compute/pricing/estimate?region=${region}&instanceType=${instanceType}&os=${os}&diskSize=${diskSize}`
    );
  }

  // Get pricing options (regions, instance types, OS, disk sizes)
  getPricingOptions(): Observable<PricingOptions> {
    return this.http.get<PricingOptions>(`${this.apiUrl}/resources/compute/pricing/options`);
  }
}