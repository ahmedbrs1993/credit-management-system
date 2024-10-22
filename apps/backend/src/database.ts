import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  }
});

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS actions (type TEXT, credits INTEGER)');
});

export const fetchActionsFromDB = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM actions', (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const clearActionsTable = () => {
  return new Promise<void>((resolve, reject) => {
    db.run('DELETE FROM actions', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const addActionToDB = (type: string, credits: number) => {
  db.run('INSERT INTO actions (type, credits) VALUES (?, ?)', [type, credits]);
};
