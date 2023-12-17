/*  Before anything, don't forget -
    npm init
    npm i express body-parser ejs
    add in json type module
    app.listen!
*/
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express(); //use express functionality
const port = 3000;
var name = "Maeven";
var idCount = 1;


var blogs = [];
var comments = [];

app.use(bodyParser.urlencoded({ extended: true })); // I forgot what this does
app.use(express.static("public")); //all static files located in folder "public"



/*      http handlers       */


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  }); 


//homepage
app.get("/", (req, res) => {
    res.render("index.ejs", {name});
});

//blog page
app.get("/blogs", (req, res) => {
    res.render("blogs.ejs", {blogs});
});

//contact page
app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

//post viewer page
app.get("/viewpost/:id", (req, res) => {    //note: passed id through href and stored it in variable id using syntax ":id"
    
    //find blog by id that was passed in url
    var blog = blogs.find(blog => blog.id === Number(req.params.id));
    
    fs.readFile("./" + blog.file_path, "UTF8", (err, data) =>{
        res.render("viewpost.ejs", {blog, data});
    });

});

//post creator/editor page
app.get("/makepost/:id", (req, res) => {
    if(Number(req.params.id) != 0){  //if there is a specified id, then we've opted to edit a post
    
    //find blog by id that was passed in url
    var blog = blogs.find(blog => blog.id === Number(req.params.id));
    
    //read data from file and pass to page
    fs.readFile("./" + blog.file_path, "UTF8", (err, data) =>{
        res.render("makepost.ejs", {blog, data});
    });
    } else {    //otherwise, we've opted to create a new post
        res.render("makepost.ejs");
    }
});

app.get("/blogs/:id", (req, res) => {

    var blogToDelete = blogs.find((blog) =>  blog.id === Number(req.params.id));

    //delete the file associated with the blog
    fs.unlink(blogToDelete.file_path, () => {});

    //delete the blog
    blogs = blogs.filter(function (blog) {
        return blog.id != Number(req.params.id);
    });
    
    res.redirect("/blogs");
});


app.post("/blogs", (req, res) =>{
    var blog = blogs.find((blog) =>  blog.id === Number(req.body.id));

    //if updated blog, id is in array, overwrite the file and title
    if(blog){
        blog.title = req.body.title;
        fs.writeFile("./" + blog.file_path, req.body.post_text, () => {});
    } else { //if new blog, id is not in array, make new blog
        blogs.push({
            title: req.body.title,
            id: idCount,
            created: new Date(),
            image: "images/defaults/defaultpic" + (Math.floor(Math.random() * 5) + 1) + ".jpg",
            file_path: "blogs/" + idCount + ".txt",
        });

        fs.writeFile("./blogs/" + idCount + ".txt", req.body.post_text, () => {});
        idCount++;
    }

    res.render("blogs.ejs", {blogs});
})

app.post("/contact", (req, res) => {
    comments.push({
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
    });
    var response = "Thank you for your feedback!";
    res.render("contact.ejs", {response});
});

