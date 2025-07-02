export type ActionType = 'A' | 'B' | 'C';

export interface Action {
  type: ActionType;
  credits: number;
}

export interface Credits {
  A: number;
  B: number;
  C: number;
}
