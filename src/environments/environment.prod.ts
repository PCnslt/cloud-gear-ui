export const environment = {
  production: true,
  
  // API Configuration
  apiUrl: 'https://api.cloud-gear.com/api',
  apiVersion: 'v1',
  
  // Application Configuration
  appName: 'Cloud-Gear.com',
  appDescription: 'Transparent cloud services with AWS cost + 20% markup',
  appVersion: '1.0.0',
  
  // Feature Flags
  features: {
    compute: true,
    storage: false,
    database: false,
    billing: true,
    realTimePricing: true
  },
  
  // AWS Configuration (for frontend display only)
  aws: {
    regions: [
      { code: 'us-east-1', name: 'US East (N. Virginia)' },
      { code: 'us-east-2', name: 'US East (Ohio)' },
      { code: 'us-west-1', name: 'US West (N. California)' },
      { code: 'us-west-2', name: 'US West (Oregon)' },
      { code: 'eu-west-1', name: 'Europe (Ireland)' },
      { code: 'eu-central-1', name: 'Europe (Frankfurt)' },
      { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
      { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' }
    ],
    
    // Compute instance types (for dropdown)
    instanceTypes: [
      { value: 't2.micro', name: 't2.micro (1 vCPU, 1 GB RAM)', family: 'General Purpose' },
      { value: 't2.small', name: 't2.small (1 vCPU, 2 GB RAM)', family: 'General Purpose' },
      { value: 't3.micro', name: 't3.micro (2 vCPU, 1 GB RAM)', family: 'General Purpose' },
      { value: 't3.small', name: 't3.small (2 vCPU, 2 GB RAM)', family: 'General Purpose' },
      { value: 't3.medium', name: 't3.medium (2 vCPU, 4 GB RAM)', family: 'General Purpose' },
      { value: 'm5.large', name: 'm5.large (2 vCPU, 8 GB RAM)', family: 'General Purpose' },
      { value: 'm5.xlarge', name: 'm5.xlarge (4 vCPU, 16 GB RAM)', family: 'General Purpose' },
      { value: 'c5.large', name: 'c5.large (2 vCPU, 4 GB RAM)', family: 'Compute Optimized' },
      { value: 'r5.large', name: 'r5.large (2 vCPU, 16 GB RAM)', family: 'Memory Optimized' }
    ],
    
    // Operating systems (for dropdown)
    operatingSystems: [
      { value: 'ubuntu-22-04', name: 'Ubuntu 22.04 LTS', description: 'Latest Ubuntu LTS' },
      { value: 'amazon-linux-2', name: 'Amazon Linux 2', description: 'AWS optimized Linux' },
      { value: 'debian-11', name: 'Debian 11', description: 'Stable Debian release' }
    ],
    
    // Disk sizes (for dropdown, in GB)
    diskSizes: [
      { value: 20, name: '20 GB', description: 'Minimum for most OS' },
      { value: 50, name: '50 GB', description: 'Recommended for general use' },
      { value: 100, name: '100 GB', description: 'For applications with data' },
      { value: 200, name: '200 GB', description: 'For databases or large apps' },
      { value: 500, name: '500 GB', description: 'For data-intensive workloads' }
    ],
    
    // EBS pricing (gp3, per GB-month)
    ebsPricing: {
      gp3: 0.08, // $0.08 per GB-month
      hourlyPerGB: 0.000111 // $0.08 / (30 * 24)
    },
    
    // Markup percentage
    markupPercentage: 20.0
  },
  
  // JWT Configuration
  jwt: {
    storageKey: 'cloudgear_token',
    storageType: 'localStorage' // or 'cookie'
  },
  
  // UI Configuration
  ui: {
    defaultPageSize: 10,
    maxPageSize: 100,
    autoRefreshInterval: 30000, // 30 seconds
    snackBarDuration: 5000, // 5 seconds
    dialogWidth: '500px'
  },
  
  // Billing Configuration
  billing: {
    currency: 'USD',
    currencySymbol: '$',
    displayPrecision: 4,
    monthlyEstimation: true
  }
};