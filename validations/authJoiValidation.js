const Joi = require("@hapi/joi");

function signupJoiValidation(data) {
  const signupJoiSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return signupJoiSchema.validate(data);
}

function loginJoiValidation(data) {
  const loginJoiSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return loginJoiSchema.validate(data);
}

module.exports.signupJoiValidation = signupJoiValidation;
module.exports.loginJoiValidation = loginJoiValidation;
