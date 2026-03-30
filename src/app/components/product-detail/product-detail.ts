import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CatalogItem } from '../../data/catalog-data';
import { CatalogService } from '../../services/catalog.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private catalogService = inject(CatalogService);
  private settingsService = inject(SettingsService);

  item = signal<CatalogItem | null>(null);
  related = signal<CatalogItem[]>([]);
  selectedSize = signal<string | null>(null);
  selectedColorIdx = signal(0);
  activeImageIdx = signal(0);
  whatsappNumber = signal('');

  currentImages = computed(() => {
    const it = this.item();
    if (!it) return [];
    const colorImages = it.colors[this.selectedColorIdx()]?.images;
    return colorImages?.length ? colorImages : it.images;
  });

  currentImage = computed(() => {
    const imgs = this.currentImages();
    return imgs[this.activeImageIdx()] ?? imgs[0] ?? '';
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogService.getOne(id).subscribe((item) => {
      this.item.set(item);
      this.catalogService.getAll().subscribe((all) => {
        this.related.set(all.filter((i) => i.id !== id).slice(0, 3));
      });
    });
    this.settingsService.get().subscribe((s) => this.whatsappNumber.set(s.whatsappNumber));
  }

  selectColor(idx: number): void {
    this.selectedColorIdx.set(idx);
    this.activeImageIdx.set(0);
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  setImage(idx: number): void {
    this.activeImageIdx.set(idx);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getWhatsAppUrl(): string {
    const it = this.item();
    const num = this.whatsappNumber() || '5511999999999';
    if (!it) return `https://wa.me/${num}`;
    const size = this.selectedSize() ? ` - Tamanho: ${this.selectedSize()}` : '';
    const color = it.colors[this.selectedColorIdx()]?.name ?? '';
    const msg = encodeURIComponent(
      `Olá! Tenho interesse no produto: *${it.title}*${color ? ` - Cor: ${color}` : ''}${size}. Pode me passar mais informações?`
    );
    return `https://wa.me/${num}?text=${msg}`;
  }

  goToRelated(item: CatalogItem): void {
    this.router.navigate(['/produto', item.id]).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}
