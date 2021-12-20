const cloudinary = require("cloudinary").v2;
const stripe = require("stripe")(process.env.PRIVATE_KEY);

// cloudinary
const uploadPhoto = async (path, options) => {
  try {
    const photo = await cloudinary.uploader.upload(path, options);
    return photo;
  } catch (error) {
    return error;
  }
};

const deletePhoto = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return;
  } catch (error) {
    return error;
  }
};

// stripe
const payment = async (amount, title) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "eur",
      description: `Paiement vinted pour : ${title}`,
    });
    return paymentIntent;
  } catch (error) {
    return error;
  }
};

module.exports = { uploadPhoto, deletePhoto, payment };
