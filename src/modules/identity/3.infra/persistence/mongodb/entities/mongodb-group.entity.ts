import mongoose, { Schema, type Types, type Model } from 'mongoose'

export type MongodbGroupEntity = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  users?: Types.ObjectId[]
}

const groupSchema = new Schema<MongodbGroupEntity>({
  createdAt: Date,
  id: String,
  name: String,
  updatedAt: Date,
  users: [{
    ref: 'User',
    type: Schema.Types.ObjectId
  }]
})

export const MongodbGroupModel: Model<MongodbGroupEntity> = mongoose.models.group || mongoose.model('group', groupSchema)
