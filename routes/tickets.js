const express = require("express");
const { auth } = require("../midllewares/auth");
const { TicketModel, validteTicket } = require("../models/ticketModel");
const router = express.Router();

router.get("/", async (req, res) => {
  // אם לא מוצא את קווארי פר פייג' ערך שווה 10
  let perPage = Number(req.query.perPage) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await TicketModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
router.get("/category/:urlCode", async (req, res) => {
  // אם לא מוצא את קווארי פר פייג' ערך שווה 10
  let perPage = Number(req.query.perPage) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let urlCode = req.params.urlCode
    let data = await TicketModel
      .find({ url_cat: urlCode })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
// /search?s=
router.get("/search", async (req, res) => {
  try {
    let queryS = req.query.s;
    let regQuery = new RegExp(queryS, "i");
    let data = await TicketModel
      .find({ $or: [{ name: regQuery }, { info: regQuery }] })
      .limit(20)
      .skip(0)
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.post("/", auth, async (req, res) => {
  let validBody = validteTicket(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let ticket = new TicketModel(req.body);
    // add prop of user_id
    ticket.user_id = req.tokenData._id
    await ticket.save();
    // 201 -> add new document
    res.status(201).json(ticket)
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})
router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validteTicket(req.body);
  // אם יש טעות יזהה מאפיין אירור בולידבאדי
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await TicketModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body)
    // modfiedCount : 1 - אם הצליח לערוך נקבל בצד לקוח בחזרה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.delete("/:idDel", auth, async (req, res) => {
  let idDel = req.params.idDel;
  try {
    let data = await TicketModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
    // deleteCount : 1 - אם הצליח למחוק נקבל בצד לקוח בחזרה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


module.exports = router;