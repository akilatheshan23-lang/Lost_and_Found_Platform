const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const SALT_ROUNDS = 10;

const hashIfNeeded = async (password) => {
    if (!password || password.startsWith('$2')) {
        return password;
    }
    return bcrypt.hash(password, SALT_ROUNDS);
};

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        required: true,
        default: 'student'
    },
    studentID: {
        type: String,
        required: true,
        trim: true
    },
    faculty: {
        type: String,
        required: true 
    },
    contactNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    mfaEnabled: {
        type: Boolean,
        default: false,
    },
    mfaSecret: {
        type: String,
    },
    mfaTempSecret: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiry: {
        type: Date,
    },
    
}, { timestamps: true });

UserSchema.pre('save', async function hashPasswordOnSave() {
    if (!this.isModified('password')) {
        return;
    }

    this.password = await hashIfNeeded(this.password);
});

UserSchema.pre('findOneAndUpdate', async function hashPasswordOnUpdate() {
    const update = this.getUpdate();

    if (!update) {
        return;
    }

    const updateContainer = update.$set || update;

    if (!updateContainer.password) {
        return;
    }

    updateContainer.password = await hashIfNeeded(updateContainer.password);

    if (update.$set) {
        update.$set = updateContainer;
    } else {
        this.setUpdate(updateContainer);
    }
});

module.exports = mongoose.model('UserModel', UserSchema);
