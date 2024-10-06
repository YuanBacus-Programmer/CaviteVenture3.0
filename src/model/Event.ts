import { Schema, model, models } from 'mongoose'

const eventSchema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
})

const Event = models.Event || model('Event', eventSchema)

export default Event
