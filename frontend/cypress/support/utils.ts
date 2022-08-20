import { faker } from '@faker-js/faker';

export const getKey = () => {
  return `${faker.random.word().toLowerCase()}-${faker.random
    .word()
    .toLowerCase()}`;
};
