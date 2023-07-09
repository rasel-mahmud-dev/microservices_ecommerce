const router = require("express").Router()
const category = require("./category");
const attribute = require("./attribute");
const product = require("./product");
const variant = require("./variant");
const variantAttribute = require("./variantAttribute");
const attributeValue = require("./attributeValue");
const imageKitUpload = require("../services/ImageKitUpload");
const auth = require("../middleware/auth");

const formidable = require('formidable');


router.use("/api/category", category)
router.use("/api/attributes", attribute)
router.use("/api/attribute-value", attributeValue)
router.use("/api/variants", variant)
router.use("/api/variant-attribute", variantAttribute)
router.use("/api/products", product)


// this route should be in default services
router.post("/api/upload-image", auth, (req, res, next) => {

    try {
        const form = formidable({multiples: false});

        form.parse(req, (err, fields, files) => {
            if (err) return next("file upload fail")

            const baseDir = "microservices/"

            const {folder = "images"} = fields
            // Access the uploaded file information
            const file = files["image"];
            imageKitUpload(file.filepath, file.originalFilename, baseDir + folder).then((r) => {
                console.log(r)
                res.json({
                    url: r.url,
                    message: 'File uploaded successfully.'
                });
            }).catch(ex => {
                console.log(ex)
            })
        });
    } catch (ex) {
        next(ex)
    }
})


module.exports = router