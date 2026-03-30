import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private catalogService = inject(CatalogService);

  productCount = signal(0);

  ngOnInit(): void {
    this.catalogService.getAll().subscribe((items) => this.productCount.set(items.length));
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
