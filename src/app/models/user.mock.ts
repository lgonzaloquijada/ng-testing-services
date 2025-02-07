import { faker } from '@faker-js/faker';

export class UserMock {
  static getOne() {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(['customer', 'admin']),
    };
  }

  static get(quantity: number) {
    return Array.from({ length: quantity }, () => UserMock.getOne());
  }
}
