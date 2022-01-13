const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  branch_id: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "branches",
  },
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  contact_person: {
    type: String,
    required: false,
  },
  contact_person_surname: {
    type: String,
    required: false,
  },
  designation: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  country_id: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "country",
  },
  state_id: {
    type: String,
    required: false,
  },
  city_id: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "city",
  },
  agency_code: {
    type: String,
    required: false,
  },
  iata: {
    type: String,
    required: false,
  },
  currency_id: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "currency",
  },
  business_type: {
    type: String,
    required: false,
  },
  payment_mode: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  type_of_company: {
    type: String,
    required: false,
  },
  balance: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  is_subscribed: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: false,
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "users",
  },
  privileges: {
    type: String,
    required: false,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  loginType: {
    type: String,
    required: false,
  },
  stories: {
    type: Array,
    required: false,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
