import mongoose from 'mongoose';

const favoriteplaylistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    browseId: {
        type: String,
        required: true,
    },
});

const favoriteplaylistModel = mongoose.model('favoriteplaylists', favoriteplaylistSchema);

export default favoriteplaylistModel;