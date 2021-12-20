const cloudinary = require("cloudinary").v2;

const uploadPhoto = async (path, options) => {
  const photo = await cloudinary.uploader.upload(path, options);
  return photo;
};

const deletePhoto = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
  return;
};

module.exports = { uploadPhoto, deletePhoto };
