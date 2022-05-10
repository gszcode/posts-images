const { Schema, model } = require('mongoose');
const bcript = require('bcryptjs');

const UserSchema = new Schema({
    user: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokenConfirm: {
        type: String,
        default: null
    },
    accountConfirm: {
        type: Boolean,
        default: false 
    },
    timestamp: {
        type: Date
    }
});

// encryption password
UserSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified('password')) return next();

    try {
        const salt = await bcript.genSalt(10);
        const hash = await bcript.hash(user.password, salt);

        user.password = hash;
        next();
    } catch (error) {
        console.log(error);
        return res.json({Error: error.message});
    }
})

// compare passwords
UserSchema.methods.comparePassword = async function(password){
    return await bcript.compare(password, this.password);
}

module.exports = model('User', UserSchema);