const prompt = require("prompt-sync")();
// I learned how to take user input using prompt-sync from the article linked below
// https://www.codecademy.com/article/getting-user-input-in-node-js
const { createDb, initSchema, closeDb, run, get, all } = require("./eventsDB");
const { addEvent, addAttendee } = require("./eventsRepo");

//AI was used for assistance with the fs and path parts of this
//assignment, as when simply doing await closeDb() it wasnt actually deleting
//the file that was being created in the data folder, causing issues, so I used
//AI to teach me what the syntax is to ensure the file is deleted after each test
const fs = require("fs");
const path = require("path");

//path to db file
//path variable - AI assistance
const dbPath = path.resolve(__dirname, "../data/events.db");

async function main() {
  //fs variable was used with AI assistance (explained at the top of the file)
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  //Create and initialize a DB
  let db = createDb();
  await initSchema(db);
  //Set the eventLoop to true by default
  let eventLoop = true;
  //While the eventLoop is still active, prompt the user for the event name and date
  while (eventLoop === true) {
    const name = prompt("What is the event name? ");
    const date = prompt("What is the event date? ");

    //After getting the event info, call the addEvent function
    const newEvent = await addEvent(db, {
      eventName: name,
      date: date,
    });

    //Set the attendeeLoop to true by default
    let attendeeLoop = true;
    //While the attendeeLoop is active, prompt the user for attendee information
    while (attendeeLoop === true) {
      const attendeeName = prompt("Enter name of attendee ");
      const attendeeEmail = prompt("Enter email of attendee ");
      let attendeeCheckedIn = prompt(
        `is ${attendeeName} ready to check in? (Y or N)`,
      );
      while (
        attendeeCheckedIn != "Y" &&
        attendeeCheckedIn != "y" &&
        attendeeCheckedIn != "n" &&
        attendeeCheckedIn != "N"
      ) {
        attendeeCheckedIn = prompt(
          `Invalid answer, please re-enter - Is ${attendeeName} ready to check in? (Y or N)`,
        );
      }
      if (attendeeCheckedIn === "Y" || attendeeCheckedIn === "y") {
        attendeeCheckedIn = true;
      } else {
        attendeeCheckedIn = false;
      }
      //Call the addAttendee function
      await addAttendee(db, {
        name: attendeeName,
        email: attendeeEmail,
        eventId: newEvent.eventId,
        checkedIn: attendeeCheckedIn,
      });
      const attendeeResponse = prompt("Enter another attendee? (Y or N) ");
      //Ask the user if they want to add another attendee, if the answer is no,
      //then change the attendeeLoop variable to false, breaking the loop
      while (
        attendeeResponse != "Y" &&
        attendeeResponse != "y" &&
        attendeeResponse != "n" &&
        attendeeResponse != "N"
      ) {
        attendeeResponse = prompt(
          "Invalid answer, please re-enter - Enter another attendee? (Y or N) ",
        );
      }
      if (attendeeResponse === "N" || attendeeResponse == "n") {
        attendeeLoop = false;
      }
    }
    //Prompt the user to enter another event, if they decline, break the eventLoop
    const response = prompt("Enter another event? (Y or N) ");
    if (response === "N" || response == "n") {
      eventLoop = false;
    }
  }

  console.log("================Events=============");
  const events = await all(db, "SELECT * FROM events"); //Get all events from the DB

  //Loop through all the events and display the info
  for (const event of events) {
    console.log(`ID: ${event.eventId}`);
    console.log(`Name: ${event.eventName}`);
    console.log(`Date: ${event.date}`);
    console.log("-------Attendees-------");
    //Get all attendees from the DB
    const attendees = await all(
      db,
      "SELECT * FROM attendees WHERE eventId = ?",
      [event.eventId],
    );
    //Get the number of checkedIn attendees to be displayed later on
    const numbCheckedIn = await get(
      db,
      "SELECT count(*) AS count FROM attendees WHERE checkedIn = 1 AND eventId = ?", //AI was used for assistance with this query because I
      //Was not sure how to call count later on
      [event.eventId],
    );
    //Create an empty array for the checkedInAttendees
    const checkedInAttendees = [];
    //Loop through all attendees to see if they are checked in and display their info,
    //If they are checkedIn then add them to the checkedInAttendees array
    for (const attendee of attendees) {
      console.log(`ID: ${attendee.id}`);
      console.log(`Name: ${attendee.name}`);
      console.log(`Email: ${attendee.email}`);
      console.log(`Checked in? ${attendee.checkedIn ? "true" : "false"}`);
      if (attendee.checkedIn) {
        checkedInAttendees.push(attendee);
      }
    }
    //Display number of checked in Attendees as well as the info of all checked in attendents
    console.log(`Number of checked in Attendants: ${numbCheckedIn.count}`);
    console.log("========= All Checked In Attendants ===========");
    for (const checkedIn of checkedInAttendees) {
      console.log(`Name: ${checkedIn.name}`);
      console.log(`Email: ${checkedIn.email}`);
    }
    console.log("---------------------------");
  }
  console.log("===================================");
  await closeDb(db);
}

main(); //Call the async function that all the code was written in
