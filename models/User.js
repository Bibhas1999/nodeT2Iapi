import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    token: [{ token: { type: String, required: true } }],
    active: { type: Boolean, default: false },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
