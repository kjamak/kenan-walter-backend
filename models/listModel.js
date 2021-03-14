import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  productList: {
    type: [
      {
        name: String,
        quantity: Number,
      },
    ],
    required: false,
  },
});
var List = mongoose.model("list", listSchema);

export default List;
