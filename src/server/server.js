const express = require("express");
var request = require("request");
import bodyParser from "body-parser";
var paypal = require("paypal-rest-sdk");

const app = express();

app.use(express.static("dist"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Add this header for cross origin access
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// please provide your client id here
var CLIENT =
  "AYzsIaPpuGoCt87W8Fgi4PupJjOyMotq47xxQ-RginxtpBbXGhGK6cIxS1lMm7AC5k6_YHOFWaDnIevu";

// provide your client secret here
var SECRET =
  "EItoh9xzcnppXdc9Bu0-kxB3LmcnEH-6K70mA8Ak_V9Y31ZB2aXZGIYJYnCe_UqfvuUquiCYqF2k7qoq";

// provide the paypal sandbox url
var PAYPAL_API = "https://api.sandbox.paypal.com";

// Set up the payment:
// 1. Set up a URL to handle requests from the PayPal button
app
  .post("/api/create", function(req, res) {
    // 2. Call /v1/payments/payment to set up the payment

    var inputRequest = JSON.parse(req.body.data);
    request.post(
      PAYPAL_API + "/v1/payments/payment",
      {
        auth: {
          user: CLIENT,
          pass: SECRET
        },
        body: {
          intent: "sale",
          payer: {
            payment_method: "paypal"
          },
          transactions: [inputRequest],
          redirect_urls: {
            return_url: "http://127.0.0.1:3000/index.html", //3. Return url after completion of transaction
            cancel_url: "http://127.0.0.1:3000/index.html"
          }
        },
        json: true
      },
      function(err, response) {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
        // 4. Return the payment ID to the client
        res.json({
          id: response.body.id
        });
      }
    );
  })
  // Execute the payment:
  // 1. Set up a URL to handle requests from the PayPal button.
  .post("/api/execute-payment/", function(req, res) {
    // 2. Get the payment ID and the payer ID from the request body.
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
    var total = req.body.amount;
    // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
    request.post(
      PAYPAL_API + "/v1/payments/payment/" + paymentID + "/execute",
      {
        auth: {
          user: CLIENT,
          pass: SECRET
        },
        body: {
          payer_id: payerID,
          transactions: [
            {
              amount: {
                total: total,
                currency: "USD"
              }
            }
          ]
        },
        json: true
      },
      function(err, response) {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
        // 4. Return a success response with payment id to the client
        res.json({
          id: response.body.id
        });
      }
    );
  })
  .listen(process.env.PORT || 9000, function() {
    console.log(`Example app listening on ${process.env.PORT || 9000}!`);
  });
