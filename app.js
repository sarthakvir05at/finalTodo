const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require('mongoose');
const _= require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoFinal", { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema= new mongoose.Schema({
  name: {
    required: true,
    type: String
  }
});

const listSchema= new mongoose.Schema({
  name: String,
  lists: [itemsSchema]
});

const List= mongoose.model("List", listSchema);
const Random= mongoose.model("Random", itemsSchema);
const Item= mongoose.model("Item", itemsSchema);
const Work= mongoose.model("Work", itemsSchema);

const item1= new Item({
  name: "Buy Food"
});
const item2= new Item({
  name: "Cook Food"
});
const item3= 
new Item({
name: "Eat Food"
});

const defaultArray= [];

app.get("/", function(req, res) {
  
    Item.find({}, (err, doc) => {

      if(doc.length === 0)
      {
        Item.insertMany(defaultArray, (err) => {  
        if(err) 
        console.log(err);
      else
    console.log("Success");  }) }
  else
   res.render("list", {listTitle: "Today", newListItems: doc}); })
  })  


app.post("/", function(req, res){

  const newDo = req.body.newItem;
  const listName= req.body.list;
  
  // if(listName === "Work"){
  //   const workAdd= new Work({ name: newDo });
  //   workAdd.save();
  //   res.redirect("/work");
  // }
  // else if(listName === "Today"){
  //   const itemAdd= new Item({ name:newDo });
  //   itemAdd.save();
  //   res.redirect("/");
  // }
  // else{
  //   const ranAdd= new Random({ name: newDo });
  //   ranAdd.save();
  //   res.redirect("/" + listName);
  // }


  const itemAdd= new Item({ name: newDo });
  if(listName === "Today"){
    itemAdd.save();
    res.redirect("/");
  }
  else{
    List.findOne({ name: listName }, (err, doc) => {
      doc.lists.push(itemAdd);
      doc.save();
      res.redirect("/" + listName);
    })
  }
  });

app.post("/delete", (req,res) => {
  const del= req.body.checkBox;
  const listCon= req.body.listCon;

  if(listCon === "Today"){
    Item.findByIdAndDelete(del, (err) => {
      if(!err)
      console.log("Deleted");
      res.redirect("/");
    });
  }
  else{
    List.findOneAndUpdate({ name: listCon }, { $pull: { lists: { _id: del }}}, (err, doc) => {
      if(!err)
      res.redirect("/" + listCon);
    })
  }
  
})

app.get("/work", function(req,res){
  Work.find({}, (err, workItems) => {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
  })
});

app.get("/:use", (req,res) => {
  const par= req.params.use;
  
  List.findOne({ name: par }, (err,doc) => {
    if(!err){
      if(!doc){
        const newList= new List({
          name: par,
          lists: defaultArray
        });
        newList.save();
        res.redirect("/" + par);
      }
      else{
        res.render("list", { listTitle: par, newListItems: doc.lists });
      }
    }
  })

});

app.post("/:use", (req,res) => {
  const listTaken= req.body.newItem;

})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
