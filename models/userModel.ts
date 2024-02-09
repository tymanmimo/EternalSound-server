import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    Login:{
        type: String,
        required: true,
        unique: true,
    },
    Password:{
        type: String,
        required: true,
    }
});

const userModel = mongoose.model('users', userSchema);

export default userModel;