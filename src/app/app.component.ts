import { Component, OnInit } from "@angular/core";
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
      order:index
    }));
  }

  toggleExpand(selected: Card) {
    selected.expanded = !selected.expanded;
    this.repackCards(selected);
  }
  
  repackCards(selectedCard:Card) {
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
}