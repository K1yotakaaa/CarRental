import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { AuthService } from './auth-service';

const LOCAL_KEY = 'car_favorites_v1';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favs$ = new BehaviorSubject<number[]>(this.readLocal());
  public favorites$ = this.favs$.asObservable();
  private mergedOnLogin = false;

  constructor(private firebase: FirebaseService, private auth: AuthService) {
    this.auth.isLoggedIn$.subscribe((isLogged) => {
      if (isLogged && !this.mergedOnLogin) {
        const payload = this.auth.getUserFromAccessToken();
        if (payload) {
          this.mergeLocalToServer(payload).catch((err) => {
            console.error('Favorites merge failed', err);
          });
        }
      }
      if (!isLogged) {
        this.favs$.next(this.readLocal());
      }
    });
  }

  private readLocal(): number[] {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private writeLocal(arr: number[]) {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
    } catch {}
  }

  private userUidFromPayload(payload: any): string | null {
    if (!payload) return null;
    const id = payload.user_id ?? payload.id ?? payload.sub ?? null;
    if (!id) return null;
    return `user_${id}`;
  }

  private async fetchServerFavorites(payload: any): Promise<number[]> {
    const uid = this.userUidFromPayload(payload);
    if (!uid) return [];
    const doc = await this.firebase.getUserDoc(uid);
    return doc && Array.isArray(doc['favorites']) ? doc['favorites'] : [];
  }

  private async saveServerFavorites(payload: any, arr: number[]) {
    const uid = this.userUidFromPayload(payload);
    if (!uid) return;
    await this.firebase.setUserDoc(uid, { favorites: arr });
  }

  async mergeLocalToServer(payload: any) {
    const local = this.readLocal();
    const server = await this.fetchServerFavorites(payload);
    const merged = Array.from(new Set([...(server || []), ...(local || [])]));
    await this.saveServerFavorites(payload, merged);
    this.favs$.next(merged);
    this.writeLocal([]);
    this.mergedOnLogin = true;
    console.info('Local favorites merged into your account.');
  }

  async toggleFavorite(id: number) {
    const payload = this.auth.getUserFromAccessToken();
    const current = this.favs$.getValue();
    const exists = current.includes(id);
    const next = exists ? current.filter((x) => x !== id) : [...current, id];
    this.favs$.next(next);

    if (payload) {
      try {
        await this.saveServerFavorites(payload, next);
      } catch (err) {
        console.error('Failed to save favorites to Firestore', err);
      }
    } else {
      this.writeLocal(next);
    }
  }

  isFavorite(id: number) {
    return this.favs$.getValue().includes(id);
  }
}
