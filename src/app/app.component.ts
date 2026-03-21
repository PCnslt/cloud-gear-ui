import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Cloud-Gear.com';
  isAuthenticated = false;
  userEmail = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user;
      this.userEmail = user?.email || '';
    });
    
    // Check initial authentication state
    this.authService.checkAuthStatus();
  }
  
  /**
   * Navigate to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }
  
  /**
   * Navigate to dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  
  /**
   * Navigate to compute resources
   */
  goToCompute(): void {
    this.router.navigate(['/compute']);
  }
  
  /**
   * Navigate to billing
   */
  goToBilling(): void {
    this.router.navigate(['/billing']);
  }
  
  /**
   * Navigate to pricing page
   */
  goToPricing(): void {
    this.router.navigate(['/pricing']);
  }
  
  /**
   * Logout the current user
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    if (!this.userEmail) {
      return 'CG';
    }
    
    // Extract first letter of email username
    const username = this.userEmail.split('@')[0];
    return username.charAt(0).toUpperCase();
  }
}