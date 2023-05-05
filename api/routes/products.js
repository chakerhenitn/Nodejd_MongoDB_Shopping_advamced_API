const express = require("express");
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

//import controllers
const productController = require('../controllers/products')

// the file storage strategy
const storage = multer.diskStorage({
    
destination: function(req, file, cb){
    cb(null, './uploads/');
},
filename: function(req, file, cb){
    cb(null, Date.now()+ file.originalname);
}
});

// one filter
const fileFilter = (req, file, cb)=>{
    console.log(file);
//reject a files
if(file.mimetype === 'image/jpeg' || file.mimetype ==='image/jpg'){
    cb(null, true);
} else{
    cb(null, false);
}
};
//
const upload = multer({
    storage: storage, 
    limits:{
    fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter
}
);
const Product = require("../models/product");

const router = express.Router();


const { json } = require("body-parser");

router.get("/", productController.get_All_products);

router.post("/",checkAuth, upload.single('productImage'), productController.create_Products);

router.get("/:prodID",checkAuth, productController.get_One_product);

router.patch("/:prodID", checkAuth, productController.update_Products);

router.delete("/:prodID", checkAuth, productController.delete_Product);

module.exports = router;
//Delete all records from the database
/* router.delete("/", async (req, res, next) => {
    await Product.deleteMany()
        .exec()
        .then((result) => {
        res.status(200).json({ message: 'Delete of all records with success', result });
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
        error: err,
        });
        });
});  */