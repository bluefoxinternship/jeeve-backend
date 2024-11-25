import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      default: null,
    },
    middle_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    date_of_birth: {
      type: Date,
      required: true, // Required for registration
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", null],
      default: null,
    },
    mobile: {
      type: String,
      required: true, // Required for registration
      unique: true,
    },
    home_phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
      unique: true, // Add uniqueness if email is to be made unique in the future
      sparse: true, // Allows null values to exist with unique constraint
    },
    address: [
      {
        type: new mongoose.Schema({
          address_label: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          country: { type: String, required: true },
          area: { type: String, required: true },
          landmark: { type: String, required: true },
          alternate_number: { type: String, default: null }, // optional for shipping address
        }),
        default: [],
      },
    ],
    blood_group: {
      type: String,
      default: null,
    },
    profile_image: {
      type: String, // URL or file path
      default: null,
    },
    inventory_reference: {
      type: String,
      default: null,
    },
    user_id: {
      type: String,
      default: null,
      unique: true,
    },
    user_type: {
      type: String,
      enum: ["patient", "admin", "vendor", null],
      required: true,
      default: "patient", // Default user type
    },
    referral_code: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true, // Required for registration
    },
    // Added shipment details and user location
    shipment_details: [
      {
        type: new mongoose.Schema({
          shipment_id: { type: String, required: true },
          shipping_address: {
            type: new mongoose.Schema({
              address_label: { type: String, required: true },
              city: { type: String, required: true },
              state: { type: String, required: true },
              country: { type: String, required: true },
              area: { type: String, required: true },
              landmark: { type: String, required: true },
              alternate_number: { type: String, default: null },
            }),
            required: true,
          },
          tracking_number: { type: String, required: true },
          shipment_status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "returned"],
            default: "pending",
          },
          delivery_date: { type: Date, default: null },
        }),
        default: [],
      },
    ],
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export  default mongoose.model("User", userSchema);

