// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

//add other packages
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Set up MongoDB Database through mlab
const MONGO_URI = process.env.MONGO_ID;
mongoose.connect(MONGO_URI);

//set up MongoDB schema
const ScheduleSchema = new mongoose.Schema({
  Monday: [String],
  Tuesday: [String],
  Wednesday: [String],
  Thursday: [String],
  Friday: [String],
  Saturday: [String],
  Sunday: [String]
})

const schedappt = mongoose.model("schedappt", ScheduleSchema)

//initiate db if not already done
//schedappt.collection.insertOne({Monday: ['0'], Tuesday: ['0'], Wednesday: ['0'], Thursday: ['0'], Friday: ['0'], Saturday: ['0'], Sunday: ['0']});
//Node mailer function may want to set up seperate gmail account
function sendMail(email_from, email_to, email_subject, email_text, email_html){ 
  nodemailer.createTestAccount((err, account) => {

      let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 25,
          secure: false, // true for 465, false for other ports
          auth: {
              user: process.env.SECRET, 
              pass: process.env.SUPERSECRET 
          },
          tls: {
            rejectUnauthorized:false
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: email_from, // sender address
          to: email_to, // list of receivers
          subject: email_subject, // Subject line
          text: email_text, 
          html: email_html
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);

          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


      });
  });
}

//main hompage router
app.get('/', function(req, res) {
  var scheduleUpdated;
  schedappt.findById("5b704c6dc9f16327982200a3", function(err, schedule){
    console.log(schedule);
    scheduleUpdated = schedule;
  })
  res.render(__dirname + '/views/index.ejs');
});

//send in appt data from client, submit mail email with appt details
app.post('/appointment', function(req, res){
  console.log(req.body);
  
  //set up mail to, from, subject and body info
  let from = `"${process.env.NAME}" <${req.body.email}>`; // sender address
  let to = `${process.env.Receiver}`; // list of receivers
  let subject = `Appointment Request for ${req.body.date} at ${req.body.time} by ${req.body.name}`; // Subject line
  let text = `Hi Diann, ${req.body.name} has scheduled an appointment for ${req.body.date} at ${req.body.time}. If you would like to accept please reply to this message to confirm.`;
  //set path for post request
  let html = `<body>Hi Diann, ${req.body.name} has scheduled an appointment for ${req.body.date} at ${req.body.time}. If you would like to accept please click the button below.</body>
              <form name="confirm" action="https://polar-cello.glitch.me/confirm" method="post"> 
                <input type="hidden" name="name" value="${req.body.name}">
                <input type="hidden" name="email" value="${req.body.email}">
                <input type="hidden" name="date" value="${req.body.date}">
                <input type="hidden" name="time" value="${req.body.time}">
                <button id='confirm1'>Confirm Appointment</button>
              </form>
              `      
  
  //send mail
  sendMail(from, to, subject, text, html);
});

//send email to customer after confirm button is clicked
app.post('/confirm', function(req, res){
  let from = `"${process.env.NAME}" <${process.env.SECRET}>`; // sender address
  let to = `${req.body.email}`; // list of receivers
  let subject = `Your Appointment Has Been Confirmed at Diann's Nails`; // Subject line
  let text = `Hi ${req.body.name}, Your appointment has been confirmed on ${req.body.date} at ${req.body.time}. Thank you and see you soon!`;
  let html = `<body>Hi ${req.body.name}, Your appointment has been confirmed on ${req.body.date} at ${req.body.time}. Thank you and see you soon!</body>`    
  
  //send mail
  sendMail(from, to, subject, text, html);
  res.redirect('/');
});

//path to scheduler side
app.get('/scheduler', function(req, res) {
  res.render(__dirname + '/views/scheduler.ejs');
});

//updates available times for a given date
app.get('/updatedSchedule', function(req, res) {
  let scheduleSend;
  schedappt.findById("5b704c6dc9f16327982200a3", function(err, schedule){
    scheduleSend = schedule;
    res.send(scheduleSend);
  })

});

//updates the stored availble times when scheduler submits form
let schedInfo;
app.post('/scheduler', function(req, res){
  schedInfo = req.body;
  schedappt.update({ _id: "5b704c6dc9f16327982200a3"}, { $set:{Monday:schedInfo.Monday, Tuesday:schedInfo.Tuesday, Wednesday:schedInfo.Wednesday, 
  Thursday:schedInfo.Thursday, Friday:schedInfo.Friday, Saturday:schedInfo.Saturday, 
  Sunday:schedInfo.Sunday,}}, function(err, data){
    if (err){
    throw err;
    } else{
      console.log('DB Updated')
    }
  })
});



// listen for requests 
let listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

