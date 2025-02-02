import { of } from 'rxjs';

export class ValueFakeService {
  constructor() {}

  getValue() {
    return 'fake value';
  }

  setValue(value: string) {}

  getPromiseValue() {
    return Promise.resolve('fake promise value');
  }

  getObservableValue() {
    return of('fake observable value');
  }
}
