const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    enum: ['user', 'admin'],
    default: 'user'  // Default value for new users
  },
  address: {
    type: String,
    default: ''  // Default empty string, updated later
  }
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password in the User model
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET || "fixzy_secret_key", {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

// Prevent overwriting of the User model if it already exists
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
