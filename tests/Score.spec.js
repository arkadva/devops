import { expect } from 'chai';

/*
* For some reason the react parser doesn't let you import from index.js.
*/
export function validateScores(scores, setScoreErrors) {
  const errors = scores.map((score) => {
    if (score < 0 || score > 100) {
      return true;
    } else {
      return false;
    }
  });

  if (setScoreErrors) {
    setScoreErrors(errors);
  }

  return !errors.includes(true);
};

describe('Score Validation', () => {
  it('should return true for a valid score (between 0 and 100)', () => {
    const scores = [85, 10, 24]
    const isValid = validateScores(scores, false);
    expect(isValid).to.be.true;
  });

  it('should return false for a score less than 0', () => {
    const scores = [85, -5, 10]
    const isValid = validateScores(scores, false);
    expect(isValid).to.be.false;
  });

  it('should return false for a score greater than 100', () => {
    const scores = [101, 50, 25]
    const isValid = validateScores(scores, false);
    expect(isValid).to.be.false;
  });
});