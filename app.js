const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require('lodash');

app.set("view engine", "ejs");

app.use(bodyParser({extended:true}));
app.use(express.static(__dirname + '/public'));

mongoose.connect('MONGODB DATABASE CONNECTING URL');

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({ 
  name: 'Welcome to your to do list!'
 });

const item2 = new Item({ 
  name: 'Hit the + button to add a new item.'
 });

const item3 = new Item({ 
  name: '<-- hit this button to delete an item.'
 });
 
const defaultItems = [item1,item2,item3];

const listSchema = {
  name:String,
  items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);



app.get("/", function (req, res) {



  Item.find({}, function (err, foundItems) {
    if(foundItems.length === 0 ){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("defaults saved successfully!");
        }
      });
      res.redirect('/');
    }else{
      let day="Today";
      res.render("list", { listTitle: day,item:foundItems});
    }
  })

  
});

app.post("/",function(req,res){
  let itemName = req.body.newItem;
  let listName = req.body.list;

  const item = new Item({ 
    name: itemName
   });
   
if (listName==="Today"){
  item.save();
  res.redirect('/')
}else{
  List.findOne({name:listName},function(err,result){
    result.items.push(item);
    result.save();
    res.redirect('/'+listName)
  });
}


});

app.post('/delete',function(req,res){
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;


  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItem,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("deleted successfully!");
        res.redirect('/');
      }
    });
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}},function(err,result){
      if(!err){
        res.redirect('/'+listName);
      }
    });
  }


});





app.get("/:newUrl",function(req,res){
 const newUrl = _.capitalize(req.params.newUrl);
List.findOne({name:newUrl},function(err,result){
if(!err){
  if(!result){
    const list = new List({
      name:newUrl,
      items:defaultItems
    });
    list.save();
    res.redirect('/'+newUrl);
  }else{
res.render('list',{listTitle:(result.name), item:result.items})
  }
}
})
});

let port = process.env.PORT;

app.listen(port || 3000, function () {
  console.log("Server Running on port 3000");
});

