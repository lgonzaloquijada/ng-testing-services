import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  it('#multiply should return 9', () => {
    //Arrange
    const calculator = new Calculator();

    //Act
    const answer = calculator.multiply(3, 3);

    //Assert
    expect(answer).toBe(9);
  });

  it('@multiply should return 0', () => {
    //Arrange
    const calculator = new Calculator();

    //Act
    const answer = calculator.multiply(3, 0);

    //Assert
    expect(answer).toBe(0);
  });

  it('#divide should return 3', () => {
    //Arrange
    const calculator = new Calculator();

    //Act
    const answer = calculator.divide(9, 3);

    //Assert
    expect(answer).toBe(3);
  });

  it('test matchers', () => {
    const name = 'John Doe';
    let name2;

    expect(name).toBeDefined();
    expect(name2).toBeUndefined();

    expect(1 + 3 === 4).toBeTruthy();
    expect(1 + 3 === 5).toBeFalsy();

    expect(5).toBeGreaterThan(4);
    expect(5).toBeLessThan(10);

    expect('team').toMatch(/ea/);
    expect(['team', 'ram', 'jam']).toContain('ram');
  });
});
