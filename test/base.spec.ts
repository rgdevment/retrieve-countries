import { sum } from '../src/base';

describe('Sum function', () => {
  it('should add two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
