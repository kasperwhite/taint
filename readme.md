# Taint Messenger

Taint Messenger is a service that allows a group of people to exchange information safely and anonymously.

- Safe group communication
- Сontact management
- Change your personal secret at your discretion

## Features

- Change your personal secret as often as you like.
- You decide if you want to be involved in the conversation or not.
- No phone number needed, you communicate completely anonymously.
- Conversations don't last long, they get destroyed as quickly as you want.
- The entire conversation is fully encrypted and what should remain a secret will remain a secret.

## Tech

Taint uses a number of open source projects to work properly:

- [React Native](https://reactnative.dev/) - React Native combines the best parts of native development with React, a best-in-class JavaScript library for building user interfaces.
- [Express](https://expressjs.com/) - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [MongoDB](https://expressjs.com/) - Accelerate development, address diverse data sets, and adapt quickly to change with a proven application data platform built around the database most wanted by developers 4 years running.

And of course Taint itself is open source with a [public repository](https://github.com/keritea/Taint) on GitHub.

## Installation

Taint requires [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) to run.
Taint requires [Expo app](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) to run app on the your mobile phone.

Intall MongoDB and start the DB server.
```sh
cd server
npm i
npm run db-server
```

Install the dependencies and devDependencies and start the server.

```sh
cd server
npm i
npm start
```
