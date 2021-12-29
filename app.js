//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const { redirect } = require("express/lib/response");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/ankitTodoDB");

const itemSchema = {
  todoName: String,
  isDone: Boolean,
};
const ItemModel = mongoose.model("todoItems", itemSchema);

const item1 = new ItemModel({ todoName: "Default Item", isDone: false });

// const defaultItems = [item1];

const ListSchema = {
  name: String,
  todoItems: [itemSchema],
};
const ListModel = mongoose.model("Lists", ListSchema);

app.get("/", function (req, res) {
  let customListName = "today";
  ListModel.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("list doesn't exist");
        const list = new ListModel({
          name: customListName,
          todoItems: [],
        });
        list.save();
        res.redirect("/");
      } else {
        console.log("List already exist");
        res.render("list", {
          listTitle: _.capitalize(customListName),
          allItems: foundList.todoItems,
        });
      }
    }
  });

  // ItemModel.find({}, function (err, dbItems) {
  //   res.render("list", {
  //     listTitle: _.capitalize("TODAY"),
  //     allItems: dbItems,
  //   });
  // });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;
  const listName = req.body.list.toLowerCase();

  const newItem = new ItemModel({ todoName: item, isDone: false });
  newItem.save();
  // if (listName == "today") {
  //   res.redirect("/");
  // } else {
  ListModel.findOne({ name: listName }, function (err, foundList) {
    if (!err) {
      foundList.todoItems.push(newItem);
      foundList.save();
    } else {
      console.log("error in adding item in" + listName);
    }
    res.redirect("/" + listName);
  });
  // }
});

app.post("/delete", function (req, res) {
  const removeItemId = req.body.itemId;
  const listName = req.body.list.toLowerCase();

  ListModel.findOne({ name: "done" }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new ListModel({
          name: "done",
          todoItems: [],
        });
        list.save();
      }
    }
  });

  if (listName === "done") {
    ListModel.findOneAndUpdate(
      { name: listName },
      { $pull: { todoItems: { _id: removeItemId } } },
      function (err, foundList) {
        if (!err) {
          ItemModel.findByIdAndRemove(removeItemId, function (err) {
            if (err) {
              console.log("error occurred in deleting item" + err);
            } else {
              console.log("Deleted item successfully");
              // res.redirect("/");
            }
          });

          res.redirect("/" + listName);
        } else {
          res.redirect("/" + listName);
        }
      }
    );
  } else {
    let item = new ItemModel({ name: "default item", isDone: true });

    ItemModel.findById(removeItemId, function (err, foundItem) {
      if (err) {
        console.log("error occurred in accessing item" + err);
      } else {
        item = foundItem;
      }
    });

    ListModel.findOneAndUpdate(
      { name: listName },
      { $pull: { todoItems: { _id: removeItemId } } },
      function (err, foundList) {
        if (!err) {
          item.isDone = true;
          if (!err) {
            ListModel.findOne({ name: "done" }, function (err, foundList) {
              if (!err) {
                foundList.todoItems.push(item);
                foundList.save();
              } else {
                console.log("error in adding item in done list");
              }
            });
          }

          res.redirect("/" + listName);
        } else {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

// app.post("/markDone", function (req, res) {
//   const itemId = req.body.itemId;
//   const listName = req.body.list;

//   ListModel.findOneAndUpdate(
//     { name: listName, todoItems: { $elemMatch: { _id: removeItemId } } },
//     { $set: { "todoItems.$.isDone": !(todoItems.$.isDone) } },
//     function (err, foundList) {
//       if (!err) {
//         res.redirect("/" + listName);
//       } else {
//         res.redirect("/" + listName);
//       }
//     }
//   );
//   res.redirect("/" + listName);
// });

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName.toLowerCase();
  if (customListName == "today") res.redirect("/");

  ListModel.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("list doesn't exist");
        const list = new ListModel({
          name: customListName,
          todoItems: [],
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        console.log("List already exist");
        if (customListName == "today") res.redirect("/");
        else {
          res.render("list", {
            listTitle: _.capitalize(customListName),
            allItems: foundList.todoItems,
          });
        }
      }
    }
  });
  // res.redirect("/");
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: _.capitalize("work"), allItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
