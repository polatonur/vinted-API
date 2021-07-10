const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "db5y0hcsh",
  api_key: "565745715632969",
  api_secret: "2NSDOKYFssmmvI0St_7DKqlOvuM",
});

cloudinary.uploader.destroy(
  "vinted/offers/60e6cd100ca1e305bd7de049/tlmyliys9juaqbwa7j2m",
  function (error, docs) {
    if (error) {
      console.log(error);
    }
    console.log(docs);
  }
);
