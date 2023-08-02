//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose= require("mongoose")

const password = encodeURIComponent("Kamehame@@##$$!13");
mongoose.connect(`mongodb+srv://admin-rupen:${password}@cluster0.uxdlixw.mongodb.net/blogDB`, { useNewUrlParser: true })
  .then(s => {
    console.log("connected")
  })
  .catch(e => {
    console.log("oops " + e)
  });


const postSchema=mongoose.Schema({
  title: String,
  body: String
})

const postModel=mongoose.model("post",postSchema)

const homeStartingContent = "Home page";
const aboutContent = "About page";
const contactContent = "Contact page";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
  postModel.find({})
  .then(s =>{
    res.render("home",{para:homeStartingContent,dbItem:s})
  })
  .catch(e =>{
    console.log("oops")
  })
})

app.get("/about",(req,res)=>{
  res.render("about",{para:aboutContent})
})

app.get("/contact",(req,res)=>{
  res.render("contact",{para:contactContent})
})

app.get("/compose",(req,res)=>{
  res.render("compose")
})


app.get("/post/:paramName",(req,res)=>{
  const reqParam=_.capitalize(req.params.paramName)
  
  postModel.findOne({title:reqParam})
  .then(s=>{
    res.render("post",{postData:s})
  })
  .catch(e =>{
    console.log(e)
  })

})

app.post("/compose",(req,res)=>{
  let postTitle=_.capitalize(req.body.postTitle)
  let postBody=req.body.postPara
  postModel.findOne({title:postTitle})
  .then(s =>{
    if(!s){
      const data= new postModel({
        title:postTitle,
        body:postBody
      })
      data.save()
      res.redirect("/")
    }
    else{
      res.redirect("/")
    }
  })
  .catch(e =>{
    console.log(e)
  })
})

const port = process.env.PORT || 5000 

app.listen(port, function() {
  console.log("Server started on port "+port);
});

