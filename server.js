var express = require("express"); //using express for creating API/ web service
var fileuploader = require("express-fileupload");
var mysql = require("mysql");
var path = require("path");
var nodemailer=require("nodemailer")

var app = express();



app.listen(1999, function () {
    console.log("server started....");
});

//Make MySQL Database Connection
var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",  //password:""
    database: "satnam",
    dateStrings: true
}


//Check MySQL Database Connection
var dbRef = mysql.createConnection(dbConfig);
dbRef.connect(function (err) {
    if (err == null)
        console.log("Connected Successfully.,..");
    else
        console.log(err);
});

app.use(express.static("public")); //express.static("public") :- is a middleware
app.use(fileuploader());
app.get("/", function (req, resp) {
    var dir = process.cwd(); //process is a global object, cwd: current working dir

    console.log(dir);
    var dir2 = __dirname;//gloabal variable
    var file = __filename;
    console.log(dir2 + "      " + file);

    //var path= process.cwd()+"/public/index.html";

    var pathFile = path.join(__dirname, "public", "index.html");
    resp.sendFile(path);

})

app.get("/ajax-chk-user", function (req, resp) {
    var emailll = req.query.emaill;
    dbRef.query("select * from user where email=?", [emailll], function (err, jsonAryResult) {
        if (err != null) {
            resp.send(err.toString());
        }
        else if (jsonAryResult.length == 1) {
            resp.send("ID already taken , Please Choose Different ID");
        }
        else {
            resp.send("Available");
        }
    })
})


// .........................signup...................
app.get("/db-Signup", function (req, resp) {
    var emailll = req.query.emaill;
    var Usernameee = req.query.usernamee;
    var pswddd = req.query.pswdd;

    dbRef.query("insert into user values(?,?,?)", [emailll, Usernameee,pswddd], function (err) {
        if (err == null) {
            console.log("record saved");
            resp.send("Signup successfully");

        }
        else {
            console.log(err.toString());
            
            resp.send(err.toString());
        }
    })
});

// ....................signin button......................
app.get("/ajax-chk-login", function (req, resp) {
    var lEmail = req.query.loginEmail;
    var lPass = req.query.loginPass;

    dbRef.query("select * from user where email=? and password=?", [lEmail, lPass], function (err, jsonAryResult) {

        if (err) {
            resp.send("error");
        }
            else{
                // console.log("hello")
                resp.send(jsonAryResult);
        }
    });

})


// .....................RESERVATION...............................

app.get("/db-reservation", function (req, resp) {

    var name = req.query.namee;
    var email = req.query.emaill;
    var phoneee = req.query.phonee;
    var dateee = req.query.datee;
    var timeee = req.query.timee;  
    var personnn = req.query.personn;
    dbRef.query("insert into reservation values(?,?,?,?,?,?)", [name, email, phoneee, dateee,timeee,personnn], function (err) {
        if (err == null) {
            console.log("Record Saved");
            // console.log(resp.send)
            resp.send("Reserved Table successfully");
            // resp.redirect("signup-result.html");
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'brotherscafe39@gmail.com',
                    pass: 'ltyajisguzsvrhre'
                }
            });

            var mailOptions = {
                from: 'brotherscafe39@gmail.com',
                to: email,
                // cc: '',
                subject: 'Thanks For booking table ' + name,
                text: 'Your table is reserved!!'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    alert("heelo")
                    console.log(error);
                }
                else {
                    console.log('Email sent:' + info.response);
                    resp.redirect("/")
                }
            });
        }
        else {

            console.log(err.toString());
            resp.send(err.toString());
        }
    })
})




// .................contact section.................

app.get("/db-contact", function (req, resp) {

    var name = req.query.namee;
    var email = req.query.emaill;
    var phoneee = req.query.phonee;
    var messageee = req.query.messagee;
    dbRef.query("insert into contact values(?,?,?,?)", [name, email, phoneee, messageee], function (err) {
        if (err == null) {
            console.log("Record Saved");
            // console.log(resp.send)
            resp.send("contact us successfully");
            // resp.redirect("signup-result.html");
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'brotherscafe39@gmail.com',
                    pass: 'ltyajisguzsvrhre'
                }
            });

            var mailOptions = {
                from: 'brotherscafe39@gmail.com',
                to: email,
                // cc: '',
                subject: 'Thanks For Contacting Us ' + name,
                text:name+'\n Message:-'   +messageee
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    alert("Message send  Done")
                    console.log(error);
                }
                else {
                    console.log('Email sent:' + info.response);
                    resp.redirect("/")
                }
            });
        }
        else {
            console.log(err.toString());
            resp.send(err.toString());
        }
    })
})


//....................Show all users ...........................
app.get("/show-all-users", function (req, resp) {
    dbRef.query("select * from user", function (err, table) {
        console.log(err);
        if (err)
            resp.send(err.tostring());
        else
            resp.json(table);
    })
});

//..............show all reservation..................
app.get("/show-all-reservation", function (req, resp) {
    dbRef.query("select * from reservation", function (err, table) {
        console.log(err);
        if (err)
            resp.send(err.tostring());
        else
            resp.json(table);
    })
});

//..................show all contact...................
app.get("/show-all-contact", function (req, resp) {
    dbRef.query("select * from contact", function (err, table) {
        console.log(err);
        if (err)
            resp.send(err.tostring());
        else
            resp.json(table);
    })
});