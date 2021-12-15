const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
// const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = {};
let workItems = {};

app.get("/", function (req, res) {
  let formattedDay = date.getDate();
  console.log(formattedDay);
  console.log(items);
  res.render("list", { listTitle: formattedDay, allItems: items });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work", allItems: workItems });
});


app.get("/about", function (req, res) {
  res.render(
    "about"
    // { listTitle: "Work", allItems: workItems }
  );
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  let key = req.body.newItemTime;
  console.log(req.body);
  if (req.body.button == "allItems") {
    // items.push(item);
    if(key == ''){
      let i = alert("Please enter time with task");
      res.write(i);
    }
    items[key] = item;
  } else {
    let key = req.body.button;
     console.log("button is: " + key);
    delete items[key];
  }
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});
