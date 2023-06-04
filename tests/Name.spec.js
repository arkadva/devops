import { expect } from 'chai';

/*
* For some reason the react parser doesn't let you import from index.js
*/
export function validateName(name) {
  if (name.length == 0) {
    return false;
  }
  if (/[\d~`!@#$%^&*()_\-+=\[\]{}|\\:;"'<>,.?/]/.test(name)) {
    return false;
  }
  return true;
};


describe('Name Validation', () => {
  it('should return true for a valid name', () => {
    const name = 'John Doe';
    const isValid = validateName(name);
    expect(isValid).to.be.true;
  });

  it('should return false for a name with numbers', () => {
    const name = 'John123';
    const isValid = validateName(name);
    expect(isValid).to.be.false;
  });

  it('should return false for a name with symbols', () => {
    const name = 'John@Doe';
    const isValid = validateName(name);
    expect(isValid).to.be.false;
  });

  it('should return false for an empty name', () => {
    const name = '';
    const isValid = validateName(name);
    expect(isValid).to.be.false;
  });
});
