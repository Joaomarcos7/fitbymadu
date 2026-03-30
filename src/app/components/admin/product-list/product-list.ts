import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogItem } from '../../../data/catalog-data';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private catalogService = inject(CatalogService);

  items = signal<CatalogItem[]>([]);
  deleting = signal<number | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.catalogService.getAll().subscribe((items) => this.items.set(items));
  }

  delete(item: CatalogItem): void {
    if (!confirm(`Excluir "${item.title}"? Esta ação não pode ser desfeita.`)) return;
    this.deleting.set(item.id);
    this.catalogService.delete(item.id).subscribe({
      next: () => {
        this.items.update((list) => list.filter((i) => i.id !== item.id));
        this.deleting.set(null);
      },
      error: () => this.deleting.set(null),
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
