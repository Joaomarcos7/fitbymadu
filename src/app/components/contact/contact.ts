import { Component, inject, OnInit, signal } from '@angular/core';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FadeInDirective],
  templateUrl: './contact.html',
})
export class Contact implements OnInit {
  private settingsService = inject(SettingsService);

  instagramUrl = 'https://instagram.com/fitbymadu';
  whatsappUrl = signal('https://wa.me/5511999999999');

  ngOnInit(): void {
    this.settingsService.get().subscribe((s) => {
      if (s.whatsappNumber) {
        this.whatsappUrl.set(`https://wa.me/${s.whatsappNumber}`);
      }
    });
  }
}
