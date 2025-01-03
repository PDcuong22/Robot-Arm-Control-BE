const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb://localhost:27017/RobotArm",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("MongoDB running ...");
    } catch (error) {
        console.log(error);
        console.log("Connect failure");
    }
};
module.exports = { connectDB };