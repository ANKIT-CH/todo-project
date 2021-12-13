const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
// const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = ["Book Reading - 30 Min.",];
let workItems = [];

app.get("/", function (req, res) {

  let formattedDay = date.getDate();
  console.log(formattedDay);

  res.render("list", { listTitle: formattedDay, allItems: items });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work", allItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about", 
  // { listTitle: "Work", allItems: workItems }
  );
});



app.post("/", function (req, res) {
  let item = req.body.newItem;
  console.log(req.body);
  if (req.body.button == "allItems") {
    items.push(item);
  }
  else {
    for(let i = req.body.button; i < items.length-1; i++){
      items[i] = items[i+1];
    }
    items.pop();
    // res.render("list", { day: newToDo });
  }
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});
