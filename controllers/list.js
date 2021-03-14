import List from "../models/listModel.js";

export const createList = async (req, res) => {
  try {
    const userId = req.user;
    let { name, date, productList } = req.body;

    if (!name || !date)
      return res.status(400).json({ msg: "Name or date is missing" });

    if (productList === undefined) {
      productList = [];
    }

    const existingList = await List.findOne({ name });
    if (existingList)
      return res.status(400).json({ msg: "Name for the list already taken" });

    const newList = new List({
      name,
      date,
      productList,
      userId,
    });

    const savedList = await newList.save();
    res.json(savedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLists = async (req, res) => {
  try {
    const userId = req.user;

    const allLists = await List.find({ userId });

    return res.json(allLists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const modificateLists = async (req, res) => {
  try {
    let { name, productList } = req.body;

    let list = await List.findById(req.list);

    if (name !== undefined) {
      if (list.name === name) {
        return res
          .status(400)
          .json({ msg: "You entered current name of your list" });
      }

      const freeNameCheck = await List.findOne({ name: name });
      if (freeNameCheck) {
        return res.status(400).json({ msg: "Name is not available" });
      }
      await List.findByIdAndUpdate(
        req.list,
        {
          name: name,
          userId: list.userId,
          date: list.date,
          productList: list.productList,
        },
        { new: true }
      );
    }

    list = await List.findById(req.list);

    if (productList !== undefined) {
      await List.findByIdAndUpdate(
        req.list,
        {
          name: list.name,
          userId: list.userId,
          date: list.date,
          productList: productList,
        },
        { new: true }
      );
    }

    list = await List.findById(req.list);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLists = async (req, res) => {
  try {
    await List.findByIdAndRemove(req.list);

    res.json({ message: "List deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReport = async (req, res) => {
  try {
    const userId = req.user;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    var d1 = startDate.split("-");
    var d2 = endDate.split("-");

    var from = new Date(d1[0], parseInt(d1[1]) - 1, d1[2]);
    var to = new Date(d2[0], parseInt(d2[1]) - 1, d2[2]);

    const allLists = await List.find({ userId });

    if (allLists.length === 0)
      return res.json({ msg: "You do not have any lists currently" });

    let allProducts = [];
    allLists.map((list) => {
      if (list.date > from && list.date < to)
        allProducts = allProducts.concat(list.productList);
    });

    const arr = allProducts.sort(compare);
    let sumForEach = [];

    for (let i = 0; i < arr.length; i++) {
      if (i == 0 || arr[i].name !== sumForEach[sumForEach.length - 1].name) {
        sumForEach.push({ name: arr[i].name, quantity: arr[i].quantity });
      } else {
        const q = sumForEach[sumForEach.length - 1].quantity + arr[i].quantity;
        sumForEach[sumForEach.length - 1] = { name: arr[i].name, quantity: q };
      }
    }

    if (sumForEach.length === 0)
      return res.json({ msg: "You do not have any products on your list/s" });

    res.json(sumForEach);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function compare(a, b) {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  let comparison = 0;
  if (nameA > nameB) {
    comparison = 1;
  } else if (nameA < nameB) {
    comparison = -1;
  }
  return comparison;
}
