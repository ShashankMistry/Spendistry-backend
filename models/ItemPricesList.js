const mongoose = require('mongoose');

const ItemPricesSchema = new mongoose.Schema({
    _id : {
        type: String
    },
    ItemsPrices: {
        type: [{
            _id: {
                type: String
            },
            barcode : {
                type: String
            },
            itemName : {
                type: String
            },
            price : {
                type: String
            }
        }]
    }
});

module.exports = mongoose.model('ItemPricesSchema', ItemPricesSchema);