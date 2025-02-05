import { faker } from '@faker-js/faker';
import { Product } from './product.model';

export class ProductMock {
  static getOne(): Product {
    return {
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      price: faker.number.float({ min: 1, max: 100 }),
      images: [faker.image.url(), faker.image.url()],
      description: faker.commerce.productDescription(),
      category: {
        id: faker.number.int(),
        name: faker.commerce.department(),
      },
    };
  }

  static get(quantity: number): Product[] {
    return Array.from({ length: quantity }, () =>
      ProductMock.getOne()
    );
  }
}
