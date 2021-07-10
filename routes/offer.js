const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const User = require("../models/User");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/offers", async (req, res) => {
  try {
    let skip = 0;
    let offerPerPage = 5;
    let query = {};
    let sort = {};
    let result = await Offer.find().populate("owner");

    if (req.query.page) {
      if (!isNaN(req.query.page) && Number(req.query.page) > 0) {
        skip = offerPerPage * (Number(req.query.page) - 1);
      }
    }
    if (
      req.query.page &&
      (isNaN(req.query.page) || Number(req.query.page) <= 0)
    ) {
      console.log(typeof req.query.page);
      console.log(Number(req.query.page));
      res.status(400).json({
        message: "You must enter a positif number",
      });
    } else {
      if (req.query.title) {
        query.product_name = new RegExp(req.query.title, "i");
      }
      if (req.query.priceMax) {
        if (!isNaN(req.query.priceMax)) {
          query.product_price = {};
          query.product_price.$lte = req.query.priceMax;
        } else {
          res.status(400).json({
            message: "You must enter a number ",
          });
        }
      }
      if (req.query.priceMin) {
        if (!isNaN(req.query.priceMin)) {
          if (query.product_price) {
            query.product_price.$gte = req.query.priceMin;
          } else {
            query.product_price = {};
            query.product_price.$gte = req.query.priceMin;
          }
        } else {
          res.status(400).json({
            message: "You must enter a number ",
          });
        }
      }

      if (req.query.sort) {
        console.log("helllo");
        if (req.query.sort === "price-desc") {
          sort.product_price = -1;
        } else if (req.query.sort === "price-asc") {
          sort.product_price = 1;
        } else {
          res.status(400).json({
            message: "Sorting  error, you must enter price-desc or price-asc ",
          });
        }
        result = await Offer.find(query)
          .skip(skip)
          .limit(offerPerPage)
          .sort(sort)
          .populate("owner.account");
        let totalOffer = await Offer.find(query);
        let count = totalOffer.length;

        res.status(200).json({
          count: count,
          offers: result,
        });
      } else {
        result = await Offer.find(query)
          .select("product_name product_price")
          .skip(skip)
          .limit(offerPerPage);
        res.status(200).json(result);
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate({
      path: "owner",
      select: "account.username account.phone account.avatar",
    });
    res.json(offer);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const keys = Object.keys(req.fields);
    // console.log(keys);
    const details = [
      {
        ETAT: req.fields.condition,
      },
      {
        EMPLACEMENT: req.fields.city,
      },
      {
        MARQUE: req.fields.brand,
      },
      {
        TAILLE: req.fields.size,
      },
      {
        COULEUR: req.fields.color,
      },
    ];
    //console.log(details);
    const newAd = new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: details,
      owner: req.user.id,
    });
    const pictureToUpload = req.files.picture.path;
    const photo = await cloudinary.uploader.upload(pictureToUpload, {
      folder: "/vinted/offers/" + newAd.id,
    });
    newAd.product_image = photo;
    await newAd.save();

    const ad = await Offer.findOne({ product_name: req.fields.title }).populate(
      "owner"
    );
    res.status(200).json({
      "-id": ad.id,
      product_name: ad.product_name,
      product_description: ad.product_description,
      product_price: ad.product_price,
      product_details: ad.product_details,
      owner: {
        account: ad.owner.account,
        _id: ad.owner.id,
      },

      product_image: ad.product_image,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.put("/offer/update/:id", isAuthenticated, async (req, res) => {
  try {
    const publish = await Offer.findById(req.params.id);
    if (publish) {
      if (req.fields.price) {
        publish.product_price = req.fields.price;
      }
      if (req.fields.title) {
        publish.product_name = req.fields.title;
      }
      if (req.fields.description) {
        publish.product_description = req.fields.description;
      }
      if (req.fields.condition) {
        publish.product_details[0].ETAT = req.fields.condition;
      }
      if (req.fields.city) {
        publish.product_details[1].EMPLACEMENT = req.fields.city;
      }
      if (req.fields.brand) {
        publish.product_details[2].MARQUE = req.fields.brand;
        console.log(publish.product_details[2].MARQUE);
      }
      if (req.fields.size) {
        publish.product_details[3].TAILLE = req.fields.size;
      }
      if (req.fields.color) {
        publish.product_details[4].COULEUR = req.fields.color;
      }
      if (req.files.picture) {
        //Delete actual image
        const publicIdOfImage = publish.product_image.public_id;
        await cloudinary.uploader.destroy(publicIdOfImage);
        //Upload new image and save
        const pictureToUpload = req.files.picture.path;
        const photo = await cloudinary.uploader.upload(pictureToUpload, {
          folder: "/vinted/offers/" + publish.id,
        });
        publish.product_image = photo;
      }
      res.status(200).json({
        message: "The offer was succesfully updated",
        updated_offer: publish,
      });
    } else {
      res.status(400).json({
        message: " Offer not found, id error",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.delete("/offer/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const publish = await Offer.findById(req.params.id);
    if (publish) {
      const id = publish.id;

      console.log(publish);
      //first delete image in the folder with destroy
      const publicIdOfImage = publish.product_image.public_id;
      //await cloudinary.uploader.destroy(publicIdOfImage);
      await cloudinary.api.delete_resources_by_prefix(publicIdOfImage);

      //secondly delete folder and delete offer from DB
      await cloudinary.api.delete_folder("/vinted/offers/" + id);
      await Offer.findByIdAndDelete(id);
      res.status(200).json({
        message: "The publish was succesfully deleted",
      });
    } else {
      res.status(400).json({
        message: "Publish not found, wrong id or publish was already deleted",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
