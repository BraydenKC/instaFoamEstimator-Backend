// These import necessary modules and set some initial variables
//require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const convert = require("xml-js");
//const rateLimit = require("express-rate-limit");
var cors = require("cors");
const { response } = require("express");
const app = express();
//const port = 3000;

// Rate limiting - Goodreads limits to 1/sec, so we should too

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);


// Allow CORS from any origin
app.use(cors());

// Parse URL-encoded bodies (as sent by the API clients)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by the API clients)
app.use(express.json());



//-------------- Routes --------------

// Test route, visit localhost:3000 to confirm it's working
// should show 'Hello World!' in the browser

app.get("/", (req, res) => res.send("Hello World!"));

const submitEmail = {
  origin: true,
  methods: ["POST"],
  allowedHeaders: 'Content-Type'
}

app.options('/test', cors(submitEmail))

app.post("/test", function (req, res) {
  console.log(req.body.wantsConnect);
  console.log(req.body.email);

  return res.json({
    success: true,
  });
})

app.post("/request-quote", async (req, res) => {

  try {

    //const email = req.body.email;
    //const name = req.body.name;
    const wantsEstimate = req.body.wantsEstimate;

    console.log(wantsEstimate);

    //Setting up the auto email to the client
    const toClientBodyContent = {
      sender: {
          name: 'InstaFoam',
          email: 'brayden@yycscrewpiles.com',
      },
      to: [{ email: req.body.email, name: req.body.name }],
      replyTo: { email: 'brayden@yycscrewpiles.com' },
      templateId: 1,
      params: req.body.params
    }

    //Setting up the auto email to Tyler
    const toIFBodyContent = {
      sender: {
          name: 'InstaFoam - ' + req.body.name,
          email: 'brayden@yycscrewpiles.com',
      },
      to: [{ email: 'bclark@strikeent.com', name: "Tyler" }],
      replyTo: { email: req.body.email },
      templateId: 3,
      params: req.body.params
    }

    console.log(bodyContent);


    //If the user wants to send us an email, send a copy of the email to us and them.
    if(wantsEstimate) {

      //Send the info to client over to SendinBlue
      fetch('https://api.sendinblue.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': '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'
        },
        body: JSON.stringify(toClientBodyContent),
        json: true

    }).then( () => {

      //Send the info to IF Team over to SendinBlue
      fetch('https://api.sendinblue.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': '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'
        },
        body: JSON.stringify(toIFBodyContent),
        json: true
    })
    
    
    .then(() => {
      res.json(["This", "Worked"])
    } )
}   
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

});

// This spins up our sever and generates logs for us to use.
// Any console.log statements you use in node for debugging will show up in your
// terminal, not in the browser console!
//app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.listen(process.env.PORT);