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
numberOfCards:number=2;
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
      background: backgrounds[index % backgrounds.length]
    }));
  }
}