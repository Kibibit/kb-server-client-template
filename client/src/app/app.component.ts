import { Component } from '@angular/core';
import { consoleLogo } from '@kibibit/consologo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kibibit client';

  constructor() {
    consoleLogo('kibibit client', 'noice!');
  }
}
