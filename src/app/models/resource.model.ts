/**
 * Product type enum.
 */
export enum ProductType {
  COMPUTE = 'COMPUTE',
  STORAGE = 'STORAGE',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK'
}

/**
 * Compute status enum.
 */
export enum ComputeStatus {
  PENDING = 'PENDING',
  PROVISIONING = 'PROVISIONING',
  RUNNING = 'RUNNING',
  STOPPING = 'STOPPING',
  STOPPED = 'STOPPED',
  TERMINATING = 'TERMINATING',
  TERMINATED = 'TERMINATED',
  ERROR = 'ERROR'
}

/**
 * Base resource interface for all product types.
 */
export interface Resource {
  id: number;
  userId: number;
  productType: ProductType;
  name: string;
  status: string;
  hourlyCost: number;
  awsResourceId?: string;
  region: string;
  createdAt: Date;
  lastUpdated: Date;
  startedAt?: Date;
  stoppedAt?: Date;
  terminatedAt?: Date;
  totalRunningHours: number;
  monthlyRunningHours: number;
  metadata?: any;
}

/**
 * Compute resource details.
 */
export interface ComputeDetails {
  id: number;
  resourceId: number;
  instanceType: string;
  os: string;
  diskSize: number;
  launchTime?: Date;
  lastAwsState?: string;
  amiId?: string;
  architecture?: string;
  vcpuCount?: number;
  memoryGb?: number;
}

/**
 * Complete compute resource with both base and compute details.
 */
export interface ComputeResource {
  resource: Resource;
  computeDetails: ComputeDetails;
}

/**
 * Create compute resource request.
 */
export interface CreateComputeRequest {
  name: string;
  region: string;
  instanceType: string;
  os: string;
  diskSize: number;
}

/**
 * Resource action request.
 */
export interface ResourceActionRequest {
  resourceId: number;
  action: 'start' | 'stop' | 'terminate';
}

/**
 * Resource status update.
 */
export interface ResourceStatusUpdate {
  resourceId: number;
  status: string;
  lastAwsState?: string;
  updatedAt: Date;
}

/**
 * Resource metrics for monitoring.
 */
export interface ResourceMetrics {
  resourceId: number;
  cpuUsage?: number;
  memoryUsage?: number;
  diskUsage?: number;
  networkIn?: number;
  networkOut?: number;
  timestamp: Date;
}

/**
 * Resource filter options.
 */
export interface ResourceFilter {
  productType?: ProductType;
  status?: string[];
  region?: string[];
  search?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Paginated resource response.
 */
export interface PaginatedResources {
  items: Resource[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Resource creation response.
 */
export interface ResourceCreationResponse {
  resource: Resource;
  computeDetails?: ComputeDetails;
  message: string;
  estimatedLaunchTime?: Date;
}

/**
 * Resource action response.
 */
export interface ResourceActionResponse {
  success: boolean;
  message: string;
  resourceId: number;
  newStatus: string;
  actionPerformed: string;
  timestamp: Date;
}