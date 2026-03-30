import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { ImageUpload } from '../image-upload/image-upload';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ImageUpload],
  templateUrl: './settings-form.html',
})
export class SettingsForm implements OnInit {
  private settingsService = inject(SettingsService);

  form = new FormGroup({
    heroImage: new FormControl('', Validators.required),
    heroPriceLabel: new FormControl('', Validators.required),
    whatsappNumber: new FormControl('', Validators.required),
  });

  saving = signal(false);
  saved = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.settingsService.get().subscribe((s) => this.form.patchValue(s));
  }

  setHeroImage(url: string): void {
    this.form.patchValue({ heroImage: url });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.saved.set(false);
    this.error.set('');

    this.settingsService.update(this.form.value as Parameters<SettingsService['update']>[0]).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: () => {
        this.error.set('Erro ao salvar. Tente novamente.');
        this.saving.set(false);
      },
    });
  }
}
