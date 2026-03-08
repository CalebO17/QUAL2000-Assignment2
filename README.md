# Event Registration System

## An event registration system that allows for registration of events and attendees into an Sqlite3 database, as well as thorough QA Unit and Integration testing of the program

This project uses Javascript, Sqlite3, and QA concepts to create a program that allows for event creation into a database, as well as attendees for the events. It also features thorough testing of the program to ensure quality.

## Tech Stack

- Node.js
- Sqlite3
- Visual Studio Code

## Features

- Event creation with user input going into an Sqlite3 database
- Attendee registration with user input going into an Sqlite3 database
- Sqlite3 database with tables representing events and attendees
- Unit and Integration tests to ensure a quality program

## Installation

Ensure that Visual Studio Code is installed on your local device

To install the Event Registration System, you must first clone the repository to your local PC.

```bash
  git clone https://github.com/CalebO17/QUAL2000-Assignment2
```

Open the cloned repository inside of Visual Studio Code and run npm install (inside the terminal)

![A screenshot taken inside of the terminal showcasing the npm install command being successfully run]((https://github.com/user-attachments/assets/47fa20a4-4bde-4847-b86f-27be7c484179))

## Running the program

Once all of the above steps are complete, you must ensure you are inside of the main folder (if you are not, enter 'cd main' into the terminal).

Once in the main folder, enter 'node eventSystem.js' into the terminal to run the program.

You will then be prompted to enter information about events and attendees, which will then be entered into a database and output to the console.

![Image showcasing the user input being requested inside of the terminal](https://github.com/user-attachments/assets/3a4f7453-590d-4585-97a7-765ffd7201e5)

(NOTE: If running this program multiple times, please ensure that you delete the database file from the 'data' folder);

## Running the Unit & Integration tests

To run the tests, you must ensure you are in the tests folder. You can do this by entering 'cd tests' into the terminal or if you are currently in the 'main' folder, enter 'cd ../tests' into the terminal.

Once inside of the tests folder, simply enter 'node --test' into the console and the tests will run

![Image showcasing the tests running successfully in the console](https://github.com/user-attachments/assets/b07973be-a5bc-4c6b-9ddd-17b2c26e7791)

## Future Improvements

- Expanded database with more user information, as well as junction tables connecting the users with events so that one user can register for multiple events
- More visually pleasing console output

## Troubleshooting

- Ensure Visual Studio Code is properly installed on your device
- Delete the database from the 'data' folder after running the program and creating it (not required for the tests)
- Ensure the info being entered to the database is valid or you will recieve a TypeError

# License

MIT License

Copyright (c) [2026] [Caleb O'Hara]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

Created by Caleb O.  
Developed as an assignment for QUAL2000 using concepts learned in Computer Programming & Analysis at St. Lawrence College
