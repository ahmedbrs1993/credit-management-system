import { Credits } from '../utils/types';

export const maxCredits: Credits = { A: 10, B: 10, C: 15 };

export const generateCredit = (max: number): number => {
  return Math.floor(Math.random() * (max * 0.2)) + max * 0.8;
};

export const isValidActionType = (type: any): type is keyof Credits => {
  return ['A', 'B', 'C'].includes(type);
};
