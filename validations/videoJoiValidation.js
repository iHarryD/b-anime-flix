const Joi = require("@hapi/joi");

module.exports = function (data) {
  const videoJoiSchema = Joi.object({
    title: Joi.string().required(),
    url: Joi.string().required(),
    description: Joi.string().optional(),
  });
  return videoJoiSchema.validate(data);
};
