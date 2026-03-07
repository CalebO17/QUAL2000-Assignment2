//Title: events unit and integration test suites
//Day 03-03-2026
//Author: Caleb O'Hara

//imports
const test = require("node:test");
const assert = require("node:assert/strict");
const { createDb, initSchema, closeDb, get, all } = require("../main/eventsDB");
const {
  addEvent,
  addAttendee,
  validateEvent,
  validateAttendee,
} = require("../main/eventsRepo");
//AI was used for assistance with the fs and path parts of this
//assignment, as when simply doing await closeDb() it wasnt actually deleting
//the file that was being created in the data folder, causing issues, so I used
//AI to teach me what the syntax is to ensure the file is deleted after each test
const fs = require("fs");
const path = require("path");

//path to db file
//I ran into issues when testing github actions workflow, and I used
//copilot which helped me come up with the code below that will help prevent
//the "SQLITE_CANTOPEN" error that i was getting by
const dataDir = path.resolve(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.resolve(dataDir, "events.db");
//Global db variable
let db;

//Test suites
//Unit tests

test.describe("event service unit testing", () => {
  //Testing the validation of names
  test("Invalid event name being entered should throw a type error", async () => {
    assert.throws(
      () =>
        validateEvent({
          eventName: 9,
          date: "2020-01-02",
        }),
      TypeError,
    );
  });
  //Testing the validation of dates
  test("Invalid event date being entered should throw a type error", async () => {
    assert.throws(
      () =>
        validateEvent({
          eventName: "Birthday",
          date: "2020-02-30",
        }),
      TypeError,
    );
  });
  //Testing the validation of attendee names
  test("Invalid attendee name being entered should throw a type error", async () => {
    assert.throws(
      () =>
        validateAttendee({
          name: 67,
          email: "bob@gmail.com",
          eventId: 1,
          checkedIn: true,
        }),
      TypeError,
    );
  });
  //Testing the validation of attendee emails
  test("Invalid attendee email being entered should throw a type error", async () => {
    assert.throws(
      () =>
        validateAttendee({
          name: "Joe",
          email: "bob",
          eventId: 1,
          checkedIn: true,
        }),
      TypeError,
    );
  });
  //Testing the validation of checkedIn
  test("Invalid boolean being used for checkedIn should throw a type error", async () => {
    assert.throws(
      () =>
        validateAttendee({
          name: "Jeff",
          email: "bob@gmail.com",
          eventId: 1,
          checkedIn: 67,
        }),
      TypeError,
    );
  });
});

//Integration tests
test.describe("event service integration testing", () => {
  //Create a DB before each test
  test.beforeEach(async () => {
    db = await createDb();
    await initSchema(db);
  });
  //close and remove db after each test
  test.afterEach(async () => {
    await closeDb(db);
    //fs variable was used with AI assistance (explained at the top of the file)
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });
  //Smoke test to add an event to the DB
  test("addEvent to add a new event to the DB", async () => {
    const newEvent = await addEvent(db, {
      eventName: "Birthday",
      date: "2018-08-09",
    });
    assert.ok(newEvent.eventId);
  });
  //Smoke test to add an attendee to the DB
  test("addAttendee should add a new attendee to the DB", async () => {
    const newEvent = await addEvent(db, {
      eventName: "Birthday",
      date: "2018-08-09",
    });
    const newAttendee = await addAttendee(db, {
      name: "John",
      email: "John@gmail.com",
      eventId: newEvent.eventId,
      checkedIn: true,
    });
    assert.ok(newAttendee.id);
  });
  //Since event names are UNIQUE in mySQL, it should give a constraint error if the event name is entered multiple times
  test("Duplicate event name being entered should throw a constraint error", async () => {
    await addEvent(db, {
      eventName: "Anniversary",
      date: "2008-08-30",
    });
    await assert.rejects(
      addEvent(db, {
        eventName: "Anniversary",
        date: "2008-08-30",
      }),
      {
        message: /UNIQUE constraint failed/i,
      },
    );
  });
  //Since attendee emails are UNIQUE in mySQL, it should give a constraint error if the event name is entered multiple times
  test("Duplicate attendee email being entered should throw a constraint error", async () => {
    const newEvent = await addEvent(db, {
      eventName: "Anniversary",
      date: "2008-08-30",
    });
    await addAttendee(db, {
      name: "Bob",
      email: "bob@gmail.com",
      eventId: newEvent.eventId,
      checkedIn: true,
    });
    await assert.rejects(
      addAttendee(db, {
        name: "Joe",
        email: "bob@gmail.com",
        eventId: newEvent.eventId,
        checkedIn: true,
      }),
      {
        message: /UNIQUE constraint failed/i,
      },
    );
  });
  //Workflow test ensuring that an event can be created with attendees and the attendees can be grabbed later on
  test("Workflow test. Creating an event and attendees, and retrieving attendees", async () => {
    const newEvent = await addEvent(db, {
      eventName: "Anniversary",
      date: "2008-08-30",
    });
    await addAttendee(db, {
      name: "Bob",
      email: "bob@gmail.com",
      eventId: newEvent.eventId,
      checkedIn: true,
    });
    const attendees = await all(
      db,
      "SELECT * FROM attendees WHERE eventId = ?",
      [newEvent.eventId],
    );
    assert.strictEqual(attendees.length, 1);
    assert.strictEqual(attendees[0].name, "Bob");
  });
});
