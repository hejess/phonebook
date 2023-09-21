https://phonebook-api-7rpq.onrender.com

This is the backend.
The frontend is in fullstackOpen/part2/phonebook

run "npm run build" in the frontend root dir and
copy the "build" folder to the root of the backend repo

use the middleware to show static content in the "build" folder
app.use(express.static('build'))


.env file is required, it should contain the URL to MongoDB

examples:
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]