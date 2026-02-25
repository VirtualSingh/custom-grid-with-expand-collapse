import { Component, OnInit, ViewChildren, QueryList, ElementRef, inject, ChangeDetectorRef } from "@angular/core";
import { CardComponent } from "./card/card.component";
import { Card } from "./model/model";

@Component({
    selector:'app-root',
    styleUrls:['./app.component.scss'],
    templateUrl:'./app.component.html',
    imports:[CardComponent]
})
export  class AppComponent implements OnInit{
numberOfCards:number=4;
cards:Card[] = [];
@ViewChildren('gridItem')
gridItems!: QueryList<ElementRef<HTMLElement>>;
private cdr = inject(ChangeDetectorRef)

ngOnInit(): void {
   this.cards =  this.generateCards(this.numberOfCards);
}  
 generateCards(count: number): Card[] {
    const backgrounds = [
      '#FF6B6B',
      '#4ECDC4',
      '#1A535C',
      '#F7B801',
      '#6A4C93'
    ];
  
    return Array.from({ length: count }, (_, index) => ({
      header: `Card ${index + 1}`,
      content: `This is the content for card ${index + 1}`,
      background: backgrounds[index % backgrounds.length],
      expanded:false,
      order:index+1
    }));
  }

  toggleExpand(card: Card) {
    card.expanded = !card.expanded;
    return card.expanded;
    // this.repackCards(selected);
  }
  
  repackCards() {
    const expanded = this.cards.filter(c => c.expanded).sort((a,b)=>a.order-b.order);
    const normal = this.cards.filter(c => !c.expanded).sort((a,b)=>a.order-b.order);;
  
    const result: Card[] = [];
  
    let normalIndex = 0;
  
    while (normalIndex < normal.length || expanded.length) {
  
      // If there is an expanded card, place it first in a row
      if (expanded.length) {
        result.push(expanded.shift()!);
        continue;
      }
  
      // Otherwise fill row with two normal cards
      result.push(normal[normalIndex++]);
  
      if (normalIndex < normal.length) {
        result.push(normal[normalIndex++]);
      }
    }

    this.cards = [...result];
    if(this.cards.every(card=>!card.expanded)) this.cards.sort((a,b)=>a.order - b.order);
  
  }
  async onExpand(card: Card) {

    let isNowExpanded = false;
  
    await this.runFlip(() => {
      isNowExpanded = this.toggleExpand(card);
      this.repackCards();
    });
  
    if (isNowExpanded) {
      this.focusCard(card.order); // scroll starts immediately
    }
  }

  private runFlip(mutator: () => void):Promise<void> {
    return new Promise(resolve => {

      const firstRects = new Map<HTMLElement, DOMRect>();
  
      this.gridItems.forEach(item => {
        firstRects.set(
          item.nativeElement,
          item.nativeElement.getBoundingClientRect()
        );
      });
  
      mutator();
      this.cdr.detectChanges();
  
      requestAnimationFrame(() => {
  
        this.gridItems.forEach(item => {
  
          const el = item.nativeElement;
          const first = firstRects.get(el);
          const last = el.getBoundingClientRect();
  
          if (!first) return;
  
          const deltaX = Math.round(first.left - last.left);
          const deltaY = Math.round(first.top - last.top);
  
          if (deltaX || deltaY) {
  
            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            el.style.transition = 'transform 0s';
  
            requestAnimationFrame(() => {
              el.style.transition = 'transform 300ms ease';
              el.style.transform = '';
            });
          }
        });
  
        resolve(); 
      });
    });
  }


  private focusCard(id: number|string) {

    const element = this.gridItems
      .find(ref => ref.nativeElement.dataset['id'] == id)
      ?.nativeElement;
  
    if (!element) return;
    const previousTransform = element.style.transform;
    element.style.transform = 'none';
    const rect = element.getBoundingClientRect();
    element.style.transform = previousTransform;
    const topVisible = rect.top >= 0 && rect.top <= window.innerHeight;
    const bottomVisible = rect.bottom <= window.innerHeight;
  
    const fullyVisible = topVisible && bottomVisible;
  
    if (!fullyVisible) {
  
      const absoluteTop = window.scrollY + rect.top;
  
      // Small offset so card isn’t glued to top
      const offset = 16;
  
      window.scrollTo({
        top: absoluteTop - offset,
        behavior: 'smooth'
      });
    }
  
    // Highlight
    element.classList.add('focused');
    setTimeout(() => {
      element.classList.remove('focused');
    }, 700);
  }
}