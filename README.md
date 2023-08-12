# Interview Scheduler

## Description

Interview Scheduler is a single-page application (SPA) that allows users to book technical interviews between students and mentors.

- Appointments can be between the hours of 12 PM and 5 PM, Monday to Friday.
- Each appointment has one student and one interviewer.
- When creating a new appointment, the user can enter any student name while the interviewer is chosen from a predefined list.
- The user can save the appointment and view the entire schedule of appointments on any day of the week.
- Appointments can also be edited or deleted.

The front end of this project is built with React and makes requests to an API to fetch and store appointment data from a database.

This project was developed as part of Lighthouse Labs Web Development course.

## Demo

![Scheduler Demo](https://github.com/IrinaGM/scheduler/blob/master/docs/Scheduler.gif)

## Dependencies

- [axios](https://www.npmjs.com/package/axios)
- [classnames](https://www.npmjs.com/package/classnames)
- [normalize.css](https://www.npmjs.com/package/normalize.css)
- [react](https://react.dev/learn/installation)

## Dev Dependencies

- [storybook](https://storybook.js.org/)
- [testing-library](https://testing-library.com/)
- [prop-types](https://www.npmjs.com/package/prop-types)
- [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library)
- [react-test-renderer](https://www.npmjs.com/package/react-test-renderer)
- [sass](https://sass-lang.com/)

## Setup

1. Make sure you are running node v12.x.x by running the following command: `node -v`
2. Clone [this](https://github.com/IrinaGM/scheduler) repo to your local working directory
3. From the root directory of your localy cloned repo run `npm install`
4. To setup the backend API server clone the [Scheduler-api](https://github.com/IrinaGM/scheduler-api) to a **new** directory in your local working directory and follow the instructions in the [Scheduler-api README.md](https://github.com/IrinaGM/scheduler-api#readme).

## Running Webpack Development Server

```sh
npm start
```

Visit [http://localhost:8000](http://localhost:8000) in the browser

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

Visit [http://localhost:9009/](http://localhost:9009/) in the browser

## License

[MIT License](https://choosealicense.com/licenses/mit/)

Copyright (c) 2023 IrinaGM
