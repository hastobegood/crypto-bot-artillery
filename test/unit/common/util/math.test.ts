import { roundNumber, truncateNumber } from '../../../../src/common/util/math.js';

describe('Math', () => {
  describe('Given a number to round', () => {
    it('Then number is rounded according to provided number of decimals', async () => {
      expect(roundNumber(1.0123456789, 0)).toEqual(1);
      expect(roundNumber(1.0123456789, 1)).toEqual(1.0);
      expect(roundNumber(1.0123456789, 2)).toEqual(1.01);
      expect(roundNumber(1.0123456789, 3)).toEqual(1.012);
      expect(roundNumber(1.0123456789, 4)).toEqual(1.0123);
      expect(roundNumber(1.0123456789, 5)).toEqual(1.01235);
      expect(roundNumber(1.0123456789, 6)).toEqual(1.012346);
      expect(roundNumber(1.0123456789, 7)).toEqual(1.0123457);
      expect(roundNumber(1.0123456789, 8)).toEqual(1.01234568);
      expect(roundNumber(1.0123456789, 9)).toEqual(1.012345679);
      expect(roundNumber(1.0123456789, 10)).toEqual(1.0123456789);
      expect(roundNumber(1.0123456789, 11)).toEqual(1.0123456789);

      expect(roundNumber(-1.0123456789, 0)).toEqual(-1);
      expect(roundNumber(-1.0123456789, 1)).toEqual(-1.0);
      expect(roundNumber(-1.0123456789, 2)).toEqual(-1.01);
      expect(roundNumber(-1.0123456789, 3)).toEqual(-1.012);
      expect(roundNumber(-1.0123456789, 4)).toEqual(-1.0123);
      expect(roundNumber(-1.0123456789, 5)).toEqual(-1.01235);
      expect(roundNumber(-1.0123456789, 6)).toEqual(-1.012346);
      expect(roundNumber(-1.0123456789, 7)).toEqual(-1.0123457);
      expect(roundNumber(-1.0123456789, 8)).toEqual(-1.01234568);
      expect(roundNumber(-1.0123456789, 9)).toEqual(-1.012345679);
      expect(roundNumber(-1.0123456789, 10)).toEqual(-1.0123456789);
      expect(roundNumber(-1.0123456789, 11)).toEqual(-1.0123456789);

      expect(roundNumber(1.005, 2)).toEqual(1.01);
      expect(roundNumber(1.555, 2)).toEqual(1.56);
      expect(roundNumber(1.3549999999999998, 2)).toEqual(1.35);

      expect(roundNumber(-1.005, 2)).toEqual(-1.01);
      expect(roundNumber(-1.555, 2)).toEqual(-1.56);
      expect(roundNumber(-1.3549999999999998, 2)).toEqual(-1.35);

      expect(roundNumber(0.5, 0)).toEqual(1);
      expect(roundNumber(1.25, 1)).toEqual(1.3);
      expect(roundNumber(234.20405, 4)).toEqual(234.2041);
      expect(roundNumber(234.2040500000006, 4)).toEqual(234.2041);

      expect(roundNumber(-0.5, 0)).toEqual(-1);
      expect(roundNumber(-1.25, 1)).toEqual(-1.3);
      expect(roundNumber(-234.20405, 4)).toEqual(-234.2041);
      expect(roundNumber(-234.204050000006, 4)).toEqual(-234.2041);

      expect(roundNumber(0.1 + 0.2, 1)).toEqual(0.3);
      expect(roundNumber(-0.1 + -0.2, 1)).toEqual(-0.3);
    });
  });

  describe('Given a number to truncate', () => {
    it('Then number is truncated according to provided number of decimals', async () => {
      expect(truncateNumber(1.0123456789, 0)).toEqual(1);
      expect(truncateNumber(1.0123456789, 1)).toEqual(1.0);
      expect(truncateNumber(1.0123456789, 2)).toEqual(1.01);
      expect(truncateNumber(1.0123456789, 3)).toEqual(1.012);
      expect(truncateNumber(1.0123456789, 4)).toEqual(1.0123);
      expect(truncateNumber(1.0123456789, 5)).toEqual(1.01234);
      expect(truncateNumber(1.0123456789, 6)).toEqual(1.012345);
      expect(truncateNumber(1.0123456789, 7)).toEqual(1.0123456);
      expect(truncateNumber(1.0123456789, 8)).toEqual(1.01234567);
      expect(truncateNumber(1.0123456789, 9)).toEqual(1.012345678);
      expect(truncateNumber(1.0123456789, 10)).toEqual(1.0123456789);
      expect(truncateNumber(1.0123456789, 11)).toEqual(1.0123456789);

      expect(truncateNumber(-1.0123456789, 0)).toEqual(-1);
      expect(truncateNumber(-1.0123456789, 1)).toEqual(-1.0);
      expect(truncateNumber(-1.0123456789, 2)).toEqual(-1.01);
      expect(truncateNumber(-1.0123456789, 3)).toEqual(-1.012);
      expect(truncateNumber(-1.0123456789, 4)).toEqual(-1.0123);
      expect(truncateNumber(-1.0123456789, 5)).toEqual(-1.01234);
      expect(truncateNumber(-1.0123456789, 6)).toEqual(-1.012345);
      expect(truncateNumber(-1.0123456789, 7)).toEqual(-1.0123456);
      expect(truncateNumber(-1.0123456789, 8)).toEqual(-1.01234567);
      expect(truncateNumber(-1.0123456789, 9)).toEqual(-1.012345678);
      expect(truncateNumber(-1.0123456789, 10)).toEqual(-1.0123456789);
      expect(truncateNumber(-1.0123456789, 11)).toEqual(-1.0123456789);

      expect(truncateNumber(1.005, 2)).toEqual(1.0);
      expect(truncateNumber(1.555, 2)).toEqual(1.55);
      expect(truncateNumber(1.3549999999999998, 2)).toEqual(1.35);

      expect(truncateNumber(-1.005, 2)).toEqual(-1.0);
      expect(truncateNumber(-1.555, 2)).toEqual(-1.55);
      expect(truncateNumber(-1.3549999999999998, 2)).toEqual(-1.35);

      expect(truncateNumber(0.5, 0)).toEqual(0);
      expect(truncateNumber(1.25, 1)).toEqual(1.2);
      expect(truncateNumber(234.20405, 4)).toEqual(234.204);
      expect(truncateNumber(234.2040500000006, 4)).toEqual(234.204);

      expect(truncateNumber(-0.5, 0)).toEqual(-0);
      expect(truncateNumber(-1.25, 1)).toEqual(-1.2);
      expect(truncateNumber(-234.20405, 4)).toEqual(-234.204);
      expect(truncateNumber(-234.204050000006, 4)).toEqual(-234.204);

      expect(truncateNumber(0.1 + 0.2, 1)).toEqual(0.3);
      expect(truncateNumber(-0.1 + -0.2, 1)).toEqual(-0.3);
    });
  });
});
