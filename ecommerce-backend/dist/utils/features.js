import mongoose from "mongoose";
// file to connect with db
export const connectDB = async () => {
    mongoose
        .connect("mongodb+srv://freakyhell6:X9gQuQxMZVPX2X4L@cluster0.0dbd9ma.mongodb.net/", {
        dbName: "Sneaker-Store",
    })
        .then((c) => console.log(`DB connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
