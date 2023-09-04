# React Datetime Picker

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This component library is built with React and TailwindCSS, and it is highly customizable to meet the needs of any user. And it aims to provide a comprehensive solution for integrating calendar functionality into your React applications. It offers a collection of reusable components that will enable seamless date picking, time picking, and datetime picking capabilities. Multi-language support is in progress! 🚧

## Components

* **Date Picker**: Let's user select calendar date. ✅ 
* **Time Picker**: Let's user select time. ✅ 
* **DateTime Picker**: Let's user select date and time. ✅ 
* **Static Calendar**: Let's user select calendar date without popupover/modal. ✅ 
* **Static Desktop Time**: Let's user select time without popupover/modal. ✅ 
* **Static Mobile Time**: Let's user select time with clock layout and no popupover/modal. 🚧

## Before installation

You need to insall [Node.js](https://nodejs.org) and [Tailwind CSS](https://tailwindcss.com).

## Installation

1. Install react-datetime-picker

```bash
  npm install react-datetime-picker
  #or
  yarn add react-datetime-picker
  #or
  pnpm add react-datetime-picker
  ```

2. Then add `nedtTwPlugin` to your tailwind.config.js files:

```js
  import {
      nedtTwPlugin,
  } from 'react-datetime-picker';

  module.exports = {
      //...
      plugins: [nedtTwPlugin()],
  }
```

## Usage

```jsx
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  StaticCalendar,
  StaticDesktopTime,
} from 'react-datetime-picker';

import 'react-datetime-picker/dist/style.css';

const MyComponent = () => {
  return (
    <>
      <DatePicker />
      <TimePicker />
      <DateTimePicker />
      <StaticCalendar />
      <StaticDesktopTime/>
    </>
  );
};

export default MyComponent;
```

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](./LICENSE) file.

We welcome contributions from the open-source community to help us complete and improve this project. Feel free to create issues, submit pull requests, or reach out to the author for any feedback or questions.

Thank you for your interest in the React Datetime Picker! Together, we can make it a powerful tool for calendar integration in React applications.
