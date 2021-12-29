//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/ankitTodoDB");

const itemschema = {
  todoName: String,
  isDone: Boolean,
};

const ItemModel = mongoose.model("todoItems", itemschema);

const item1 = new ItemModel({ todoName: "Book Reading", isDone: false });
const item2 = new ItemModel({ todoName: "Coding", isDone: false });
const item3 = new ItemModel({ todoName: "Lectures", isDone: false });

const defaultItems = [item1, item2, item3];
// ItemModel.insertMany(defaultItems, function(err){
//   if(err)
//   console.log("error occurred while inserting todo items" + err);
//   else
//   console.log("todo items inserted successfully" );

// });

const workItems = [];

app.get("/", function (req, res) {
  const day = date.getDate();

  ItemModel.find({}, function (err, dbItems) {
    if (dbItems.length === 0) {
      ItemModel.insertMany(defaultItems, function (err) {
        if (err) console.log("error occurred while inserting todo items" + err);
        else console.log("todo items inserted successfully");
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, allItems: dbItems });
    }
  });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;

  const newItem = new ItemModel({ todoName: item });
  newItem.save();

  // if (req.body.list == "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }

  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const removeItemId = req.body.itemId;

  ItemModel.findByIdAndRemove(removeItemId, function (err) {
    if (err) {
      console.log("error occurred in deleting item" + err);
    } else {
      console.log("Deleted item successfully");
      // res.redirect("/");
    }
  });
  res.redirect("/");
});

// app.post("/markDone", function (req, res) {
//   console.log(req.body);
//   const itemId = req.body.itemId;
//   let val = false;
//   ItemModel.findById(itemId, function (err, item) {
//     if (err)
//       console.log("Error occurred while checking and unchecking an item" + err);
//     else {
//       val = item.isDone;
//       if (val === true) {
//         ItemModel.findByIdAndUpdate(itemId, { isDone: false }, function (err) {
//           if (err) {
//             console.log("error occurred in Updating item" + err);
//           } else {
//             console.log("Updated item successfully");
//             // res.redirect("/");
//           }
//         });
//       } else {
//         ItemModel.findByIdAndUpdate(itemId, { isDone: true }, function (err) {
//           if (err) {
//             console.log("error occurred in Updating item" + err);
//           } else {
//             console.log("Updated item successfully");
//             // res.redirect("/");
//           }
//         });
//       }
//     }
//   });

//   res.redirect("/");
// });

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", allItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
