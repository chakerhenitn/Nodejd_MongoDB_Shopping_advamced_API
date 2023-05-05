const mongoose = require('mongoose');
const Product = require ('../models/product')

exports.get_All_products = async (req, res, next) => {
    await Product.find()
    .select('name price _id productImage')
        .exec()
        .then((docs) => {
        const response={
            count: docs.length,
            product: docs.map(doc =>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request:{
                        type: 'GET',
                        url:'http://localhost:3000/products/'+ doc._id
                    }
                }
            })
        };
        //res.status(200).json(response);
          //In cse of returning an empty arry from the database
          //it is not an error but there is no entries in the database and nou null
        if (docs <= 0) {
            res
            .status(404)
            .json({ message: "There is no product in the database" });
        } else {
            res.status(200).json(response);
        }
        /*  if(docs>=0){ 
            res.status(200).json(docs);   
            } else{
                res.status(404).json({message: 'No entries found'});
            } */
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
        });
    }

exports.create_Products = async (req, res, next) => {
    const product = await new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
});
product
    .save()
    .then((result) => {
    console.log(result);
    res.status(201).json({
        message: "The product is created with success in /products",
        //pass the product object: result
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/'+result._id
            }
        }
    });
    })
    .catch((err) => {
    console.log(err);
    res.status(500).json({ error: err });
    });
}

exports.get_One_product = async (req, res, next) => {
    const id = req.params.prodID;
    await Product.findById(id)
    .select('name price _id productImage')
        .exec()
        .then((doc) => {
        console.log("Reteaved From Database", doc);
        if (doc) {
            res.status(200).json({
                product:doc,
                request:{
                    type: 'GET',
                    description: 'This is the link you can go to all products',
                    url: 'http://localhost:3000/products'
                }
            });
        } else {
            res.status(404).json({ message: "Not valid ID entry" });
        }
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
        });
    }

exports.update_Products = (req, res, next) => {
    const id = req.params.prodID;
    const updateOperations = {};
    for (const ops of req.body) {
        updateOperations[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOperations })
        .exec()
        .then(result => {
        res.status(200).json({
            message: 'Product is updated with success',
            request:{
                type:'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        
        });
        });
    }

exports.delete_Product = async (req, res, next) => {
    const id = req.params.prodID;
    await Product.findOneAndRemove({ _id: id })
    .select('name price _id')
        .exec()
        .then(result => {
        res.status(200).json({
            message: 'Product succesfully deleted',
            request: 'GET',
            url: 'http://localhost:3000/products/',
            body: {"name": "String", "price": "Number"},
            result
        });
        })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err 
        });
        });
    }