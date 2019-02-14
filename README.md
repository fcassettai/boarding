# Boarding

## Screenshots

![image](https://user-images.githubusercontent.com/5306791/52781926-0c181d00-304e-11e9-8a2c-0f2221503d61.png)


## TODO
- Improve the README file: explain the project, put a link, put a screenshot, explain how to execute the project (`npm install; npm run dev`, `.env` file)
- Put all the HBS helpers in a separate file, for example: `config/hbs-helpers.js`
- Create a middleware `checkRole` and add it in many routes:
  - `GET /add-event`
  - `POST /add-event`
- Add a favicon
- Sort games by name is the `<select>`
- Don't display events in the past
- Add a start date and end date parameter. It should add in the URL: `?start-date=2019-02-14&end-date=2019-02-20&`
- Reindent the files