const express = require("express");
const router = express.Router();
const Invoice = require("../models/invoice");
const Report = require("../models/report");
const Return = require("../models/return");
const mongoose = require("mongoose");
const cryptoJS = require("crypto-js");
const User = require("../models/user");

//getting all
router.get("/", async (req, res) => {
  try {
    const invoice = await Invoice.find();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one
router.get("/:id", getInvoice, (req, res) => {
  res.json(res.invoice);
});

//change this get method for roundoff value
router.get("/totalExpense/:id", async (req, res) => {
  try {
    const total = await Invoice.aggregate([
      { $match: { _id: req.params.id } },
      { $unwind: "$businessName" },
      { $unwind: "$businessName.invoices" },
      {
        $group: {
          _id: "$businessName._id",

          date: { $last: "$businessName.invoices.invoiceTime" },
          total: {
            $sum: {
              $cond: {
                if: {
                  $gte: [
                    "$businessName.invoices.invoiceTime",
                    new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                  ],
                },
                then: "$businessName.invoices.invoiceNumber",
                else: 0,
              },
            },
          },
          totalAll: {
            $sum: "$businessName.invoices.invoiceNumber",
          },
        },
      },
    ]);
    res.json(total);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//getting vendor by vendor id
router.get("/vendor/:id", async (req, res) => {
  try {
    const invoice = await Invoice.aggregate([
      { $unwind: "$businessName" },
      { $unwind: "$businessName.invoices" },
      { $match: { "businessName._id": req.params.id } },
      {
        $group: {
          _id: req.params.id,
          invoices: {
            $push: "$businessName.invoices",
          },
        },
      },
    ]);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//show total of all invoiceNumbers and then show total for individual businessNAme ids
router.get("/total/:id/", async (req, res) => {
  //hash the id with cryptoJS
  var encryptedQr = cryptoJS.AES.encrypt(
    req.params.id,
    process.env.QR_HASH_KEY
  ).toString();

  try {
    const total = await Invoice.aggregate([
      { $match: { _id: req.params.id } },
      { $unwind: "$businessName" },
      { $unwind: "$businessName.invoices" },
      {
        $group: {
          _id: req.params.id,
          MonthlyTotalAll: {
            $sum: {
              $cond: {
                if: {
                  $gte: [
                    "$businessName.invoices.invoiceTime",
                    Date.now - 1000 * 60 * 60 * 24 * 30,
                  ],
                },
                then: "$businessName.invoices.roundoff",
                else: 0,
              },
            },
          },
          AllTimeTotal: {
            $sum: "$businessName.invoices.roundoff",
          },
          business: {
            $push: {
              _id: "$businessName._id",
              roundoff: "$businessName.invoices.roundoff",
              MonthlyTotal: {
                $sum: {
                  $cond: {
                    if: {
                      $gte: [
                        "$businessName.invoices.invoiceTime",
                        Date.now - 1000 * 60 * 60 * 24 * 30,
                      ],
                    },
                    then: "$businessName.invoices.roundoff",
                    else: 0,
                  },
                },
              },
              AllTotal: { $sum: "$businessName.invoices.roundoff" },
            },
          },
        },
      },
      { $unwind: "$business" },
      {
        $group: {
          _id: "$business._id",
          MonthlyTotalAll: { $last: "$MonthlyTotalAll" },
          AllTimeTotal: { $last: "$AllTimeTotal" },

          businessTotal: {
            $sum: "$business.MonthlyTotal",
          },
          businessAllTimeTotal: { $sum: "$business.AllTotal" },
          roundoff: { $push: "$business.roundoff" },
        },
      },

      {
        $project: {
          _id: "$_id",
          MonthlyTotalAll: "$MonthlyTotalAll",
          AllTimeTotal: "$AllTimeTotal",
          AllTotal: "$businessAllTimeTotal",
          MonthlyTotal: "$businessTotal",
          qr: encryptedQr,
          roundoff: "$roundoff",
        },
      },
    ]);

    if (total.length === 0) {
      res.json([
        {
          _id: "No data found",
          MonthlyTotalAll: 0,
          AllTotal: 0,
          MonthlyTotal: 0,
          AllTimeTotal: 0,
          qr: cryptoJS.AES.encrypt(
            req.params.id,
            process.env.QR_HASH_KEY
          ).toString(),
          roundoff: [0, 0],
        },
      ]);
    } else {
      res.json(total);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

//decrypt the id with cryptoJS
router.post("/decrypt", async (req, res) => {
  try {
    var decrypt = cryptoJS.AES.decrypt(
      req.body.qr,
      process.env.QR_HASH_KEY
    ).toString(cryptoJS.enc.Utf8);
    const user = await Invoice.findById(decrypt);
    if (user) {
      res.json(decrypt);
    } else {
      res.send("404");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//share qr page
router.get("/share/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const encqr = cryptoJS.AES.encrypt(
        req.params.id,
        process.env.QR_HASH_KEY
      ).toString();
      res.send(encqr);
    } else {
      res.send("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//creating one
router.post("/", async (req, res) => {
  const invoice = new Invoice({
    _id: req.body._id,
    businessName: req.body.businessName,
  });
  try {
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// updating one
router.patch("/:id", getInvoice, async (req, res) => {
  if (req.body.businessName != null) {
    res.invoice.invoices = req.body.businessName;
  }
  try {
    const updateInvoice = await res.invoice.save();
    res.json(updateInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//deleting one
router.delete("/:id", getInvoice, async (req, res) => {
  try {
    await res.invoice.remove();
    res.json({ message: "Deleted this invoice" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// old getting user by invoiceSentTo

// router.get('/filter/:invoiceSentTo/:invoiceSentBy', async (req, res) => {
//     // res.send(`getting user by invoiceSentTo ${req.params.invoiceSentTo}`);
//     try {
//     const invoice = await Invoice.find({invoiceSentTo: req.params.invoiceSentTo , invoiceSentBy: req.params.invoiceSentBy});
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

//getting vendor by user ID (version 2)

// router.get('/filter/:id/:invoices', async (req, res) => {
//     // res.send(`getting user by invoiceSentTo ${req.params.invoiceSentTo}`);
//     try {
//     const invoice = await Invoice.aggregate([
//         {$match : {"_id": req.params.id}}, {$unwind: "$invoices"}, {$match: {"invoices.invoiceSentBy": req.params.invoices}}
//     ])
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

//getting vendor by user ID
router.get("/findELe/:userid/:vendorid", async (req, res) => {
  try {
    const invoice = await Invoice.aggregate([
      { $match: { _id: req.params.userid } },
      {
        $project: {
          businessName: {
            $filter: {
              input: "$businessName",
              as: "businessName",
              cond: { $eq: ["$$businessName._id", req.params.vendorid] },
            },
          },
        },
      },
    ]);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//getting all invoices generated by vendor Id
// router.get('/findEle/:vendorId', async (req, res) => {
//     try {
//         const invoice = await Invoice.aggregate([
//             {$match:{'businessName._id': req.params.vendorId}},
//             {$project: {
//                 "bussinessName": {
//                     $filter: {
//                         input: "$businessName",
//                         as: "businessName",
//                         cond: {$eq: ["$$businessName._id", req.params.vendorId]}
//             }

//                     }
//                 }
//             },
//             {$unwind: "$bussinessName"},
//             {$group: {
//                 _id: req.params.vendorId,
//                 invoices: {
//                     $push: {
//                         'invoices':'$bussinessName.invoices'
//                     }

//                 }
//             }
//             },
//             {$project: {
//                 _id: 0,
//                 invoices: '$invoices.invoices'
//             }}

//         ])
//         res.json(invoice);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// })

//get all invoices by vendor id without array
router.get("/findEle/:vendorId", async (req, res) => {
  try {
    const invoice = await Invoice.aggregate([
      { $match: { "businessName._id": req.params.vendorId } },
      {
        $project: {
          businessName: {
            $filter: {
              input: "$businessName",
              as: "businessName",
              cond: { $eq: ["$$businessName._id", req.params.vendorId] },
            },
          },
        },
      },
    ]);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//getting invoice of specific vendor by user ID
router.get("/findEle/:userid/:vendorid/:invoiceid", async (req, res) => {
  try {
    const invoice = await Invoice.aggregate([
      { $match: { _id: req.params.userid } },
      { $unwind: "$businessName" },
      { $match: { "businessName._id": req.params.vendorid } },
      { $unwind: "$businessName.invoices" },
      {
        $match: {
          "businessName.invoices._id": mongoose.Types.ObjectId(
            req.params.invoiceid
          ),
        },
      },
      {
        $group: {
          _id: req.params.vendorid,
          invoices: {
            $push: {
              invoices: "$businessName.invoices",
            },
          },
        },
      },
    ]);
    res.json(invoice[0].invoices[0].invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//adding inside businessName
router.post("/addEle/:userid", async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.userid },
      { $push: { businessName: req.body.businessName } }
    );
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//adding inside specific businessName
//only send invoices array in body
router.post("/addEle/:userid/:vendorid", async (req, res) => {
  const countEle = await Invoice.aggregate([
    {
      $match: {
        _id: req.params.userid,
        "businessName._id": req.params.vendorid,
      },
    },
    { $unwind: "$businessName" },
    { $group: { _id: req.params.userid, sum: { $sum: 1 } } },
  ]);
  if (countEle.length > 0) {
    try {
      const invoice = await Invoice.findOneAndUpdate(
        { _id: req.params.userid, "businessName._id": req.params.vendorid },
        { $push: { "businessName.$.invoices": req.body.invoices } }
      );
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: error.message + " error" });
    }
  } else {
    try {
      const invoice = await Invoice.findOneAndUpdate(
        { _id: req.params.userid },
        {
          $push: {
            businessName: {
              _id: req.params.vendorid,
              invoices: req.body.invoices,
            },
          },
        }
      );
      res.json(invoice + " created");
    } catch (error) {
      res.status(500).json({ message: error.message + " error1" });
    }
  }
});

// patching inside invoice of specific vendor by user ID
router.patch(
  "/patchEle/:userid/:vendorid/:invoiceid/:reportId",
  async (req, res) => {
    try {
      //add invoice to return.js
      const invoiceOld = await Invoice.aggregate([
        { $match: { _id: req.params.userid } },
        { $unwind: "$businessName" },
        { $match: { "businessName._id": req.params.vendorid } },
        { $unwind: "$businessName.invoices" },
        {
          $match: {
            "businessName.invoices._id": mongoose.Types.ObjectId(
              req.params.invoiceid
            ),
          },
        },
        {
          $group: {
            _id: req.params.vendorid,
            invoices: {
              $push: {
                invoices: "$businessName.invoices",
              },
            },
          },
        },
      ]);
      const oldInvoice = await invoiceOld[0].invoices[0].invoices;
      const returnData = new Return({
        invoiceNumber: oldInvoice.invoiceNumber,
        invoiceDate: oldInvoice.invoiceDate,
        invoiceAmount: oldInvoice.invoiceAmount,
        invoiceStatus: oldInvoice.invoiceStatus,
        invoiceTitle: oldInvoice.invoiceTitle,
        invoiceTotalitems: oldInvoice.invoiceTotalitems,
        invoiceHST: oldInvoice.invoiceHST,
        invoiceSentTo: oldInvoice.invoiceSentTo,
        invoiceSentBy: oldInvoice.invoiceSentBy,
        invoicePaymentMode: oldInvoice.invoicePaymentMode,
        oldInvoiceId: oldInvoice._id,
        invoiceDescription: oldInvoice.invoiceDescription,
        invoiceTime: oldInvoice.invoiceTime,
        discount: oldInvoice.discount,
        roundoff: oldInvoice.roundoff,
        city: oldInvoice.city,
        state: oldInvoice.state,
        businessAddress: oldInvoice.businessAddress,
        businessContactNo: oldInvoice.businessContactNo,
        reportReason: oldInvoice.reportReason,
      });
      await returnData.save();
      //find one and delete
      await Report.findOneAndDelete({ _id: req.params.reportId });

      const invoice = await Invoice.findOneAndUpdate(
        {
          _id: req.params.userid,
          "businessName._id": req.params.vendorid,
          "businessName.invoices._id": mongoose.Types.ObjectId(
            req.params.invoiceid
          ),
        },
        {
          $set: {
            "businessName.$[d].invoices.$[o].invoiceAmount":
              req.body.invoices.invoiceAmount,
            "businessName.$[d].invoices.$[o].invoiceTime": Date.now(),
            "businessName.$[d].invoices.$[o].roundoff":
              req.body.invoices.roundoff,
            "businessName.$[d].invoices.$[o].discount":
              req.body.invoices.discount,
            "businessName.$[d].invoices.$[o].invoiceTotalitems":
              req.body.invoices.invoiceTotalitems,
            "businessName.$[d].invoices.$[o].invoicePaymentMode":
              req.body.invoices.invoicePaymentMode,
            "businessName.$[d].invoices.$[o].invoiceHST": req.body.invoices.invoiceHST
          },
        },
        {
          arrayFilters: [
            {
              "d._id": req.params.vendorid,
            },
            {
              "o._id": mongoose.Types.ObjectId(req.params.invoiceid),
            },
          ],
        }
      );
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//delete specific invoice with id
router.delete("/deleteEle/:userid/:vendorid/:invoiceid", async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.userid, "businessName._id": req.params.vendorid },
      {
        $pull: {
          "businessName.$.invoices": {
            _id: mongoose.Types.ObjectId(req.params.invoiceid),
          },
        },
      },
      { new: true }
    );
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// old getting by invoiceSentBy

// router.get('/vendoremail/:invoiceSentBy', async (req, res) => {
//     // res.send(`getting user by invoiceSentBy ${req.params.invoiceSentBy}`);
//     try {
//     const invoice = await Invoice.find({invoiceSentBy: req.params.invoiceSentBy});
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

//getting vendor by invoiceSentBy v2

// router.get('/vendoremail/:invoices', async (req, res) => {
//     try {
//     const invoice = await Invoice.aggregate([
//         {$unwind: "$invoices"}, {$match: {"invoices.invoiceSentBy": req.params.invoices}}
//     ])
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

// old getting user by invoiceSentTo

// router.get('/useremail/:invoiceSentTo', async (req, res) => {
//     // res.send(`getting user by invoiceSentTo ${req.params.invoiceSentTo}`);
//     try {
//     const invoice = await Invoice.find({invoiceSentTo: req.params.invoiceSentTo});
//     res.json(invoice);
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// })

async function getInvoice(req, res, next) {
  let invoice;
  try {
    invoice = await Invoice.findById(req.params.id);
    if (invoice == null) {
      return res.status(404).json({ message: "Cannot find invoice" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.invoice = invoice;
  next();
}

module.exports = router;
