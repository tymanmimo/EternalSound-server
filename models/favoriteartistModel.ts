import mongoose from 'mongoose';

const favoriteartistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    browseId: {
        type: String,
        required: true,
    },
});

const favoriteartistModel = mongoose.model('favoriteartists', favoriteartistSchema);

export default favoriteartistModel;