import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth-service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  loading = true;
  uploading = false;

  profile: any = null;
  avatarPreview: string | null = null;

  editingName = false;
  editFullName = '';

  favoriteCars: any[] = [];

  private worker?: Worker;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private favService: FavoritesService
  ) {}

  async ngOnInit() {
    this.profile = await this.profileService.loadProfile();

    const payload = this.authService.getUserFromAccessToken();
    if (payload) {
      const favIds = this.profile.firestore?.favorites || [];
      if (Array.isArray(favIds) && favIds.length) {
        this.loadFavoriteCars(favIds);
      }
    }

    this.avatarPreview = this.profile.avatarBase64 || null;

    this.loading = false;
    this.cdr.detectChanges();

    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('../workers/image-compress.worker.ts', import.meta.url), {
        type: 'module',
      });

      this.worker.onmessage = async ({ data }) => {
        if (!data) {
          this.uploading = false;
          this.cdr.detectChanges();
          return;
        }

        const compressed = data as string;

        this.avatarPreview = compressed;
        await this.profileService.updateAvatar(compressed);

        this.uploading = false;
        this.cdr.detectChanges();
      };
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  onAvatarSelected(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files allowed (.jpg/.png)');
      return;
    }

    if (!this.worker) {
      alert('Image compression worker not available.');
      return;
    }

    this.uploading = true;

    this.worker.postMessage({
      file,
      maxWidth: 260,
      quality: 0.72,
    });
  }

  async removeAvatar() {
    this.avatarPreview = null;
    this.uploading = true;

    await this.profileService.updateAvatar('');

    this.uploading = false;
    this.cdr.detectChanges();
  }

  startEditingName() {
    this.editFullName = this.profile.fullName || '';
    this.editingName = true;
  }

  cancelEditingName() {
    this.editingName = false;
  }

  triggerAvatarUpload() {
    const input = document.getElementById('uploadInput') as HTMLInputElement;
    if (input) input.click();
  }

  async saveName() {
    if (!this.editFullName.trim()) {
      alert('Name cannot be empty');
      return;
    }

    await this.profileService.updateProfile({ fullName: this.editFullName });

    this.profile.fullName = this.editFullName;
    this.editingName = false;
    this.cdr.detectChanges();
  }

  async loadFavoriteCars(ids: number[]) {
    const cars = [];
    for (const id of ids) {
      try {
        const car = await this.profileService.getCar(id);
        cars.push(car);
      } catch {}
    }
    this.favoriteCars = cars;
    this.cdr.detectChanges();
  }

  removeFavorite(id: number) {
    this.favService.toggleFavorite(id);
    this.favoriteCars = this.favoriteCars.filter((c) => c.id !== id);
  }
}
