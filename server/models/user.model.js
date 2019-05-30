import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    /**
     * Name
     */
    name: {
        type: String,
        trim: true,
        require: 'Name is required'
    },
    /**
     * Email
     */
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match:  [/.+\@.+\..+/, 'Please fill a valid email address'],
        // required: 'Email is required'
    },
    /**
     * Created and updated timestamps 
     */
    created: {
        type: Date,
        default: Date.now
    },
    update: Date,
    /**
     * Hashed password and salt
     */
    hashed_password: {
        type: String,
        // required: "Password is required"
    },
    salt: String
})
/**
 * Password for auth as a vitural field
 */
userSchema
    .virtual('password')
    .set((password) => {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(() => {
        return this._password
    })

/**
 * Encryption and authentication
 */
userSchema.method = {
    authenticate: (plainText) => {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: (password) => {
        if(!password) {
            return ''
        }
        try {
            return crypto.createHmac('sha1', this.salt)
                        .update(password)
                        .digest('hex')
        }
        catch (err) {
            return ''
        }
    },
    makeSalt: () => {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

/**
 * Password ﬁeld validation
 */

 userSchema.path('hashed_password').validate((v) => {
    if(this._password && this._password.length <6) {
        this.invalidate('password', 'Password must be at least 6 character')
    }
    if(this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
 }, null)

 export default mongoose.model('User', userSchema)