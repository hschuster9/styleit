const express = require('express')
const hbs = require('express-handlebars')
const parser = require('body-parser')
const mongoose = require('./db/connection')

const app = express()
const router = express.Router()

//pulling model from schema
const Item = mongoose.model("Item")

//hosted port
app.set("port", process.env.PORT || 3002)
app.set('view engine', 'hbs')
app.engine(".hbs", hbs({
 extname: ".hbs",
 partialsDir: "views/",
 layoutsDir: "views/",
 defaultLayout: "layout-main"
}))

//public folder renamed as assets
app.use("/assets", express.static("public"))
app.use(parser.json({extended: true}))

//root url
app.get('/', function(req, res){
 res.render("items")
})

//show all items
app.get("/api/items", function(req, res){
 Item.find({}).then(function(items){
   res.json(items)

 })
})

//show individual item
app.get('/api/items/:title', function(req, res){
 Item.findOne({title: req.params.title}).then(function(item){
   res.json(item)

 })
})

//increase upvote
app.put('/api/items/:title/upvote', function(req, res, next){
 Item.findById(req.params.title, function (err, item) {
   // Handle any possible database errors
   if (err) {
       res.status(500).send(err);
   } else {
       item.upvote();
       res.json(item)
   }
});
})

//create new item
app.post('/api/items', function(req, res){
 Item.create(req.body).then(function(item){
   res.json(item)
 })
})

//update item
app.put("/api/items/:title", function(req, res){
 Item.findOneAndUpdate({title: req.params.title}, req.body, {new: true}).then(function(item){
   res.json(item)
 })
})

//delete item
app.delete('/api/items/:title', function(req, res){
 Item.findOneAndRemove({title: req.params.title}).then(function(){
   res.json({success: true})
 })
})


app.listen(app.get("port"), function(){
 console.log("Listening on Port 3002");
});
