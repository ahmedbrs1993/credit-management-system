import app from './app/app';
import { clearActionsTable } from './database';
import { maxCredits, generateCredit } from './app/services/credits';
import {
  setCredits,
  resetQueue,
  handleExecutedAction,
} from './app/controllers/actions';

const port = 3000;

const calculateCredits = async (force = false) => {
  const lastCalc = globalThis.lastCreditCalc ?? 0;
  const now = Date.now();
  const tenMinutes = 600_000;

  if (force || now - lastCalc >= tenMinutes) {
    setCredits({
      A: generateCredit(maxCredits.A),
      B: generateCredit(maxCredits.B),
      C: generateCredit(maxCredits.C),
    });
    globalThis.lastCreditCalc = now;
    resetQueue();
    await clearActionsTable();
  }
};

calculateCredits(true);

const intervalId = setInterval(() => {
  calculateCredits(false);
  handleExecutedAction();
}, 15000);

export const server = app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

server.on('close', () => clearInterval(intervalId));
