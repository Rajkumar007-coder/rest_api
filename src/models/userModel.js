const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    useremail: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]

})



//we are hashing the password

userSchema.pre("save", async function (next)
{
    if (this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 12);
    }
    next();
});

//we are generating token

userSchema.methods.generateAuthToken = async function ()
{
    try
    {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error)
    {
        res.status(402).json({ error: "Not Generated" });
    }
}

const UserData = new mongoose.model("user", userSchema);
module.exports = UserData;