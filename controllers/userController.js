const Joi = require('joi');
const userModel = require('../models/userModle');

const createUserHandler = async (request, h) => {
  const { error, value } = Joi.validate(request.payload, userSchema);

  if (error) {
    return h.boom.badRequest(error.details[0].message);
  }

  const existingUser = await userModel.getUserByEmail(value.email);
  if (existingUser) {
    return h.boom.badRequest('Email already exists');
  }

  try {
    const userId = await userModel.createUser(value);
    return h.response().created(`/users/${userId}`);
  } catch (err) {
    console.error(err);
    return h.internalServerError();
  }
};

const userSchema = Joi.object({
  firstName: Joi.string().required().max(50),
  lastName: Joi.string().required().max(50),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  email: Joi.string(),
  password: Joi.string().min(6).required(),
  address: Joi.string().allow(''),
  city: Joi.string().allow(''),
  postalCode: Joi.string().allow(''),
  country: Joi.string().allow(''),
  profileImage: Joi.string().allow(''),
});

module.exports = { createUserHandler,userSchema };
