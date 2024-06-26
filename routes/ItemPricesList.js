const express = require('express');
const router = express.Router();
const ItemPricesSchema = require('../models/ItemPricesList');
const mongoose = require('mongoose');
const vendorVerify = require('../middleware/verifyVendorToken');

// getting all
router.get('/', vendorVerify, async (req, res) => {
    try {
    const item = await ItemPricesSchema.find();
    res.json(item);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// getting one
router.get('/:id', getItems, (req, res) => {
    res.json(res.item);
})

router.get('/price/:id/:ItemsPrices', async (req, res) => {
    try {
    const itemsPrices = await ItemPricesSchema.aggregate([{$match: {"_id": req.params.id}}, {$unwind: "$ItemsPrices"}, {$match: {"ItemsPrices.price": req.params.ItemsPrices}}]);
    res.json(itemsPrices);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// old patch

// router.patch('/filter/:id/:ItemsPrices', getItems, async (req, res) => { 
//     try {
//         const itemsPrices = await ItemPricesSchema.findOneAndUpdate({"_id": req.params.id, "ItemsPrices": {$elemMatch: { "price": req.params.ItemsPrices }}}, {$set: {"ItemsPrices.$.price": req.body.price}}, {new: true});
//         res.json(itemsPrices);
//     } catch (error) {
//         res.status(500).json({message: error.message});
        
//     }
//   })

  // finding invoice by id

  router.get('/findEle/:id/:idArr', async (req, res) => {
    try {
        const itemsPrices = await ItemPricesSchema.aggregate([{$match: {"_id": req.params.id}}, {$project: {
        "ItemsPrices": {
            $filter: {
                input: "$ItemsPrices",
                as: "item",
                // $unwind: "$item",
                cond: {
                    $eq: [
                        "$$item._id",
                       req.params.idArr
                    ]
                }

        }

        }

    }
    }]);
    res.json(itemsPrices);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

//patching with invoice id

router.patch('/patchEle/:id/:idArr', getItems, async (req, res) => {
    try {
        const itemsPrices = await ItemPricesSchema.findOneAndUpdate({"_id": req.params.id, 
        "ItemsPrices": {
            $elemMatch: { "_id":  req.params.idArr }}}, 
            {$set: {"ItemsPrices.$.price": req.body.price, "ItemsPrices.$.itemName": req.body.itemName }  },
            {new: true});
        res.json(itemsPrices);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
})

// creating one
router.post('/', async (req, res) => {
    const item = new ItemPricesSchema({
        _id : req.body._id,
        ItemsPrices: req.body.ItemsPrices
    });
    try{
        const savedItems = await item.save();
                res.status(201).json(savedItems);
    }
    catch (err) {
        res.status(400).json({message: err.message});
    }
})


// adding elemet to array
router.patch('/addItems/:id', async (req, res) => {
    try {
        const item = await ItemPricesSchema.findOneAndUpdate({_id: req.params.id},
            {$push: {ItemsPrices: req.body.ItemsPrices}}
            );
        res.json(item);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// updating one
router.patch('/updateItems/:id', getItems, async (req, res) => {
    if(req.body.ItemsPrices != null){
        res.item.ItemsPrices = req.body.ItemsPrices;
    }
    try{
        const updatedItems = await res.item.save();
        res.json(updatedItems);
        
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// deleting one
router.delete('/delete/:id', getItems, async (req, res) => {
    try{
        await res.item.remove();
        res.json({message: 'Deleted This UserItemList'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})


// deleting specific array element
router.delete('/deleteItems/:id/:idArr', async (req, res) => {
    try {
      const item = await ItemPricesSchema.updateOne(
        {_id: req.params.id},
        {$pull: {ItemsPrices: {_id: req.params.idArr}}}
        
      )
        res.json(item);

        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
})

// deleting specific array element
router.delete('/deleteEmptyIds/:id', async (req, res) => {
    try {
      const item = await ItemPricesSchema.updateOne(
        {_id: req.params.id},
        {$pull: {ItemsPrices: {_id: ""}}}
        
      )
        res.json(item);
        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
})

async function getItems(req, res, next) {
    let item;
    try {
        item = await ItemPricesSchema.findById(req.params.id);
        if (item == null) {
            return res.status(404).json({message: 'Cannot find Items'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    res.item = item;
    next();
}


module.exports = router;
