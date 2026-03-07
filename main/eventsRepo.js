const { run, get, all } = require("./eventsDB");

//Validate email function
const validateEmail = (email) => {
  let validation = true;
  if (typeof email != "string") {
    validation = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //AI was used to assist with learning the Regex here
    if (!emailRegex.test(email)) {
      validation = false;
    }
  }
  return validation;
};

//Function to validate the date
const validateDate = (date) => {
  let validation = true;
  if (typeof date !== "string") {
    validation = false;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    //AI was used to assist with learning the regex here
    validation = false;
  }
  const parsedDate = new Date(date); //AI was used for assistance with this part because I wanted to learn how to actually
  //Ensure a calender date was valid and used properly
  if (
    isNaN(parsedDate.getTime()) ||
    !parsedDate.toISOString().startsWith(date)
  ) {
    validation = false;
  }
  return validation;
};

//Function for validating the event
const validateEvent = (event) => {
  if (!event || typeof event !== "object") {
    throw new TypeError("event must be an object");
  }
  if (typeof event.eventName !== "string" || event.eventName.trim() === "") {
    throw new TypeError("event name be a non empty string");
  }
  let dateValidation = validateDate(event.date);
  if (dateValidation === false) {
    throw new TypeError("invalid date was entered.");
  }
};

//Function for validating the attendee
const validateAttendee = (attendee) => {
  if (!attendee || typeof attendee !== "object") {
    throw new TypeError("attendee must be an object");
  }
  if (typeof attendee.name !== "string" || attendee.name.trim() === "") {
    throw new TypeError("attendee name be a non empty string");
  }
  let validation = validateEmail(attendee.email);
  if (validation === false) {
    throw new TypeError("invalid email entered");
  }
  if (typeof attendee.checkedIn !== "boolean") {
    throw new TypeError("event checkedIn must be a bool");
  }
};

//Function to add an Event to the DB
const addEvent = async (db, event) => {
  validateEvent(event);
  const result = await run(
    db,
    "INSERT INTO events (eventName, date) VALUES (?, ?)",
    [event.eventName, event.date],
  );

  return {
    eventId: result.lastID, 
    eventName: event.eventName,
    date: event.date,
  };
};

//Function to add an attendee to the DB
const addAttendee = async (db, attendee) => {
  validateAttendee(attendee);
  const result = await run(
    db,
    "INSERT INTO attendees (name, email, eventId, checkedIn) VALUES (?, ?, ?, ?)",
    [attendee.name, attendee.email, attendee.eventId, attendee.checkedIn],
  );

  return {
    id: result.lastID, 
    name: attendee.name,
    email: attendee.email,
    eventId: attendee.eventId,
    checkedIn: attendee.checkedIn,
  };
};

module.exports = {
  addEvent,
  addAttendee,
  validateAttendee,
  validateEvent,
};
