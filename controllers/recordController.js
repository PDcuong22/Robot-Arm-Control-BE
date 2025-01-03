const Record = require("../models/recordModel");

const userController = {
  createRecord: async (req, res) => {
    try {
      const { name, actions } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Name is required" });
      }

      const newRecord = new Record({ "name": name.trim(), "actions": actions });
      await newRecord.save();

      res
        .status(201)
        .json({ message: "Recording saved successfully", newRecord: newRecord });
    } catch (error) {
      console.error("Error saving recording:", error);
      res.status(500).json({ error: "Failed to save recording" });
    }
  },

  getRecords: async (req, res) => {
    try {
      const records = await Record.find();
      return res.status(200).json(records);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getRecordById:  async (req, res) => {
    try {
      const record = await Record.findById(req.params.id);
      res.json(record);
    } catch (error) {
      console.error('Error fetching recording:', error);
      res.status(500).json({ error: 'Failed to fetch recording' });
    }
  },

  deleteRecord: async (req, res) => {
    try {
      const record = await Record.findByIdAndDelete(req.params.id);
      return res.status(200).json(record);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  updateRecord: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    console.log("id: ", id);
    console.log("name: ", name);
    
    if (!name || typeof name !== 'string') {
        return res.status(400).send({
          success: false,
          error: 'name must be a non-empty string.',
        });
      }
      
    try {
      // Fetch the data by ID
      const data = await Record.findById(id);
  
      if (!data) {
        console.log("Data not found");
        return res.status(404).json({ message: "Data not found" });
      }
  
      // Update the name field if provided
      if (name) {
        data.name = name;
      }
  
      // Save the updated document
      await data.save();
  
      res.status(200).json({ message: "Data updated successfully", data });
    } catch (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ message: "An error occurred", error });
    }
  }
};

module.exports = userController;
