import mongoose, { Schema, type Types, type Model } from 'mongoose'

export type MongodbUserEntity = {
  createdAt: Date
  email: string
  emailConfirmed: boolean
  groups?: Types.ObjectId[]
  id: string
  locale: string
  name: string
  password: string
  token: string
  updatedAt: Date
}

const userSchema = new Schema<MongodbUserEntity>({
  createdAt: Date,
  email: String,
  emailConfirmed: Boolean,
  groups: [{
    ref: 'Group',
    type: Schema.Types.ObjectId
  }],
  id: String,
  locale: String,
  name: String,
  password: String,
  token: String,
  updatedAt: Date
})

export const MongodbUserModel: Model<MongodbUserEntity> = mongoose.models.user || mongoose.model('user', userSchema)
