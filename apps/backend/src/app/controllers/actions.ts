import { Request, Response } from 'express';
import { Action, Credits } from '../utils/types';
import { isValidActionType } from '../services/credits';
import { fetchActionsFromDB, addActionToDB } from '../../database';

let actionQueue: Action[] = [];
let credits: Credits = { A: 0, B: 0, C: 0 };

export const setCredits = (newCredits: Credits) => {
  credits = newCredits;
};

export const getCredits = () => credits;
export const getQueue = () => actionQueue;
export const resetQueue = () => {
  actionQueue = [];
};

export const getActions = async (_req: Request, res: Response) => {
  const actions = await fetchActionsFromDB();
  res.json({ actions, credits, pendingActions: actionQueue });
};

export const postAction = (req: Request, res: Response): void => {
  const { type } = req.body;

  if (!isValidActionType(type)) {
    res.status(400).json({ message: 'Invalid action type' });
    return;
  }

  const lastAction = [...actionQueue].reverse().find((a) => a.type === type);
  const credit = lastAction ? lastAction.credits - 1 : credits[type];

  actionQueue.push({ type, credits: credit });
  res.status(201).json({ message: 'Action added', queue: actionQueue });
};

export const handleExecutedAction = async () => {
  const action = actionQueue.shift();
  if (action && credits[action.type] > 0) {
    credits[action.type]--;
    await addActionToDB(action.type, action.credits);
    console.log(`Executed ${action.type}. Remaining:`, credits);
  } else if (action) {
    console.log(`No credits left for ${action.type}`);
  }
};
