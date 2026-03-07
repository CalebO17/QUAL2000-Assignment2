const sqlite3 = require("sqlite3");
const fs = require("fs");
const path = require("path");

//AI was used a small amount for this file  because this file was written
//primarily using reference material from another lab we were given but
//I used AI to help me understand and have things explained to me so instead
//of mindlessly copying code from another lab I was writing things and understanding
//why I was writing them a bit more. I also ran into a bug where my tests wouldnt run
//and AI told me to add "type: commonjs" into the package-lock.json file, which I did.
//But it wont allow me to add comments to that file which is why I am mentioning it here

//Github action workflow was having some problems finding
//the place to put the DB file so using the help of copilot
//I created the dataDir code below which creates a variable representing
//the file path to the data folder and if it cant find it, it will
//create it itself including any parent folders

const dataDir = path.resolve(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true }); //create the folder if it doesn't exist
}

//Used copilot to again help me adjust my createDB function a bit to
//create a filepath variable to be passed in by combining the directory
//and the "events.db", because github actions workflow was having issues
const createDb = (filename = path.join(dataDir, "events.db")) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filename, (err) => {
      if (err) return reject(err);
      resolve(db);
    });
  });
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
