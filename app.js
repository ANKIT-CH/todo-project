const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = ["Book Reading - 30 Min.",];
let workItems = [];

app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    // year: "numeric",
  };

  let formattedDay = today.toLocaleDateString("en-US", options);
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
  if (req.body.button == "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    // res.render("list", { day: newToDo });
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server started on port 3000");
});
