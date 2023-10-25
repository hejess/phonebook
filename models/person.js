const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to ', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Contact name required'],
    minlength: [3, 'Contact name must be at least 3 characters']
  },
// A phone number must:
// have length of 8 or more
// be formed of two parts that are separated by -, 
// the first part has two or three numbers and the second part also consists of numbers
  number: {
    type: String,
    required: [true, 'Contact number required'],
    minlength: [8, 'Contact number must be at least 8 characters, including -'],
    validate: { 
        validator: function(v) {
          return /^\d{2,3}-\d+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! The first part has two or three numbers and the second part also consists of numbers`
      }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)