# Bike Sharing

[![Build Status](https://travis-ci.org/idewz/bike-vis.svg?branch=master)](https://travis-ci.org/idewz/bike-vis)

Bike Sharing [bike-vis.firebaseapp.com](https://bike-vis.firebaseapp.com)

CS 560 Final Project, University of San Francisco

By [Siwadon Saosoong](https://github.com/idewz) and [Surada Lerkpatomsak](https://github.com/slerkpatomsak)

### Project Structure

This is a `create-react-app` app with D3 chart components and Google Maps JavaScript API. The source files are inside `src/` and the data is in `public/data/ford_gobike`.

These are main chart components in `src/components/`

```bash
src/components
├── BarChart.js
├── GenderChart.js
├── MapContainer.js
├── MemberChart.js
├── MyMap.js
├── NestedMap.js
└── TimeMatrix.js
```

### Requirements

* `node` and [`yarn`](https://yarnpkg.com/en/) (or `npm`)

To begin the development, run `yarn start` (or `npm start`).

To create a production bundle, use `yarn build` (or `npm run build`).

### Data

We use data from Ford Gobike [historical trip data](https://s3.amazonaws.com/fordgobike-data/index.html) in 2017,
but we have modified the original file to make it smaller by extracting stations information into a separate file and replacing categorical fields with corresponding numbers.

They are available in [`public/data/ford_gobike/`](public/data/ford_gobike/).

### Materials

* [Process Book](materials/ProcessBook.pdf)
* [Presentation Slides](materials/Presentation.pdf)
