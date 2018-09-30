const nodemailer = require('nodemailer');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
// const db = mongodb.connect('mongodb:localhost:27017/testData');
const MongoClient = require('mongodb').MongoClient;
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'testData';
// Connect using MongoClient
MongoClient.connect(url, (err, client) => {
  // Select the database by name
  const testDb = client.db(dbName);
  client.close();
});
const PORT = process.env.PORT || 3000;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  'extended': true
}));
app.use(bodyParser.json());


nodemailer.createTestAccount((err, account) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'imhzbuntvn6lpb5u@ethereal.email',
      pass: 'YjHwU9XaXX1QJjzsJQ'
    }
  });

  app.post('/info', (req, res) => {
    db.then((db) => {
      delete req.body._id;
      db.collection('contact info').insertOne(req.body);
    }).catch(e => console.error('Error ', e));
    if(req.body.url === '') {
      console.log('using a API client');
    }
    if(!req.body.name) {
      res.json({
        success: false,
        msg: 'name is required'
      })
    }
    // console.log('req', req);
    let filename = 'data.txt';
    let path = './data.txt';
    // setup email data 
    let mailoptions = {
      from: '"test sv-Ilabs" <test@svilabs.com', //sender
      to: req.body.email, //list of receivers
      subject: 'Your requested information about ...',
      text: 'helloooo world',
      html: '<em>hellloooo world<em><br/> <img src="cid:data"/>',
      attachments: [{
        filename: filename,
        path: path,
        cid: 'data'
      }]
    };
    transporter.sendMail(mailoptions, (err, info) => {
      if (err) {
        return console.error('Error', err);
      }
      // console.log('Message sent: %s', info.messageID);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

    const info = {
      url: req.body.url,
      name: req.body.name,
      email: req.body.email
    }
    res.json({info});
  });
});

module.exports = app.listen(PORT, (err) => {
  if(err) throw err;
  console.log(`listening on port ${PORT}`);
})
