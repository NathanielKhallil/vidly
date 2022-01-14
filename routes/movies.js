import joi from joi;
import mongoose from mongoose;
const {genreSchema} = require('./genre');

const movie = mongoose.model('Movies', new mongoose.Schema({
    title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maLength: 255
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}))

function validateMovie(movie) {
    const schema = {
        title: joi.string().min(5).max(50).required(),
        genreId: joi.string().required(),
        numberInStock: joi.number().min(0).required()
    };
    return joi.validate(movie, schema)
}

