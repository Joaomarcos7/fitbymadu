import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FadeInDirective } from '../../directives/fade-in.directive';
import { Enviroment } from '../../envs/production.environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FadeInDirective],
  templateUrl: './about.html',
})
export class About implements AfterViewInit, OnInit {
  private platformId = inject(PLATFORM_ID);

  @ViewChildren('counterEl') counterEls!: QueryList<ElementRef<HTMLElement>>;

  stats = [
    { value: 500, suffix: '+', label: 'Peças vendidas' },
    { value: 98, suffix: '%', label: 'Satisfação' },
    { value: 2, suffix: ' anos', label: 'De história' },
  ];

  phoneNumber: string = Enviroment.phoneNumber;

ngOnInit(): void {
  
}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.counterEls.forEach((el, i) => {
            this.animateCounter(this.stats[i].value, el, this.stats[i].suffix);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (this.counterEls.first) {
      observer.observe(this.counterEls.first.nativeElement.closest('.stats-row') as Element);
    }
  }

  private animateCounter(target: number, ref: ElementRef<HTMLElement>, suffix: string): void {
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      ref.nativeElement.textContent = start + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
