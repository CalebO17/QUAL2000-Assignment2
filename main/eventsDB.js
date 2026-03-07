const sqlite3 = require("sqlite3");

//AI was used a bit for this file primarily because this file was written
//primarily using reference material from another lab we were given but
//I used AI to help me understand and have things explained to me so instead
//of mindlessly copying code from another lab I was writing things and understanding
//why I was writing them a bit more. I also ran into a bug where my tests wouldnt run
//and AI told me to add "type: commonjs" into the package-lock.json file, which I did.
//But it wont allow me to add comments to that file which is why I am mentioning it here

const createDb = () => {
  return new sqlite3.Database("../data/events.db");
};

const run = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) {
        return reject(error);
      }
      resolve(this);
    });
  });
};

const get = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        return reject(error);
      }
      resolve(row);
    });
  });
};

const all = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        return reject(error);
      }
      resolve(rows);
    });
  });
};

const initSchema = async (db) => {
  await run(
    db,
    `CREATE TABLE events (
      eventId INTEGER PRIMARY KEY AUTOINCREMENT ,
      eventName TEXT NOT NULL UNIQUE,
      date DATETIME NOT NULL
    )`,
  );

  await run(
    db,
    `CREATE TABLE attendees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      eventId INTEGER NOT NULL,
      checkedIn BOOL,
      FOREIGN KEY (eventId) REFERENCES events(eventId)
    )`,
  );
};
const closeDb = (db) => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = {
  createDb,
  initSchema,
  run,
  get,
  all,
  closeDb,
};
