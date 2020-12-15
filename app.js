//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sneh:Pun@1234@cluster0.gd0e5.mongodb.net/todoDB",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

const itemsSchema = {
name:String
};

const default_schema = {
  name :String,
  list :[]
};


const item = mongoose.model("item",itemsSchema);

const Default_Model = mongoose.model("Default_Model",default_schema);

const item1 = new item({
  name:"sneh"
});
const item2 = new item({
  name:"kumar"
});

const item_list = [item1,item2];






app.get("/", function(req, res) {

   item.find({},function(err,itemlist){

     if(itemlist.length===0)
     {
       item.insertMany(item_list,function(err){
         if(err)
         console.log(err);
         else
         console.log("Successfuly Inserted");
       });
       res.redirect("/");
     }
     else
     {
       res.render("list", {listTitle: "Today", newListItems: itemlist});
     }

   });



});

app.get("/:default_param",function(req,res){

const params = req.params.default_param;

Default_Model.findOne({name:params},function(err,return_value){

  if(!err)
  {
    if(!return_value)
    {
      const dm = new Default_Model({

      name:params,
      list:item_list

      });
        dm.save();
        res.redirect("/"+params);
    }
    else
    {
      res.render("list",{listTitle:return_value.name,newListItems:return_value.list});
    }

  }

});







});

app.post("/", function(req, res){

  const value= req.body.newItem;
  const buttom_value = req.body.list;


   const new_item=new item({
     name:value
   });

   if(buttom_value==="Today")
   {
     new_item.save();
     res.redirect("/");
   }
   else
   {
     Default_Model.findOne({name:buttom_value},function(err,ret_value){

         ret_value.list.push(new_item);
         ret_value.save();
         res.redirect("/"+buttom_value);

     });
   }


});

app.post("/delete",function(req,res){

const id_v = req.body.checkbox;
const hidden_input_value=req.body.hidden_input;


if(hidden_input_value==="Today")
{
 item.findByIdAndRemove(id_v,function(err){
   if(!err)
   res.redirect("/");

 });

}
else
{
   // Default_Model.findOneAndUpdate({name:hidden_input_value},{$pull: {list:{_id: id_v}}},function(err,return_value){
   //   if(!err)
   //   {
   //
   //   res.redirect("/"+hidden_input_value);
   // }
   //
   // });
   item.findByIdAndRemove(id_v,function(err){
     if(!err)
     res.redirect("/"+hidden_input_value);
     });

}

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
