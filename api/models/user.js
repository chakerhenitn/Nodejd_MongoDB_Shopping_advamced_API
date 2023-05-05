const mongoose = require('mongoose');
const usertSchema = new mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
email:{type: String,
required: true,
unique: true,
match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
},
password:{type: String,
required: true,
}


});
module.exports = mongoose.model('user', usertSchema);