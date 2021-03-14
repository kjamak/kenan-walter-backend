import List from "../models/listModel.js";

const listAuth = async (req, res, next) => {
  try {
    const listId = req.body.listId;
    const user = req.user;

    if (!listId) return res.status(400).json({ msg: "Input Desired List ID" });

    const searchList = await List.findById(listId);
    if (!searchList)
      return res.status(400).json({ msg: "The list does not exist" });

    if (user != searchList.userId)
      return res
        .status(400)
        .json({ msg: "You are not allowed to edit this list" });

    req.list = listId;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default listAuth;
