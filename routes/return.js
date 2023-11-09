const express = require("express");
const router = express.Router();
const Return = require("../models/return");

//getting all
router.get("/", async (req, res) => {
  try {
    const returnData = await Return.find();
    res.json(returnData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one
router.get("/:id", getReturn, (req, res) => {
  res.json(res.return);
});

//creating one
router.post("/", async (req, res) => {
  const returnData = new Return({
    invoiceNumber: req.body.invoiceNumber,
    invoiceDate: req.body.invoiceDate,
    invoiceAmount: req.body.invoiceAmount,
    invoiceStatus: req.body.invoiceStatus,
    invoiceTitle: req.body.invoiceTitle,
    invoiceTotalitems: req.body.invoiceTotalitems,
    // invoiceIGST: req.body.invoiceIGST,
    // invoiceCGST: req.body.invoiceCGST,
    // invoiceSGST: req.body.invoiceSGST,
    // invoiceUTGST: req.body.invoiceUTGST,
    invoiceSentTo: req.body.invoiceSentTo,
    invoiceSentBy: req.body.invoiceSentBy,
    invoicePaymentMode: req.body.invoicePaymentMode,
    invoicePDF: req.body.invoicePDF,
    invoiceReport: req.body.invoiceReport,
    oldInvoiceId: req.body.oldInvoiceId,
    invoiceDescription: req.body.invoiceDescription,
    invoiceTime: req.body.invoiceTime,
    discount: req.body.discount,
    roundoff: req.body.roundoff,
    city: req.body.city,
    state: req.body.state,
    businessAddress: req.body.businessAddress,
    businessContactNo: req.body.businessContactNo,
    reportReason: req.body.reportReason,
    extra1: req.body.extra1,
    extra2: req.body.extra2,
    extra3: req.body.extra3,
    extra4: req.body.extra4,
    extra5: req.body.extra5,
  });
  try {
    const savedReturn = await returnData.save();
    res.status(201).json(savedReturn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// updating one
router.patch("/:id", getReturn, async (req, res) => {
  if (req.body.invoiceNumber != null) {
    res.return.invoiceNumber = req.body.invoiceNumber;
  }
  if (req.body.invoiceDate != null) {
    res.return.invoiceDate = req.body.invoiceDate;
  }
  if (req.body.invoiceAmount != null) {
    res.return.invoiceAmount = req.body.invoiceAmount;
  }
  if (req.body.invoiceStatus != null) {
    res.return.invoiceStatus = req.body.invoiceStatus;
  }
  if (req.body.invoiceTitle != null) {
    res.return.invoiceTitle = req.body.invoiceTitle;
  }
  if (req.body.invoiceTotalitems != null) {
    res.return.invoiceTotalitems = req.body.invoiceTotalitems;
  }
  if (req.body.invoiceHST != null) {
    res.return.invoiceHST = req.body.invoiceHST;
  }
  // if(req.body.invoiceIGST != null){
  //     res.return.invoiceIGST = req.body.invoiceIGST;
  // }
  // if(req.body.invoiceCGST != null){
  //     res.return.invoiceCGST = req.body.invoiceCGST;
  // }
  // if(req.body.invoiceSGST != null){
  //     res.return.invoiceSGST = req.body.invoiceSGST;
  // }
  // if(req.body.invoiceUTGST != null){
  //     res.return.invoiceUTGST = req.body.invoiceUTGST;
  //}
  if (req.body.invoiceSentTo != null) {
    res.return.invoiceSentTo = req.body.invoiceSentTo;
  }
  if (req.body.invoiceSentBy != null) {
    res.return.invoiceSentBy = req.body.invoiceSentBy;
  }
  if (req.body.invoicePaymentMode != null) {
    res.return.invoicePaymentMode = req.body.invoicePaymentMode;
  }
  if (req.body.invoicePDF != null) {
    res.return.invoicePDF = req.body.invoicePDF;
  }
  if (req.body.invoiceReport != null) {
    res.return.invoiceReport = req.body.invoiceReport;
  }
  if (req.body.invoiceTime != null) {
    res.return.invoiceTime = req.body.invoiceTime;
  }
  if (req.body.discount != null) {
    res.return.discount = req.body.discount;
  }
  if (req.body.roundoff != null) {
    res.return.roundoff = req.body.roundoff;
  }
  if (req.body.reportReason != null) {
    res.return.reportReason = req.body.reportReason;
  }
  if (req.body.invoiceDescription != null) {
    res.return.invoiceDescription = req.body.invoiceDescription;
  }
  if (req.body.city != null) {
    res.return.city = req.body.city;
  }
  if (req.body.state != null) {
    res.return.state = req.body.state;
  }
  if (req.body.businessAddress != null) {
    res.return.businessAddress = req.body.businessAddress;
  }
  if (req.body.businessContactNo != null) {
    res.return.businessContactNo = req.body.businessContactNo;
  }
  if (req.body.extra1 != null) {
    res.return.extra1 = req.body.extra1;
  }
  if (req.body.extra2 != null) {
    res.return.extra2 = req.body.extra2;
  }
  if (req.body.extra3 != null) {
    res.return.extra3 = req.body.extra3;
  }
  if (req.body.extra4 != null) {
    res.return.extra4 = req.body.extra4;
  }
  if (req.body.extra5 != null) {
    res.return.extra5 = req.body.extra5;
  }
  try {
    const updateInvoice = await res.return.save();
    res.json(updateInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// deleting one
router.delete("/:id", getReturn, async (req, res) => {
  try {
    await res.return.remove();
    res.json({ message: "Deleted Return" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting by invoiceSentTo
router.get("/useremail/:invoiceSentTo", async (req, res) => {
  try {
    const returnData = await Return.find({
      invoiceSentTo: req.params.invoiceSentTo,
    });
    res.json(returnData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting by invoiceSentBy
router.get("/vendormail/:invoiceSentBy", async (req, res) => {
  try {
    const returnData = await Return.find({
      invoiceSentBy: req.params.invoiceSentBy,
    });
    res.json(returnData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getReturn(req, res, next) {
  let returnData;
  try {
    returnData = await Return.findById(req.params.id);
    if (returnData == null) {
      return res.status(404).json({ message: "Cannot find return" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.return = returnData;
  next();
}

module.exports = router;
