export class CarouselWidget {
  constructor(root) {
    this.root   = root;
    this.track  = this.root.querySelector('.carousel-track');
    this.slides = Array.from(this.track.children);
    this.prevEl = this.root.querySelector('[data-prev]');
    this.nextEl = this.root.querySelector('[data-next]');

    this.index          = 0;                  // left‑most visible slide
    this.slidesPerView  = this.getSlidesPerView();
    this.autoRunning    = false;
    this.intervalId     = null;

    /* ——— Event wiring ——— */
    this.prevEl.addEventListener('click', () => {
      this.prev();
      this.stopAuto();                        // pause auto‑play on user interaction
    });
    this.nextEl.addEventListener('click', () => {
      this.next();
      this.stopAuto();                        // pause auto‑play on user interaction
    });
    window.addEventListener('resize', () => {
      const spv = this.getSlidesPerView();
      if (spv !== this.slidesPerView) {
        this.slidesPerView = spv;
        this.update();                         // re‑centre after breakpoint flip
      }
    });

    /* initial paint + start auto‑play */
    this.update();
    this.runAuto();
  }

  /* detect whether we’re showing 1 or 3 slides */
  getSlidesPerView() {
    return window.matchMedia('(min-width: 768px)').matches ? 3 : 1;
  }

  /* translate the track to show the current index */
  update() {
    const slide = this.slides[0];
    const style = window.getComputedStyle(slide);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    const slideWidth = slide.getBoundingClientRect().width + margin;

    this.track.style.transform = `translateX(-${this.index * slideWidth}px)`;
  }

  /* advance one slide, wrapping if needed */
  next() {
    this.index++;
    if (this.index > this.slides.length - this.slidesPerView) {
        this.index = 0;
    }

    this.update();
  }

  /* go back one slide, wrapping if needed */
  prev() {
    this.index--;
    if (this.index < 0) {
      this.index = this.slides.length - this.slidesPerView;
    }
    this.update();
  }

  /* ---------- auto‑play helpers ---------- */

  runAuto() {
    if (this.autoRunning) return;              // already running
    this.autoRunning = true;

    this.intervalId = setInterval(() => {
      this.next();                             // advance every 3 s
    }, 3000);
  }

  stopAuto() {
    if (!this.autoRunning) return;
    clearInterval(this.intervalId);
    this.autoRunning = false;
    this.intervalId = setInterval(() => {
      this.runAuto();                            
    }, 3000);
  }
}

/* hydrate every carousel on the page */
document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.carousel-widget')
    .forEach(el => new CarouselWidget(el));
});
