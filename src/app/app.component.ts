import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Calculator } from './calculator';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ng-testing-services';

  constructor() {}

  ngOnInit() {
    const calculator = new Calculator();
    const ans = calculator.multiply(2, 3);
    console.log(ans === 6);
    const ans2 = calculator.divide(6, 0);
    console.log(ans2 === null);
  }
}
