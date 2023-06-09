import *  as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MovieSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    id: {
        type: Number
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    releaseYear: {
        type: Number
    },
    genre: {
        type: Array
    },
    rating: {
        type: Number
    },
    poster: {
        type: String
    }

},
    { timestamps: true })