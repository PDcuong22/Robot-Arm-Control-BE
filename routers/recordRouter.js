const {createRecord, getRecords, deleteRecord, updateRecord} = require("../controllers/recordController");

const router = require("express").Router();

router.get("/", getRecords);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);
router.post("/create", createRecord);

module.exports = router;