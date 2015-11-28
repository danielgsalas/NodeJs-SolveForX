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
    res.json({ "message": "Listening on port " + port });   
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
				res.json({ "error": "Failed to parse " + req.params.x });
			}
			else if (y == null || isNaN(y) ||
					(y+"").length < req.params.y.length) {
				res.json({ "error": "Failed to parse " + req.params.y });
			}
			else {
				res.json({ 
					"x" : x, 
					"y" : y, 
					"sum" : x + y
				});
			}			
		}
		catch (error) {
			res.json({ "error" : error.message })
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
				res.json({ "error": "Failed to parse " + req.params.minuend });
			}
			else if (subtrahend == null || isNaN(subtrahend) ||
				    (subtrahend+"").length < req.params.minuend.subtrahend) {
				res.json({ "error": "Failed to parse " + req.params.minuend });
			}
			else {
				res.json({ 
					"minuend" : minuend,
					"subtrahend" : subtrahend,
					"difference" : minuend - subtrahend
				});
			}			
		}
		catch (error) {
			res.json({ "error" : error.message })
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
				res.json({ "error": "Failed to parse " + req.params.x });
			}
			else if (y == null || isNaN(y) ||
					(y+"").length < req.params.y.length) {
				res.json({ "error": "Failed to parse " + req.params.y });
			}
			else {
				res.json({ 
					"x" : x,
					"y" : y, 
					"product" : x * y 
				});
			}			
		}
		catch (error) {
			res.json({ "error" : error.message })
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
				res.json({ "error": "Failed to parse " + req.params.dividend });
			}
			else if (divisor == null || isNaN(divisor) ||
				    (divisor+"").length < req.params.divisor.length) {
				res.json({ "error": "Failed to parse " + req.params.divisor });
			}
			else if (divisor == 0) {
				res.json({ "quotient": "undefined" });
			}
			else {
				res.json({ 
					"dividend" : dividend,
					"divisor" : divisor,
					"quotient" : dividend / divisor 
				});
			}			
		}
		catch (error) {
			res.json({ "error" : error.message })
		}
	});

// Solve For X
//
// examples: 
//   http://localhost:8080/api/x/x=15-5
//   http://localhost:8080/api/x/5x=10
//   http://localhost:8080/api/x/2x=10+6
//   http://localhost:8080/api/x/3x=6*8
//   http://localhost:8080/api/x/4x=64%2F2
//
router.route("/x/:equation")

	.get(function(req, res) {
		
		// get the input equation and replace URL encoding
		var equation = req.params.equation;
		equation = equation.replace("%2F", "/");
		
		var equationSides = equation.split("=");

		// validate the equation
		if (typeof equationSides == "undefined" ||
			equationSides == null ||
			equationSides.length != 2) {			
			res.status(401).send("Invalid equation: " + equation);
		}
		
		var coefficient = 1;
		
		if ("x" === equationSides[0]) {
			// coefficient is already 1 and left-hand side is valid
		}
		else if (equationSides[0].indexOf("0") == 0) {
			// divide by zero!
			res.json({ x: "undefined" });
		}
		else {
			coefficient = parseInt(equationSides[0]);

			// make sure the only character after the coefficient is a lower-case x
			if ("x" != equationSides[0].substring((coefficient+"").length)) {			
				res.status(401).send("Expected x in monomial: " + equationSides[0]);
			}
		}
		
		if (equationSides[1].indexOf("+") > 0) {
			
			var monomials = equationSides[1].split("+");
			var x = parseInt(monomials[0]);
			var y = parseInt(monomials[1]);
			
			// find sum and quotient
			
			var http = require('http');
			
			var options = {
			    host: 'localhost',
			    port: 8080,
			    method: 'GET',
				path: '/api/sum/' + x + '/' + y
			};
			
			http.get(options, function(responseSum) {
				
				var responseBody = "";
				
				responseSum.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				responseSum.on("end", function() {

				    var parsed = JSON.parse(responseBody);
				    var sum = parsed.sum;

				    options = {
						host: 'localhost',
						port: 8080,
						method: 'GET',
					    path: '/api/quotient/' + sum + '/' + coefficient
					};
						
					http.get(options, function(responseQuotient) {
							
						responseBody = "";
							
						responseQuotient.on("data", function(chunk) {
							responseBody += chunk;
						});

						responseQuotient.on("end", function() {
							parsed = JSON.parse(responseBody);				    
							res.json({ "x" : parsed.quotient });
						});
					});
				});
			});
		}
		else if (equationSides[1].indexOf("-") > 0) {
			
			var monomials = equationSides[1].split("-");
			var minuend = parseInt(monomials[0]);
			var subtrahend = parseInt(monomials[1]);
			
			// find difference and quotient
			
			var http = require('http');
			
			var options = {
			    host: 'localhost',
			    port: 8080,
			    method: 'GET',
				path: '/api/difference/' + minuend + '/' + subtrahend
			};
			
			http.get(options, function(responseDiff) {
				
				var responseBody = "";
				
				responseDiff.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				responseDiff.on("end", function() {

				    var parsed = JSON.parse(responseBody);
				    var difference = parsed.difference;

				    options = {
						host: 'localhost',
						port: 8080,
						method: 'GET',
					    path: '/api/quotient/' + difference + '/' + coefficient
					};
						
					http.get(options, function(responseQuotient) {
							
						responseBody = "";
							
						responseQuotient.on("data", function(chunk) {
							responseBody += chunk;
						});

						responseQuotient.on("end", function() {
							parsed = JSON.parse(responseBody);				    
							res.json({ "x" : parsed.quotient });
						});
					});
				});
			});
		}
		else if (equationSides[1].indexOf("*") > 0) {
			
			var monomials = equationSides[1].split("*");
			var x = parseInt(monomials[0]);
			var y = parseInt(monomials[1]);
			
			// find product and quotient
			
			var http = require('http');
			
			var options = {
			    host: 'localhost',
			    port: 8080,
			    method: 'GET',
				path: '/api/product/' + x + '/' + y
			};
			
			http.get(options, function(responseProduct) {
				
				var responseBody = "";
				
				responseProduct.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				responseProduct.on("end", function() {

				    var parsed = JSON.parse(responseBody);
				    var product = parsed.product;

				    options = {
						host: 'localhost',
						port: 8080,
						method: 'GET',
					    path: '/api/quotient/' + product + '/' + coefficient
					};
						
					http.get(options, function(responseQuotient) {
							
						responseBody = "";
							
						responseQuotient.on("data", function(chunk) {
							responseBody += chunk;
						});

						responseQuotient.on("end", function() {
							parsed = JSON.parse(responseBody);				    
							res.json({ "x" : parsed.quotient });
						});
					});
				});
			});
		}
		else if (equationSides[1].indexOf("/") > 0) {
			
			var monomials = equationSides[1].split("/");
			var dividend = parseInt(monomials[0]);
			var divisor = parseInt(monomials[1]);
			
			// find quotient and quotient	
			
			var http = require('http');
			
			var options = {
			    host: 'localhost',
			    port: 8080,
			    method: 'GET',
				path: '/api/quotient/' + dividend + '/' + divisor
			};
			
			http.get(options, function(responseQuotient) {
				
				var responseBody = "";
				
				responseQuotient.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				responseQuotient.on("end", function() {

				    var parsed = JSON.parse(responseBody);
				    var quotient = parsed.quotient;
				    
				    if (quotient === "undefined") {
				    	res.json({ "x" : "undefined" });
				    }
				    else {
				    	options = {
							host: 'localhost',
							port: 8080,
							method: 'GET',
							path: '/api/quotient/' + quotient + '/' + coefficient
						};
								
						http.get(options, function(responseQuotient) {
									
							responseBody = "";
									
							responseQuotient.on("data", function(chunk) {
								responseBody += chunk;
							});

							responseQuotient.on("end", function() {
								parsed = JSON.parse(responseBody);				    
								res.json({ "x" : parsed.quotient });
							});
						});
				    }
				    
				});
			});
		}
		else {
			var monomial = parseInt(equationSides[1]);

			// find quotient
			
			var http = require('http');
			
			var options = {
			    host: 'localhost',
			    port: 8080,
			    method: 'GET',
				path: '/api/quotient/' + monomial + '/' + coefficient
			};
			
			http.get(options, function(resQuotient) {
				
				var responseBody = "";
				
				resQuotient.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				resQuotient.on("end", function() {
				    var parsed = JSON.parse(responseBody);				    
				    res.json({ "x" : parsed.quotient });
				});
			});
		}		
	});

// test the addition function
// http://localhost:8080/api/sumTest
router.route("/sumTest")

	.get(function(req, res) {
		
		var http = require('http');
		var testMaxCount = 20;
		var testResponseCount = 0;

		for (var i = 0; i < testMaxCount; i++) {
			
			var x = parseInt(Math.random()*20);
			var y = parseInt(Math.random()*20);
			
			var options = {
				host: 'localhost',
				port: 8080,
				method: 'GET',
			    path: '/api/sum/' + x + '/' + y
			};
			
			var errorMessage = "";
			
			http.get(options, function(responseSum) {
				
				var responseBody = "";
				
				responseSum.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				responseSum.on("end", function() {

				    var parsed = JSON.parse(responseBody);

				    if (parseInt(parsed.x) + parseInt(parsed.y) != parseInt(parsed.sum)) {

				    	// build error message of all bad results
				    	if (errorMessage != "") {
				    		errorMessage += "; ";
				    	}
				    	
				    	errorMessage += parsed.x + " + " + parsed.y + " != " + parsed.sum;
				    }
				    
				    testResponseCount++;

				    // after the final test, set the HTTP response
				    if (testResponseCount == testMaxCount - 1) {
				    	if (errorMessage == "") {
				    		res.json({ "success" : true });
				    	}
				    	else {
				    		res.json({ "error" : errorMessage });
				    	}
				    }
				});
			});
		}
	});

// test the subtraction function
// http://localhost:8080/api/differenceTest
router.route("/differenceTest")

	.get(function(req, res) {
		
		var http = require('http');
		var testMaxCount = 20;
		var testResponseCount = 0;

		for (var i = 0; i < testMaxCount; i++) {
			
			var subtrahend = parseInt(Math.random()*20);
			var minuend = subtrahend + parseInt(Math.random()*20);			
			
			var options = {
				host: 'localhost',
				port: 8080,
				method: 'GET',
			    path: '/api/difference/' + minuend + '/' + subtrahend
			};
			
			var errorMessage = "";
			
			http.get(options, function(responseSum) {
				
				var responseBody = "";
				
				responseSum.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				responseSum.on("end", function() {

				    var parsed = JSON.parse(responseBody);

				    if (parseInt(parsed.minuend) - parseInt(parsed.subtrahend) !=  
				    	parseInt(parsed.difference)) {

				    	// build error message of all bad results
				    	if (errorMessage != "") {
				    		errorMessage += "; ";
				    	}
				    	
				    	errorMessage += parsed.minuend + " - " + 
				    		parsed.subtrahend + " != " + 
				    		parsed.difference;
				    }
				    
				    testResponseCount++;

				    // after the final test, set the HTTP response
				    if (testResponseCount == testMaxCount - 1) {
				    	if (errorMessage == "") {
				    		res.json({ "success" : true });
				    	}
				    	else {
				    		res.json({ "error" : errorMessage });
				    	}
				    }
				});
			});
		}		
	});

// test the multiplication function
// http://localhost:8080/api/productTest
router.route("/productTest")

	.get(function(req, res) {
		
		var http = require('http');
		var testMaxCount = 20;
		var testResponseCount = 0;

		for (var i = 0; i < testMaxCount; i++) {
			
			var x = parseInt(Math.random()*20);
			var y = parseInt(Math.random()*20);
			
			var options = {
				host: 'localhost',
				port: 8080,
				method: 'GET',
			    path: '/api/product/' + x + '/' + y
			};
			
			var errorMessage = "";
			
			http.get(options, function(responseSum) {
				
				var responseBody = "";
				
				responseSum.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				responseSum.on("end", function() {

				    var parsed = JSON.parse(responseBody);

				    if (parseInt(parsed.x) * parseInt(parsed.y) != 
				    	parseInt(parsed.product)) {

				    	// build error message of all bad results
				    	if (errorMessage != "") {
				    		errorMessage += "; ";
				    	}
				    	
				    	errorMessage += parsed.x + " * " + parsed.y + " != " + parsed.product;
				    }
				    
				    testResponseCount++;

				    // after the final test, set the HTTP response
				    if (testResponseCount == testMaxCount - 1) {
				    	if (errorMessage == "") {
				    		res.json({ "success" : true });
				    	}
				    	else {
				    		res.json({ "error" : errorMessage });
				    	}
				    }
				});
			});
		}		
	});

// test the division function
// http://localhost:8080/api/quotientTest
router.route("/quotientTest")

	.get(function(req, res) {
		
		var http = require('http');
		var testMaxCount = 20;
		var testResponseCount = 0;

		for (var i = 0; i < testMaxCount; i++) {
			
			var divisor = parseInt(Math.random()*10+1);
			var dividend = divisor * parseInt(Math.random()*20+1);
			
			var options = {
				host: 'localhost',
				port: 8080,
				method: 'GET',
			    path: '/api/quotient/' + dividend + '/' + divisor
			};
			
			var errorMessage = "";
			
			http.get(options, function(responseSum) {
				
				var responseBody = "";
				
				responseSum.on("data", function(chunk) {
					responseBody += chunk;
				});
				
				responseSum.on("end", function() {

				    var parsed = JSON.parse(responseBody);

				    if (parseInt(parsed.dividend) / parseInt(parsed.divisor) != 
				    	parseInt(parsed.quotient)) {

				    	// build error message of all bad results
				    	if (errorMessage != "") {
				    		errorMessage += "; ";
				    	}
				    	
				    	errorMessage += parsed.dividend + " / " + 
				    		parsed.divisor + " != " + 
				    		parsed.quotient;
				    }
				    
				    testResponseCount++;

				    // after the final test, set the HTTP response
				    if (testResponseCount == testMaxCount - 1) {
				    	if (errorMessage == "") {
				    		res.json({ "success" : true });
				    	}
				    	else {
				    		res.json({ "error" : errorMessage });
				    	}
				    }
				});
			});
		}		
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);
