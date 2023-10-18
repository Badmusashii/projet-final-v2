import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnimationSyncService {
  public syncEvent = new Subject<void>();
  syncAnimations() {
    this.syncEvent.next();
  }
}
