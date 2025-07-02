import express from 'express';
import bodyParser from 'body-parser';
import {
  fetchActionsFromDB,
  addActionToDB,
  clearActionsTable,
} from './database'; // Ensure the path is correct
import { Request, Response, NextFunction } from 'express'; // make sure this is at the top

export const app = express();
const port = 3000;

app.use(bodyParser.json());

interface Action {
  type: 'A' | 'B' | 'C';
  credits: number;
}

interface Credits {
  A: number;
  B: number;
  C: number;
}

let actionQueue: Action[] = [];
let credits: Credits = { A: 0, B: 0, C: 0 };

let lastCreditCalculation = Date.now();
const maxCredits = { A: 10, B: 10, C: 15 };

const calculateCredits = async (force = false) => {
  if (force || Date.now() - lastCreditCalculation >= 600000) {
    credits = {
      A: Math.floor(Math.random() * (maxCredits.A * 0.2)) + maxCredits.A * 0.8,
      B: Math.floor(Math.random() * (maxCredits.B * 0.2)) + maxCredits.B * 0.8,
      C: Math.floor(Math.random() * (maxCredits.C * 0.2)) + maxCredits.C * 0.8,
    };
    lastCreditCalculation = Date.now();
    actionQueue = [];
    await clearActionsTable();
  }
};

calculateCredits(true);

app.get('/actions', async (req, res) => {
  try {
    const actions = await fetchActionsFromDB();
    res.json({
      actions,
      credits,
      pendingActions: actionQueue,
    });
  } catch (error) {
    console.error('Error fetching actions:', error);
    res.status(500).json({ message: 'Error fetching actions' });
  }
});

app.post('/actions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.body;
    let credit: number;

    if (type !== 'A' && type !== 'B' && type !== 'C') {
      res.status(400).json({ message: 'Invalid action type' });
    }

    if (actionQueue.length > 0) {
      const lastAction = actionQueue
        .slice()
        .reverse()
        .find((action) => action.type === type);
      if (lastAction) {
        credit = lastAction.credits - 1;
      } else {
        credit = credits[type];
      }
    } else {
      credit = credits[type];
    }

    actionQueue.push({ type, credits: credit });
    res.status(201).json({ message: 'Action added', queue: actionQueue });
  } catch (error) {
    console.error('Error adding action:', error);
    res.status(500).json({ message: 'Error adding action' });
  }
});

const intervalId = setInterval(async () => {
  calculateCredits(false);

  if (actionQueue.length > 0) {
    const action = actionQueue.shift();

    if (action) {
      if (credits[action.type] > 0) {
        credits[action.type]--;

        console.log(
          `Executed action of type ${action.type}. Remaining credits:`,
          credits
        );
        await addActionToDB(action.type, action.credits);
      } else {
        console.log(`No credits left for action type ${action.type}.`);
      }
    }
  }
}, 15000);

export const server = app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});

server.on('close', () => {
  clearInterval(intervalId);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
