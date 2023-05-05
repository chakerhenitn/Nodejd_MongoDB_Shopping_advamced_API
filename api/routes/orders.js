const express = require('express');
const router = express.Router();

//import controllers
const orders_Controller = require('../controllers/orders')
// import middleware
const checkAuth = require('../middleware/check-auth')
//

router.get('/', checkAuth, orders_Controller.get_All_Orders);

router.post('/', checkAuth, orders_Controller.create_new_Orders );

router.get('/:ordID', checkAuth, orders_Controller.get_One_order);

router.delete('/:ordID',checkAuth, orders_Controller.delete_Order );



module.exports = router;