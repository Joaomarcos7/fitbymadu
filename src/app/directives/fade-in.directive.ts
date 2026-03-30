import { Directive, ElementRef, inject, input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appFadeIn]',
  standalone: true,
})
export class FadeInDirective implements OnInit {
  appFadeInDelay = input<number>(0);

  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.el.nativeElement.classList.add('fade-in-hidden');

    if (!isPlatformBrowser(this.platformId)) return;

    const delay = this.appFadeInDelay();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.el.nativeElement.classList.remove('fade-in-hidden');
              this.el.nativeElement.classList.add('fade-in-visible');
            }, delay);
            observer.unobserve(this.el.nativeElement);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.el.nativeElement);
  }
}
