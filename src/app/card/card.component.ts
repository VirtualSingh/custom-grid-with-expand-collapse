import { Component , input, output} from '@angular/core';
import { Card } from '../model/model';
@Component({
  selector: 'app-card', 
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
data = input.required<Card>();
expand = output<void>();

}
