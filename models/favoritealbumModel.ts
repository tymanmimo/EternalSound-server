import mongoose from 'mongoose';

const favoritealbumSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    browseId: {
        type: String,
        required: true,
    },
});

const favoritealbumModel = mongoose.model('favoritealbums', favoritealbumSchema);

export default favoritealbumModel;