import { Injectable } from '@angular/core';
import { getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, get, set } from 'firebase/database';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app;
  private firestore;
  private realtime;

  constructor() {
    try {
      this.app = getApp();
    } catch (err) {
      console.error(err);
      throw err;
    }

    this.firestore = getFirestore(this.app);
    this.realtime = getDatabase(this.app);
  }


  async getUserDoc(userId: string) {
    try {
      const snap = await getDoc(doc(this.firestore, 'users', userId));

      return snap.exists() ? snap.data() : null;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async setUserDoc(userId: string, data: any) {
    try {
      await setDoc(doc(this.firestore, 'users', userId), data, { merge: true });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async setAvatar(userId: string, base64: string) {
    try {
      await set(ref(this.realtime, `avatars/${userId}`), base64);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getAvatar(userId: string) {
    try {
      const snap = await get(ref(this.realtime, `avatars/${userId}`));
      return snap.exists() ? snap.val() : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
