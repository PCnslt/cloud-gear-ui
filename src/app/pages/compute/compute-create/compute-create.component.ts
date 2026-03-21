import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComputeService, ComputeCreateRequest, PriceEstimate, PricingOptions } from '../../../services/compute.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compute-create',
  templateUrl: './compute-create.component.html',
  styleUrls: ['./compute-create.component.scss']
})
export class ComputeCreateComponent implements OnInit {
  computeForm: FormGroup;
  pricingOptions: PricingOptions | null = null;
  priceEstimate: PriceEstimate | null = null;
  isLoading = false;
  isCalculatingPrice = false;
  errorMessage = '';
  
  // Form field options (will be populated from API)
  regions: string[] = [];
  instanceTypes: string[] = [];
  operatingSystems: string[] = [];
  diskSizes: number[] = [];

  constructor(
    private fb: FormBuilder,
    private computeService: ComputeService,
    private router: Router
  ) {
    this.computeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      region: ['', Validators.required],
      instanceType: ['', Validators.required],
      os: ['', Validators.required],
      diskSize: [20, [Validators.required, Validators.min(20), Validators.max(1000)]]
    });
  }

  ngOnInit(): void {
    this.loadPricingOptions();
    
    // Subscribe to form changes to update price estimate
    this.computeForm.valueChanges.subscribe(() => {
      if (this.computeForm.valid) {
        this.updatePriceEstimate();
      }
    });
  }

  loadPricingOptions(): void {
    this.isLoading = true;
    this.computeService.getPricingOptions().subscribe({
      next: (options) => {
        this.pricingOptions = options;
        this.regions = options.regions;
        this.instanceTypes = options.instanceTypes;
        this.operatingSystems = options.operatingSystems;
        this.diskSizes = options.diskSizes;
        
        // Set default values
        this.computeForm.patchValue({
          region: this.regions[0],
          instanceType: this.instanceTypes[0],
          os: this.operatingSystems[0],
          diskSize: this.diskSizes[0]
        });
        
        this.isLoading = false;
        this.updatePriceEstimate();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load pricing options. Please try again.';
        this.isLoading = false;
        console.error('Error loading pricing options:', error);
      }
    });
  }

  updatePriceEstimate(): void {
    if (!this.computeForm.valid) return;
    
    const { region, instanceType, os, diskSize } = this.computeForm.value;
    this.isCalculatingPrice = true;
    
    this.computeService.getPriceEstimate(region, instanceType, os, diskSize).subscribe({
      next: (estimate) => {
        this.priceEstimate = estimate;
        this.isCalculatingPrice = false;
      },
      error: (error) => {
        console.error('Error calculating price:', error);
        this.isCalculatingPrice = false;
      }
    });
  }

  onSubmit(): void {
    if (this.computeForm.invalid) {
      this.markFormGroupTouched(this.computeForm);
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const request: ComputeCreateRequest = this.computeForm.value;
    
    this.computeService.createComputeResource(request).subscribe({
      next: (resource) => {
        this.isLoading = false;
        alert('Compute resource created successfully!');
        this.router.navigate(['/compute']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create compute resource. Please try again.';
        console.error('Error creating compute resource:', error);
      }
    });
  }

  formatCost(cost: number): string {
    return \$\;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
