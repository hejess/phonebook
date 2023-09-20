https://phonebook-api-7rpq.onrender.com

This is the backend.
The frontend is in fullstackOpen/part2/phonebook

run "npm run build" in the frontend root dir and
copy the "build" folder to the root of the backend repo

use the middleware to show static content in the "build" folder
app.use(express.static('build'))