// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// find sum of x and y
// example: http://localhost:8080/api/sum/2/3
router.route("/sum/:x/:y")

	.get(function(req, res) {

		try {
			var x = parseFloat(req.params.x);
			var y = parseFloat(req.params.y);
			
			if (x == null || isNaN(x) ||
				(x+"").length < req.params.x.length) {
				res.json({ error: "Failed to parse " + req.params.x });
			}
			else if (y == null || isNaN(y) ||
					(y+"").length < req.params.y.length) {
				res.json({ error: "Failed to parse " + req.params.y });
			}
			else {
				var sum = x + y;
				res.json({ sum : sum });
			}			
		}
		catch (error) {
			res.json({ error : error.message })
		}
	});

// subtract subtrahend from minuend
// example: http://localhost:8080/api/difference/9/4
router.route("/difference/:minuend/:subtrahend")

	.get(function(req, res) {
		
		try {
			var minuend = parseFloat(req.params.minuend);
			var subtrahend = parseFloat(req.params.subtrahend);
			
			if (minuend == null || isNaN(minuend) ||
			   (minuend+"").length < req.params.minuend.length) {
				res.json({ error: "Failed to parse " + req.params.minuend });
			}
			else if (subtrahend == null || isNaN(subtrahend) ||
				    (subtrahend+"").length < req.params.minuend.subtrahend) {
				res.json({ error: "Failed to parse " + req.params.minuend });
			}
			else {
				var difference = minuend - subtrahend;
				res.json({ difference : difference });
			}			
		}
		catch (error) {
			res.json({ error : error.message })
		}
	});

// find product of multiplying x and y
// example: http://localhost:8080/api/product/2/3
router.route("/product/:x/:y")

	.get(function(req, res) {
		
		try {
			var x = parseFloat(req.params.x);
			var y = parseFloat(req.params.y);
			
			if (x == null || isNaN(x) ||
		       (x+"").length < req.params.x.length) {
				res.json({ error: "Failed to parse " + req.params.x });
			}
			else if (y == null || isNaN(y) ||
					(y+"").length < req.params.y.length) {
				res.json({ error: "Failed to parse " + req.params.y });
			}
			else {
				var product = x * y;
				res.json({ product : product });
			}			
		}
		catch (error) {
			res.json({ error : error.message })
		}
	});

// find quotient by dividing dividend by divisor
// example: http://localhost:8080/api/quotient/12/3
router.route("/quotient/:dividend/:divisor")

	.get(function(req, res) {
		
		try {
			var dividend = parseFloat(req.params.dividend);
			var divisor = parseFloat(req.params.divisor);
			
			if (dividend == null || isNaN(dividend) ||
			   (dividend+"").length < req.params.dividend.length) {
				res.json({ error: "Failed to parse " + req.params.dividend });
			}
			else if (divisor == null || isNaN(divisor) ||
				    (divisor+"").length < req.params.divisor.length) {
				res.json({ error: "Failed to parse " + req.params.divisor });
			}
			else if (divisor == 0) {
				res.json({ quotient: "undefined" });
			}
			else {
				var quotient = dividend / divisor;
				res.json({ quotient : quotient });
			}			
		}
		catch (error) {
			res.json({ error : error.message })
		}
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);
