const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connecting to the database
mongoose.connect("mongodb+srv://admin-Tirth:tirth1012@cluster0.adsgo.mongodb.net/dairymanDB?retryWrites=true&w=majority", {
  useNewUrlParser: true
});

//creating loginSchema
const loginSchema = {
  email: String,
  password: String
};

//creating Login model
const Login = mongoose.model("Login", loginSchema);

//creating Signup schema
const signupSchema = {
  fname: String,
  lname: String,
  email: String,
  password: String,
  address: String,
  city: String,
  state: String,
  zip: Number
};

//creating signup model
const Signup = mongoose.model("Signup", signupSchema);

//creating order Schema
const orderSchema = {
  name: String,
  cost: Number
}

//creating Order model
const Order = mongoose.model("Order", orderSchema);

// getting all the pages respectively
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/home.html");
});

app.get("/login", function(req, res) {
    res.render("login", {
      logged: "",
      message: ""
    });
});

app.get("/signup", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/setorder", function(req, res) {
  res.sendFile(__dirname + "/set-order.html");
});



//posting the login form
app.post("/LOGIN", function(req, res) {
  const email = req.body.Email;
  const pass = req.body.Password;

  Signup.findOne({
    email: email
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === pass) {
          //adding the entry to the database
          const login = new Login({
            email: email,
            password: pass
          });
          login.save();
          
          //rendering the login page
          res.render("login", {
            logged: "Login Successfull!",
            message: "Now you can start ordering"
          });


        } else {
          res.render("login",{
            logged: "Login Failed!",
            message: "Incorrect password."
          });
        }
      } else {
          res.render("login",{
            logged: "Login Failed!",
            message: "User does not exist."
          });
      }
    }
  });

});

//posting the signup form
app.post("/SIGNUP", function(req, res) {
  const fname = req.body.Fname;
  const lname = req.body.Lname;
  const email = req.body.email;
  const pass = req.body.password;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const zip = req.body.zip;

  const signup = new Signup({
    lname: fname,
    fname: lname,
    email: email,
    password: pass,
    address: address,
    city: city,
    state: state,
    zip: zip
  });

  signup.save();
  res.redirect("/");
})

//posting the order lists
app.post("/MILK", function(req, res) {
  const order = new Order({
    name: "SKIMMED MILK (1L)",
    cost: 40
  });
  order.save();
  res.redirect("/setorder");
});

app.post("/BUTTER", function(req, res) {
  const order = new Order({
    name: "BUTTER (250g)",
    cost: 100
  });
  order.save();
  res.redirect("/setorder");
});

app.post("/YOGURT", function(req, res) {
  const order = new Order({
    name: "GREEK YOGURT (1KG)",
    cost: 60
  });
  order.save();
  res.redirect("/setorder");

});

app.post("/CHEESE", function(req, res) {
  const order = new Order({
    name: "CHEESE (500g)",
    cost: 200
  });
  order.save();
  res.redirect("/setorder");

});

app.post("/BREAD", function(req, res) {
  const order = new Order({
    name: "BREAD (1 pack)",
    cost: 40
  });
  order.save();
  res.redirect("/setorder");

});

app.post("/COOKIES", function(req, res) {
  const order = new Order({
    name: "CHOCOLATE COOKIES (2 PACKETS)",
    cost: 50
  });
  order.save();
  res.redirect("/setorder");

});

//rendering the cart page
app.get("/cart", function(req, res) {
  Order.find({}, function(err, foundItems) {
    if (foundItems.length == 0) { //if there are no items in the table then it will redirect to setorder page
      res.redirect("/setorder");
    } else {
      res.render("cart", {
        newItem: foundItems,
        success: ""
      });
    }
  });
});

//post method for remove operation
app.post("/REMOVE", function(req, res) {
  const itemId = req.body.remove;
  Order.findByIdAndRemove(itemId, function(err) {
    if (!err) {
      Order.find({}, function(err, foundItems) {
        if (foundItems.length == 0) {
          res.redirect("/setorder");
        } else {
          res.render("cart", {
            newItem: foundItems,
            success: ""
          });
        }
      });
    }
  });
});

app.post("/BUY", function(req, res) {
  const successfully = "Your order has been placed successfully!!"
  Order.find({}, function(err, foundItems) {
    if (foundItems.length == 0) {
      res.redirect("/setorder");
    } else {
      res.render("cart", {
        newItem: foundItems,
        success: successfully
      });
    }
  });
});
// Starting the server on port 3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started on port Successfully");
});
