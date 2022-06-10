const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please provide the valid email address");
      }
    },
  },
  admin:{
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
  },
  phone: {
    type: Number,
    required: true,
    unique: true
  },
  tokens:[{
    token: {
      type: String,
      required:true
    }
  }]
},{
  timestamps:true
});

userSchema.methods.getUserProfile = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.createToken = async function (_id) {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY, {expiresIn: '24h'})
  
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.statics.findByInput = async(email, password) => {
  const user = await User.findOne({ email })

  if(!user){
    throw new error('No user found with this Email')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    throw new error('Password does not match')
  }
  return user
} 

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
