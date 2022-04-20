import { sample } from 'lodash';
import { generate } from 'randomstring';

export const randomString = (): string => {
  return generate({ length: 10, charset: 'alphanumeric' });
};

export const randomNumber = (min?: number, max?: number): number => {
  const minValue = min || 1;
  const maxValue = max || 1_000_000;
  return Math.round((Math.random() * (maxValue - minValue) + minValue + Number.EPSILON) * 10_000) / 10_000;
};

export const randomPercentage = (): number => {
  return Math.round((Math.random() + Number.EPSILON) * 10_000) / 10_000;
};

export const randomSymbol = (): string => {
  const baseAsset = randomAsset();
  const quoteAsset = randomAsset();
  return `${baseAsset}#${quoteAsset}`;
};

export const randomAsset = (): string => {
  return randomString().substring(0, 3);
};

export const randomBoolean = (): boolean => {
  return randomFromList(['true', 'false']) === 'true';
};

export const randomFromList = <T>(list: T[]): T => {
  const value = sample(list);
  if (!value) {
    throw new Error(`Unable to get random value from list ${list}`);
  }
  return value;
};
