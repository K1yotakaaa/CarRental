import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth-service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(
    private firebase: FirebaseService,
    private auth: AuthService,
    private http: HttpClient,
  ) {}

  private get uid(): string | null {
    const user = this.auth.getUserFromAccessToken();
    return user ? `user_${user.user_id}` : null;
  }

  async loadProfile() {
    const decoded = this.auth.getUserFromAccessToken();

    if (!decoded || !this.uid) {
      console.error('[ProfileService] ERROR: UID is null — missing token');
      return null;
    }

    console.log('[ProfileService] UID =', this.uid);

    const doc = await this.firebase.getUserDoc(this.uid);
    const avatarBase64 = await this.firebase.getAvatar(this.uid);

    console.log('[ProfileService] Profile loaded:', {
      doc,
      avatarExists: !!avatarBase64,
    });

    return {
      fullName: doc?.['fullName'] || '',
      email: decoded.email || '',
      userId: decoded.user_id || '',
      avatarBase64: avatarBase64 || null,
      firestore: doc,
    };
  }

  async updateProfile(data: any) {
    console.log('[ProfileService] Updating profile:', data);

    if (!this.uid) {
      console.error('[ProfileService] Cannot update — UID null');
      return;
    }

    return this.firebase.setUserDoc(this.uid, data);
  }

  async updateAvatar(base64: string) {
    const decoded = this.auth.getUserFromAccessToken();
    if (!decoded) {
      console.error('[ProfileService] Cannot update avatar — no token');
      return;
    }

    const uid = `user_${decoded.user_id}`;

    await this.firebase.setAvatar(uid, base64);

    await this.firebase.setUserDoc(uid, { avatarUrl: base64 });
  }

  compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('../workers/image-compress.worker', import.meta.url));

      worker.onmessage = ({ data }) => resolve(data);
      worker.onerror = (err) => reject(err);

      worker.postMessage({ file });
    });
  }

  getCar(id: number) {
    return firstValueFrom(this.http.get(`http://127.0.0.1:8000/api/cars/${id}/`));
  }
}
