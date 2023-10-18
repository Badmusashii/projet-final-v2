import { Component, Input, OnInit } from '@angular/core';
import { AnimationSyncService } from 'src/app/services/anim-syncro.service';

@Component({
  selector: 'app-affiche',
  templateUrl: './affiche.component.html',
  styleUrls: ['./affiche.component.css'],
})
export class AfficheComponent implements OnInit {
  constructor(private animSyncro: AnimationSyncService) {}
  ngOnInit(): void {
    const element = document.querySelector('#afficheImg')! as HTMLElement;
    element.addEventListener('animationiteration', () => {
      this.animSyncro.syncAnimations();
    });
  }
  @Input() posterPath: string = '';
  @Input() movieTitle: string = '';
  @Input() movieNote: string = '';
}
