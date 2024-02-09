import mongoose from 'mongoose';

const favoritesongSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    browseId: {
        type: String,
        required: true,
    },
});

const favoritesongModel = mongoose.model('favoritesongs', favoritesongSchema);

export default favoritesongModel;