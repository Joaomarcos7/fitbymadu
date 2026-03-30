import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { API_BASE } from '../../../services/api-base.token';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.html',
})
export class ImageUpload {
  currentUrl = input<string>('');
  @Output() uploaded = new EventEmitter<string>();

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private base = inject(API_BASE);

  uploading = signal(false);
  error = signal('');

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.error.set('');

    const formData = new FormData();
    formData.append('file', file);

    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    this.http.post<{ url: string }>(`${this.base}/api/upload`, formData, { headers }).subscribe({
      next: ({ url }) => {
        this.uploaded.emit(url);
        this.uploading.set(false);
        input.value = '';
      },
      error: () => {
        this.error.set('Erro ao enviar. Tente novamente.');
        this.uploading.set(false);
      },
    });
  }
}
