import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { CatalogItem } from '../../data/catalog-data';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FadeInDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './catalog.html',
})
export class Catalog implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private catalogService = inject(CatalogService);

  breakpoints = {
    640: { slidesPerView: 2.2, spaceBetween: 20 },
    1024: { slidesPerView: 3.2, spaceBetween: 24 },
    1280: { slidesPerView: 4.2, spaceBetween: 24 },
  };

  catalogItems = signal<CatalogItem[]>([]);

  async ngOnInit(): Promise<void> {
    this.catalogService.getAll().subscribe((items) => this.catalogItems.set(items));

    if (isPlatformBrowser(this.platformId)) {
      const { register } = await import('swiper/element/bundle');
      register();
    }
  }

  goToProduct(item: CatalogItem): void {
    this.router.navigate(['/produto', item.id]);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
