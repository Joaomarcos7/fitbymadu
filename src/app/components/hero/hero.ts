import { Component, AfterViewInit, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SettingsService, SiteSettings } from '../../services/settings.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
})
export class Hero implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private settingsService = inject(SettingsService);

  showContent = signal(false);
  settings = signal<SiteSettings | null>(null);

  ngOnInit(): void {
    this.settingsService.get().subscribe((s) => this.settings.set(s));
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.showContent.set(true), 80);
    }
  }
}
