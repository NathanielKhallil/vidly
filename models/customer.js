import Joi from "joi";
import mongoose from "mongoose";

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    isGold: false,
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxlength: 20,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 20,
    },
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(20).required(),
    phone: Joi.string().min(10).max(20).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
