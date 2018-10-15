https://www.djamware.com/post/5a0673c880aca7739224ee21/mean-stack-angular-5-crud-web-application-example



<div class="col-lg-12 col-md-12 col-sm-12">
<div class="article-detail">
<h1>MEAN Stack (Angular 5) CRUD Web Application Example</h1>
<span class="list-date">by Didin J. on Nov 11, 2017</span>
<img src="https://s3-ap-southeast-1.amazonaws.com/djamblog/article-111117105134.png" alt="MEAN Stack (Angular 5) CRUD Web Application Example" class="img-responsive padding-top">
<blockquote><h2>Step by step tutorial on building MEAN Stack (Angular 5) Create-Read-Update-Delete (CRUD) Web Application from scratch using Angular CLI.</h2></blockquote>
<div class="article-content"><p>Step by step tutorial on building MEAN Stack (Angular 5) Create-Read-Update-Delete (CRUD) Web Application from scratch using Angular CLI. As you know that Angular 5 has been launched a few days ago, we need to test out their feature especially with MEAN Stack. MEAN stands for MongoDB, Express, Angular, and Node.js. MongoDB and Express on Node.js environment used as backend and Angular 5 used as the front end. As the previous <a href="https://www.djamware.com/post/58cf4e1c80aca72df8d1cf7e/tutorial-building-crud-app-from-scratch-using-mean-stack-angular-2">tutorial</a> about MEAN stack, we will be wrapping Express and Angular 5 together. run as one server.</p>
<p>
<span id="ezoic-pub-ad-placeholder-100"></span><span style="display:inline-block;float:none !important;margin-bottom:2px !important;margin-left:0px !important;margin-right:0px !important;margin-top:2px !important;min-height:270px;min-width:300px;" class="ezoic-ad medrectangle-3 adtester-container adtester-container-100" data-ez-name="djamware_com-medrectangle-3"><span id="div-gpt-ad-djamware_com-medrectangle-3-0" ezaw="300" ezah="250" style="position: relative; z-index: 0; min-height: 250px; min-width: 300px;" class="ezoic-ad ezfound" data-google-query-id="CNDc8KGTiN4CFZtKKwodq38Cog"><div id="google_ads_iframe_/1254144/djamware_com-medrectangle-3_0__container__" style="border: 0pt none; display: inline-block; width: 300px; height: 250px;"><iframe frameborder="0" src="https://tpc.googlesyndication.com/safeframe/1-0-29/html/container.html" id="google_ads_iframe_/1254144/djamware_com-medrectangle-3_0" title="3rd party ad content" name="" scrolling="no" marginwidth="0" marginheight="0" width="300" height="250" data-is-safeframe="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" style="border: 0px; vertical-align: bottom;" data-load-complete="true"></iframe></div></span></span>
</p>
<p>The following tools, frameworks, and modules are required for this tutorial:</p>
<p>- Node.js (recommended version)<br>
- Angular CLI 1.5<br>
- Angular 5<br>
- MongoDB<br>
- Express.js<br>
- Mongoose.js<br>
- IDE or Text Editor</p>
<p>We assume that you already installed Node.js and runnable in the Terminal (Linux/Mac) or Node.js command line (Windows). Also, you have installed MongoDB and run Mongo daemon on your machine.</p>
<h3><br>
<strong>1. Update Angular CLI and Create Angular 5 Application</strong></h3>
<p>First, we have to update the Angular CLI to the latest version (1.5 when this tutorial was written). Open the terminal or Node command line then go to your projects folder. Type this command for updating Angular CLI.</p>
<pre><code>sudo npm install -g @angular/cli</code></pre>
<p>You can exclude `sudo` when you update or install Angular CLI on Windows/Node command line. Now, type this command to create new Angular 2 application.</p>
<pre><code>ng new mean-angular5</code></pre>
<p>Go to the newly created application folder.</p>
<pre><code>cd ./mean-angular5</code></pre>
<p>Run the Angular 2 application by typing this command.</p>
<pre><code>ng serve</code></pre>
<p>You see the compilation process faster than the previous Angular version.</p>
<pre><code>** NG Live Development Server is listening on localhost:4200, open your browser on <a class="vglnk" href="http://localhost:4200/" rel="nofollow"><span>http</span><span>://</span><span>localhost</span><span>:</span><span>4200</span><span>/</span></a> **
Date: 2017-11-10T23:12:58.186Z &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;- Hash: a8de16d629b34a42bbda
Time: 9459ms
chunk {inline} inline.bundle.js (inline) 5.79 kB [entry] [rendered]
chunk {main} main.bundle.js (main) 20.6 kB [initial] [rendered]
chunk {polyfills} polyfills.bundle.js (polyfills) 553 kB [initial] [rendered]
chunk {styles} styles.bundle.js (styles) 33.8 kB [initial] [rendered]
chunk {vendor} vendor.bundle.js (vendor) 7.03 MB [initial] [rendered]

webpack: Compiled successfully.</code></pre>
<p>Now, open the browser then go to `<a class="vglnk" href="http://localhost:4200" rel="nofollow"><span>http</span><span>://</span><span>localhost</span><span>:</span><span>4200</span></a>` you should see this page.</p>
<p><img alt="MEAN Stack (Angular 5) CRUD Web Application Example - Angular 5 Landing Page" src="https://s3-ap-southeast-1.amazonaws.com/djamblog/article-111117061714.png" style="border-style:solid; border-width:1px; height:462px; width:500px"></p>
<h3><br>
<strong>2. Replace Web Server with Express.js</strong></h3>
<p>Close the running Angular app first by press `ctrl+c` then type this command for adding Express.js modules and it dependencies.</p>
<pre><code>npm install --save express body-parser morgan body-parser serve-favicon</code></pre>
<p>Then, add bin folder and www file inside bin folder.</p>
<pre><code>mkdir bin
touch bin/www</code></pre>
<p>Open and edit www file then add this lines of codes.</p>
<pre><code>#!/usr/bin/env node

/**
&nbsp;* Module dependencies.
&nbsp;*/

var app = require('../app');
var debug = require('debug')('mean-app:server');
var http = require('http');

/**
&nbsp;* Get port from environment and store in Express.
&nbsp;*/

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
&nbsp;* Create HTTP server.
&nbsp;*/

var server = http.createServer(app);

/**
&nbsp;* Listen on provided port, on all network interfaces.
&nbsp;*/

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
&nbsp;* Normalize a port into a number, string, or false.
&nbsp;*/

function normalizePort(val) {
&nbsp; var port = parseInt(val, 10);

&nbsp; if (isNaN(port)) {
&nbsp; &nbsp; // named pipe
&nbsp; &nbsp; return val;
&nbsp; }

&nbsp; if (port &gt;= 0) {
&nbsp; &nbsp; // port number
&nbsp; &nbsp; return port;
&nbsp; }

&nbsp; return false;
}

/**
&nbsp;* Event listener for HTTP server "error" event.
&nbsp;*/

function onError(error) {
&nbsp; if (error.syscall !== 'listen') {
&nbsp; &nbsp; throw error;
&nbsp; }

&nbsp; var bind = typeof port === 'string'
&nbsp; &nbsp; ? 'Pipe ' + port
&nbsp; &nbsp; : 'Port ' + port;

&nbsp; // handle specific listen errors with friendly messages
&nbsp; switch (error.code) {
&nbsp; &nbsp; case 'EACCES':
&nbsp; &nbsp; &nbsp; console.error(bind + ' requires elevated privileges');
&nbsp; &nbsp; &nbsp; process.exit(1);
&nbsp; &nbsp; &nbsp; break;
&nbsp; &nbsp; case 'EADDRINUSE':
&nbsp; &nbsp; &nbsp; console.error(bind + ' is already in use');
&nbsp; &nbsp; &nbsp; process.exit(1);
&nbsp; &nbsp; &nbsp; break;
&nbsp; &nbsp; default:
&nbsp; &nbsp; &nbsp; throw error;
&nbsp; }
}

/**
&nbsp;* Event listener for HTTP server "listening" event.
&nbsp;*/

function onListening() {
&nbsp; var addr = server.address();
&nbsp; var bind = typeof addr === 'string'
&nbsp; &nbsp; ? 'pipe ' + addr
&nbsp; &nbsp; : 'port ' + addr.port;
&nbsp; debug('Listening on ' + bind);
}</code></pre>
<p>To make the server run from bin/www, open and edit "package.json" then replace "start" value.</p>
<pre><code>"scripts": {
&nbsp; "ng": "ng",
&nbsp; "start": "ng build &amp;&amp; node ./bin/www",
&nbsp; "build": "ng build",
&nbsp; "test": "ng test",
&nbsp; "lint": "ng lint",
&nbsp; "e2e": "ng e2e"
},</code></pre>
<p>Now, create app.js in the root of project folder.</p>
<pre><code>touch app.js</code></pre>
<p>Open and edit app.js then add all this lines of codes.</p>
<pre><code>var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var book = require('./routes/book');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/books', express.static(path.join(__dirname, 'dist')));
app.use('/book', book);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
&nbsp; var err = new Error('Not Found');
&nbsp; err.status = 404;
&nbsp; next(err);
});

// error handler
app.use(function(err, req, res, next) {
&nbsp; // set locals, only providing error in development
&nbsp; res.locals.message = err.message;
&nbsp; res.locals.error = req.app.get('env') === 'development' ? err : {};

&nbsp; // render the error page
&nbsp; res.status(err.status || 500);
&nbsp; res.render('error');
});

module.exports = app;</code></pre>
<p>Next, create routes folder then create routes file for the book.</p>
<pre><code>mkdir routes
touch routes/book.js</code></pre>
<p>Open and edit `routes/book.js` file then add this lines of codes.</p>
<pre><code>var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
&nbsp; res.send('Express RESTful API');
});

module.exports = router;</code></pre>
<p>Now, run the server using this command.</p>
<pre><code>npm start</code></pre>
<p>You will see the previous Angular landing page when you point your browser to `<a class="vglnk" href="http://localhost:3000" rel="nofollow"><span>http</span><span>://</span><span>localhost</span><span>:</span><span>3000</span></a>`. When you change the address to `<a class="vglnk" href="http://localhost:3000/book" rel="nofollow"><span>http</span><span>://</span><span>localhost</span><span>:</span><span>3000</span><span>/</span><span>book</span></a>` you will see this page.</p>
<p><img alt="MEAN Stack (Angular 5) CRUD Web Application Example - Express RESTful API response" src="https://s3-ap-southeast-1.amazonaws.com/djamblog/article-111117063509.png" style="border-style:solid; border-width:1px; height:187px; width:400px"></p>
<p>Now, we have RESTful API with the compiled Angular 5 front end.</p>
<h3><br>
<strong>3. Install and Configure Mongoose.js</strong></h3>
<p>We need to access data from MongoDB. For that we will install and configure Mongoose.js. On the terminal type this command after stopping the running Express server.</p>
<pre><code>npm install --save mongoose bluebird</code></pre>
<p>Open and edit `app.js` then add this lines after another variable line.</p>
<pre><code>var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mean-angular5', { useMongoClient: true, promiseLibrary: require('bluebird') })
&nbsp; .then(() =&gt; &nbsp;console.log('connection succesful'))
&nbsp; .catch((err) =&gt; console.error(err));</code></pre>
<p>Now, run MongoDB server on different terminal tab or command line or run from the service.</p>
<pre><code>mongod</code></pre>
<p>Next, you can test the connection to MongoDB run again the Node application and you will see this message on the terminal.</p>
<pre><code>connection succesful</code></pre>
<p>If you are still using built-in Mongoose Promise library, you will get this deprecated warning on the terminal.</p>
<pre><code>(node:42758) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: <a class="vglnk" href="http://mongoosejs.com/docs/promises.html" rel="nofollow"><span>http</span><span>://</span><span>mongoosejs</span><span>.</span><span>com</span><span>/</span><span>docs</span><span>/</span><span>promises</span><span>.</span><span>html</span></a></code></pre>
<p>That's the reason why we added `bluebird` modules and register it as Mongoose Promise library.</p>
<h3><br>
<strong>4. Create Mongoose.js Model</strong></h3>
<p>Add a models folder on the root of project folder for hold Mongoose.js model files.</p>
<pre><code>mkdir models</code></pre>
<p>Create new Javascript file that uses for Mongoose.js model. We will create a model of Book collection.</p>
<pre><code>touch models/Book.js</code></pre>
<p>Now, open and edit that file and add Mongoose require.</p>
<pre><code>var mongoose = require('mongoose');</code></pre>
<p>Then add model fields like this.</p>
<pre><code>var BookSchema = new mongoose.Schema({
&nbsp; isbn: String,
&nbsp; title: String,
&nbsp; author: String,
&nbsp; description: String,
&nbsp; published_year: String,
&nbsp; publisher: String,
&nbsp; updated_date: { type: Date, default: Date.now },
});</code></pre>
<p>That Schema will mapping to MongoDB collections called book. If you want to know more about Mongoose Schema Datatypes you can find it <a href="http://mongoosejs.com/docs/schematypes.html">here</a>. Next, export that schema.</p>
<pre><code>module.exports = mongoose.model('Book', BookSchema);</code></pre>
<h3><br>
<strong>5. Create Routes for Accessing Book Data via Restful API</strong></h3>
<p>Open and edit again "routes/book.js” then replace all codes with this.</p>
<pre><code>var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Book = require('../models/Book.js');

/* GET ALL BOOKS */
router.get('/', function(req, res, next) {
&nbsp; Book.find(function (err, products) {
&nbsp; &nbsp; if (err) return next(err);
&nbsp; &nbsp; res.json(products);
&nbsp; });
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function(req, res, next) {
&nbsp; Book.findById(req.params.id, function (err, post) {
&nbsp; &nbsp; if (err) return next(err);
&nbsp; &nbsp; res.json(post);
&nbsp; });
});

/* SAVE BOOK */
router.post('/', function(req, res, next) {
&nbsp; Book.create(req.body, function (err, post) {
&nbsp; &nbsp; if (err) return next(err);
&nbsp; &nbsp; res.json(post);
&nbsp; });
});

/* UPDATE BOOK */
router.put('/:id', function(req, res, next) {
&nbsp; Book.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
&nbsp; &nbsp; if (err) return next(err);
&nbsp; &nbsp; res.json(post);
&nbsp; });
});

/* DELETE BOOK */
router.delete('/:id', function(req, res, next) {
&nbsp; Book.findByIdAndRemove(req.params.id, req.body, function (err, post) {
&nbsp; &nbsp; if (err) return next(err);
&nbsp; &nbsp; res.json(post);
&nbsp; });
});

module.exports = router;</code></pre>
<p>Run again the Express server then open the other terminal or command line to test the Restful API by type this command.</p>
<pre><code>curl -i -H "Accept: application/json" localhost:3000/book</code></pre>
<p>If that command return response like below then REST API is ready to go.</p>
<pre><code>HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2
ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
Date: Fri, 10 Nov 2017 23:53:52 GMT
Connection: keep-alive</code></pre>
<p>Now, let's populate Book collection with initial data that sent from RESTful API. Run this command to populate it.</p>
<pre><code>curl -i -X POST -H "Content-Type: application/json" -d '{ "isbn":"123442123, 97885654453443","title":"Learn how to build modern web application with MEAN stack","author": "Didin J.","description":"The comprehensive step by step tutorial on how to build MEAN (MongoDB, Express.js, Angular 5 and Node.js) stack web application from scratch","published_year":"2017","publisher":"Djamware.com" }' localhost:3000/book</code></pre>
<p>
<span id="ezoic-pub-ad-placeholder-113"></span><span style="display:block !important;float:none !important;margin-bottom:2px !important;margin-left:0px !important;margin-right:0px !important;margin-top:2px !important;min-height:270px;min-width:250px;text-align:center !important;" class="ezoic-ad banner-1 adtester-container adtester-container-113" data-ez-name="djamware_com-banner-1"><span id="div-gpt-ad-djamware_com-banner-1-0" ezaw="250" ezah="250" style="position: relative; z-index: 0; min-height: 250px; min-width: 250px;" class="ezoic-ad ezfound" data-google-query-id="CMjOj-mRiN4CFcpgKwodzU0P_A"><div id="google_ads_iframe_/1254144/djamware_com-banner-1_0__container__" style="border: 0pt none; display: inline-block; width: 250px; height: 250px;"><iframe frameborder="0" src="https://tpc.googlesyndication.com/safeframe/1-0-29/html/container.html" id="google_ads_iframe_/1254144/djamware_com-banner-1_0" title="3rd party ad content" name="" scrolling="no" marginwidth="0" marginheight="0" width="250" height="250" data-is-safeframe="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" style="border: 0px; vertical-align: bottom;" data-load-complete="true"></iframe></div></span></span>
</p>
<p>You will see this response to the terminal if success.</p>
<pre><code>HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 415
ETag: W/"19f-SB/dEQyffaTjobOBJbvmwCn7WJA"
Date: Fri, 10 Nov 2017 23:58:11 GMT
Connection: keep-alive

{"__v":0,"isbn":"123442123, 97885654453443","title":"Learn how to build modern web application with MEAN stack","author":"Didin J.","description":"The comprehensive step by step tutorial on how to build MEAN (MongoDB, Express.js, Angular 5 and Node.js) stack web application from scratch","published_year":"2017","publisher":"Djamware.com","_id":"5a063d123cf0792af12ce45d","updated_date":"2017-11-10T23:58:10.971Z"}MacBook-Pro:mean-angular5</code></pre>
<h3><br>
<strong>6. Create Angular 5 Component for Displaying Book List</strong></h3>
<p>To create Angular 5 Component, simply run this command.</p>
<pre><code>ng g component book</code></pre>
<p>That command will generate all required files for build book component and also automatically added book component to app.module.ts.</p>
<pre><code>create src/app/book/book.component.css (0 bytes)
create src/app/book/book.component.html (23 bytes)
create src/app/book/book.component.spec.ts (614 bytes)
create src/app/book/book.component.ts (321 bytes)
update src/app/app.module.ts (390 bytes)</code></pre>
<p>Before add any functionality to the component, we need to add `HttpClientModule` to `app.module.ts`. Open and edit `src/app/app.module.ts` then add this import.</p>
<pre><code>import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';</code></pre>
<p>Add it to `@NgModule` imports after `BrowserModule`.</p>
<pre><code>imports: [
&nbsp; BrowserModule,
&nbsp; FormsModule,
&nbsp; HttpClientModule
],</code></pre>
<p>Now, we will making a request to Book RESTful API using this Angular `HttpClient` module. Open and edit `src/app/book/book.component.ts` then add this import.</p>
<pre><code>import { HttpClient } from '@angular/common/http';</code></pre>
<p>Inject `HttpClient` to the constructor.</p>
<pre><code>constructor(private http: HttpClient) { }</code></pre>
<p>Add array variable for holding books data before the constructor.</p>
<pre><code>books: any;</code></pre>
<p>Add a few lines of codes for getting a list of book data from RESTful API inside `ngOnInit` function.</p>
<pre><code>ngOnInit() {
&nbsp; this.http.get('/book').subscribe(data =&gt; {
&nbsp; &nbsp; this.books = data;
&nbsp; });
}</code></pre>
<p>Now, we can display the book list on the page. Open and edit `src/app/book/book.component.html` then replace all tags with this lines of HTML tags.</p>
<pre><code>&lt;div class="container"&gt;
&nbsp; &lt;h1&gt;Book List&lt;/h1&gt;
&nbsp; &lt;table class="table"&gt;
&nbsp; &nbsp; &lt;thead&gt;
&nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;th&gt;Title&lt;/th&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;th&gt;Author&lt;/th&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;th&gt;Action&lt;/th&gt;
&nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &lt;/thead&gt;
&nbsp; &nbsp; &lt;tbody&gt;
&nbsp; &nbsp; &nbsp; &lt;tr *ngFor="let book of books"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;td&gt;{{ book.title }}&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;td&gt;{{ book.author }}&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;td&gt;Show Detail&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &lt;/tbody&gt;
&nbsp; &lt;/table&gt;
&lt;/div&gt;</code></pre>
<p>That HTML tags include style class from Bootstrap CSS library. Open and edit `src/index.html` then add the Bootstrap CSS and JS library.</p>
<pre><code>&lt;!doctype html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
&nbsp; &lt;meta charset="utf-8"&gt;
&nbsp; &lt;title&gt;MeanAngular5&lt;/title&gt;
&nbsp; &lt;base href="/"&gt;

&nbsp; &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&nbsp; &lt;link rel="icon" type="image/x-icon" href="favicon.ico"&gt;
&nbsp; &lt;!-- Latest compiled and minified CSS --&gt;
&nbsp; &lt;link rel="stylesheet" href="<a class="vglnk" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="nofollow"><span>https</span><span>://</span><span>maxcdn</span><span>.</span><span>bootstrapcdn</span><span>.</span><span>com</span><span>/</span><span>bootstrap</span><span>/</span><span>3</span><span>.</span><span>3</span><span>.</span><span>7</span><span>/</span><span>css</span><span>/</span><span>bootstrap</span><span>.</span><span>min</span><span>.</span><span>css</span></a>" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"&gt;
&nbsp; &lt;!-- Optional theme --&gt;
&nbsp; &lt;link rel="stylesheet" href="<a class="vglnk" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" rel="nofollow"><span>https</span><span>://</span><span>maxcdn</span><span>.</span><span>bootstrapcdn</span><span>.</span><span>com</span><span>/</span><span>bootstrap</span><span>/</span><span>3</span><span>.</span><span>3</span><span>.</span><span>7</span><span>/</span><span>css</span><span>/</span><span>bootstrap</span><span>-</span><span>theme</span><span>.</span><span>min</span><span>.</span><span>css</span></a>" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"&gt;
&lt;/head&gt;
&lt;body&gt;
&nbsp; &lt;app-root&gt;&lt;/app-root&gt;
&nbsp; &lt;!-- Latest compiled and minified JavaScript --&gt;
&nbsp; &lt;script src="<a class="vglnk" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" rel="nofollow"><span>https</span><span>://</span><span>maxcdn</span><span>.</span><span>bootstrapcdn</span><span>.</span><span>com</span><span>/</span><span>bootstrap</span><span>/</span><span>3</span><span>.</span><span>3</span><span>.</span><span>7</span><span>/</span><span>js</span><span>/</span><span>bootstrap</span><span>.</span><span>min</span><span>.</span><span>js</span></a>" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3><br>
<strong>7. Create Angular 5 Routes to Book Component</strong></h3>
<p>To use book component as default landing page, open and edit `src/app/app.module.ts` the add import for Routing.</p>
<pre><code>import { RouterModule, Routes } from '@angular/router';</code></pre>
<p>Create constant router for routing to book component before `@NgModule`.</p>
<pre><code>const appRoutes: Routes = [
&nbsp; {
&nbsp; &nbsp; path: 'books',
&nbsp; &nbsp; component: BookComponent,
&nbsp; &nbsp; data: { title: 'Book List' }
&nbsp; },
&nbsp; { path: '',
&nbsp; &nbsp; redirectTo: '/books',
&nbsp; &nbsp; pathMatch: 'full'
&nbsp; }
];</code></pre>
<p>In @NgModule imports, section adds ROUTES constant, so imports section will be like this.</p>
<pre><code>imports: [
&nbsp; BrowserModule,
&nbsp; HttpClientModule,
&nbsp; RouterModule.forRoot(
&nbsp; &nbsp; appRoutes,
&nbsp; &nbsp; { enableTracing: true } // &lt;-- debugging purposes only
&nbsp; )
],</code></pre>
<p>To activate that routes in Angular 5, open and edit `src/app/app.component.html` then replace all codes with this.</p>
<pre><code>&lt;router-outlet&gt;&lt;/router-outlet&gt;</code></pre>
<p>Now, we have to test our MEAN app with only list page. Build then run the application.</p>
<pre><code>npm start</code></pre>
<p>You should see this page when pointing to `<a class="vglnk" href="http://localhost:3000" rel="nofollow"><span>http</span><span>://</span><span>localhost</span><span>:</span><span>3000</span></a>` or `<a class="vglnk" href="http://localhost:3000/books" rel="nofollow"><span>http</span><span>://</span><span>localhost</span><span>:</span><span>3000</span><span>/</span><span>books</span></a>`.</p>
<p><img alt="MEAN Stack (Angular 5) CRUD Web Application Example - Book List" src="https://s3-ap-southeast-1.amazonaws.com/djamblog/article-111117082720.png" style="border-style:solid; border-width:1px; height:249px; width:500px"></p>
<h3><br>
<strong>8. Create Angular 5 Component for Displaying Book Detail</strong></h3>
<p>Same as previous section, type this command to generate new component.</p>
<pre><code>ng g component book-detail</code></pre>
<p>Add router to `src/app/app.module.ts` routes constant.</p>
<pre><code>const appRoutes: Routes = [
&nbsp; {
&nbsp; &nbsp; path: 'books',
&nbsp; &nbsp; component: BookComponent,
&nbsp; &nbsp; data: { title: 'Book List' }
&nbsp; },
&nbsp; {
&nbsp; &nbsp; path: 'book-details/:id',
&nbsp; &nbsp; component: BookDetailComponent,
&nbsp; &nbsp; data: { title: 'Book Details' }
&nbsp; },
&nbsp; { path: '',
&nbsp; &nbsp; redirectTo: '/books',
&nbsp; &nbsp; pathMatch: 'full'
&nbsp; }
];</code></pre>
<p>Open and edit `src/app/book-detail/book-detail.component.ts`. Replace all codes with this.</p>
<pre><code>import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
&nbsp; selector: 'app-book-detail',
&nbsp; templateUrl: './book-detail.component.html',
&nbsp; styleUrls: ['./book-detail.component.css'],
&nbsp; encapsulation: ViewEncapsulation.None
})
export class BookDetailComponent implements OnInit {

&nbsp; book = {};

&nbsp; constructor(private route: ActivatedRoute, private http: HttpClient) { }

&nbsp; ngOnInit() {
&nbsp; &nbsp; this.getBookDetail(this.route.snapshot.params['id']);
&nbsp; }

&nbsp; getBookDetail(id) {
&nbsp; &nbsp; this.http.get('/book/'+id).subscribe(data =&gt; {
&nbsp; &nbsp; &nbsp; this.book = data;
&nbsp; &nbsp; });
&nbsp; }

}</code></pre>
<p>Open and edit `src/app/book-detail/book-detail.component.html`. Replace all codes with this.</p>
<pre><code>&lt;div class="container"&gt;
&nbsp; &lt;h1&gt;{{ book.title }}&lt;/h1&gt;
&nbsp; &lt;dl class="list"&gt;
&nbsp; &nbsp; &lt;dt&gt;ISBN&lt;/dt&gt;
&nbsp; &nbsp; &lt;dd&gt;{{ book.isbn }}&lt;/dd&gt;
&nbsp; &nbsp; &lt;dt&gt;Author&lt;/dt&gt;
&nbsp; &nbsp; &lt;dd&gt;{{ book.author }}&lt;/dd&gt;
&nbsp; &nbsp; &lt;dt&gt;Publisher&lt;/dt&gt;
&nbsp; &nbsp; &lt;dd&gt;{{ book.publisher }}&lt;/dd&gt;
&nbsp; &nbsp; &lt;dt&gt;Price&lt;/dt&gt;
&nbsp; &nbsp; &lt;dd&gt;{{ book.price }}&lt;/dd&gt;
&nbsp; &nbsp; &lt;dt&gt;Update Date&lt;/dt&gt;
&nbsp; &nbsp; &lt;dd&gt;{{ book.updated_at }}&lt;/dd&gt;
&nbsp; &lt;/dl&gt;
&lt;/div&gt;</code></pre>
<h3><br>
<strong>9. Create Angular 5 Component for Add New Book</strong></h3>
<p>To create a component to add new Book, type this command as usual.</p>
<pre><code>ng g component book-create</code></pre>
<p>Add router to `src/app/app.module.ts` routes constant.</p>
<pre><code>const appRoutes: Routes = [
&nbsp; {
&nbsp; &nbsp; path: 'books',
&nbsp; &nbsp; component: BookComponent,
&nbsp; &nbsp; data: { title: 'Book List' }
&nbsp; },
&nbsp; {
&nbsp; &nbsp; path: 'book-details/:id',
&nbsp; &nbsp; component: BookDetailComponent,
&nbsp; &nbsp; data: { title: 'Book Details' }
&nbsp; },
&nbsp; {
&nbsp; &nbsp; path: 'book-create',
&nbsp; &nbsp; component: BookCreateComponent,
&nbsp; &nbsp; data: { title: 'Create Book' }
&nbsp; },
&nbsp; { path: '',
&nbsp; &nbsp; redirectTo: '/books',
&nbsp; &nbsp; pathMatch: 'full'
&nbsp; }
];</code></pre>
<p>Add 'book-create' link on `src/app/book/book.component.html`.</p>
<pre><code>&lt;h1&gt;Book List
&nbsp; &lt;a [routerLink]="['/book-create']" class="btn btn-default btn-lg"&gt;
&nbsp; &nbsp; &lt;span class="glyphicon glyphicon-plus" aria-hidden="true"&gt;&lt;/span&gt;
&nbsp; &lt;/a&gt;
&lt;/h1&gt;</code></pre>
<p>Now, open and edit `src/app/book/book-create.component.ts` then replace all with this codes.</p>
<pre><code>import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
&nbsp; selector: 'app-book-create',
&nbsp; templateUrl: './book-create.component.html',
&nbsp; styleUrls: ['./book-create.component.css'],
&nbsp; encapsulation: ViewEncapsulation.None
})
export class BookCreateComponent implements OnInit {

&nbsp; book = {};

&nbsp; constructor(private http: HttpClient, private router: Router) { }

&nbsp; ngOnInit() {
&nbsp; }

&nbsp; saveBook() {
&nbsp; &nbsp; this.http.post('/book', this.book)
&nbsp; &nbsp; &nbsp; .subscribe(res =&gt; {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; let id = res['_id'];
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.router.navigate(['/book-details', id]);
&nbsp; &nbsp; &nbsp; &nbsp; }, (err) =&gt; {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; console.log(err);
&nbsp; &nbsp; &nbsp; &nbsp; }
&nbsp; &nbsp; &nbsp; );
&nbsp; }

}</code></pre>
<p>
<span id="ezoic-pub-ad-placeholder-101"></span><span style="display:inline-block;float:none !important;margin-bottom:2px !important;margin-left:0px !important;margin-right:0px !important;margin-top:2px !important;min-height:270px;min-width:250px;" class="ezoic-ad box-4 adtester-container adtester-container-101" data-ez-name="djamware_com-box-4"><span id="div-gpt-ad-djamware_com-box-4-0" ezaw="250" ezah="250" style="position: relative; z-index: 0; min-height: 250px; min-width: 250px;" class="ezoic-ad ezfound" data-google-query-id="CLeBleaRiN4CFVKHjwoddXMPug"><div id="google_ads_iframe_/1254144/djamware_com-box-4_0__container__" style="border: 0pt none; display: inline-block; width: 250px; height: 250px;"><iframe frameborder="0" src="https://tpc.googlesyndication.com/safeframe/1-0-29/html/container.html" id="google_ads_iframe_/1254144/djamware_com-box-4_0" title="3rd party ad content" name="" scrolling="no" marginwidth="0" marginheight="0" width="250" height="250" data-is-safeframe="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" style="border: 0px; vertical-align: bottom;" data-load-complete="true"></iframe></div></span></span>
</p>
<p>Modify `src/app/book-create/book-create.component.html`, replace all with this HTML tags.</p>
<pre><code>&lt;div class="container"&gt;
&nbsp; &lt;h1&gt;Add New Book&lt;/h1&gt;
&nbsp; &lt;div class="row"&gt;
&nbsp; &nbsp; &lt;div class="col-md-6"&gt;
&nbsp; &nbsp; &nbsp; &lt;form (ngSubmit)="saveBook()" #bookForm="ngForm"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;ISBN&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="text" class="form-control" [(ngModel)]="book.isbn" name="isbn" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;Title&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="text" class="form-control" [(ngModel)]="book.title" name="title" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;Author&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="text" class="form-control" [(ngModel)]="book.author" name="author" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;Published Year&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="number" class="form-control" [(ngModel)]="book.published_year" name="published_year" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;Publisher&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="text" class="form-control" [(ngModel)]="book.publisher" name="publisher" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;button type="submit" class="btn btn-success" [disabled]="!bookForm.form.valid"&gt;Save&lt;/button&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &lt;/form&gt;
&nbsp; &nbsp; &lt;/div&gt;
&nbsp; &lt;/div&gt;
&lt;/div&gt;</code></pre>
<h3><br>
<strong>10. Create Angular 5 Component for Edit Book</strong></h3>
<p>As usual, we will generate component for edit book. Type this command for doing that.</p>
<pre><code>ng g component book-edit</code></pre>
<p>Add route in `src/app/app.module.ts` so, it looks like this.</p>
<pre><code>const appRoutes: Routes = [
&nbsp; {
&nbsp; &nbsp; path: 'books',
&nbsp; &nbsp; component: BookComponent,
&nbsp; &nbsp; data: { title: 'Book List' }
&nbsp; },
&nbsp; {
&nbsp; &nbsp; path: 'book-details/:id',
&nbsp; &nbsp; component: BookDetailComponent,
&nbsp; &nbsp; data: { title: 'Book Details' }
&nbsp; },
&nbsp; {
&nbsp; &nbsp; path: 'book-create',
&nbsp; &nbsp; component: BookCreateComponent,
&nbsp; &nbsp; data: { title: 'Create Book' }
&nbsp; },
&nbsp; {
&nbsp; &nbsp; path: 'book-edit/:id',
&nbsp; &nbsp; component: BookEditComponent,
&nbsp; &nbsp; data: { title: 'Edit Book' }
&nbsp; },
&nbsp; { path: '',
&nbsp; &nbsp; redirectTo: '/books',
&nbsp; &nbsp; pathMatch: 'full'
&nbsp; }
];</code></pre>
<p>Open and edit again `src/app/book-details/book-details.component.html` and add edit routeLink in the last line.</p>
<pre><code>&lt;div class="row"&gt;
&nbsp; &lt;div class="col-md-12"&gt;
&nbsp; &nbsp; &lt;a [routerLink]="['/book-edit', book._id]" class="btn btn-success"&gt;EDIT&lt;/a&gt;
&nbsp; &lt;/div&gt;
&lt;/div&gt;</code></pre>
<p>Now, open and edit `src/app/book-edit/book-edit.component.ts` then replace all codes with this.</p>
<pre><code>import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
&nbsp; selector: 'app-book-edit',
&nbsp; templateUrl: './book-edit.component.html',
&nbsp; styleUrls: ['./book-edit.component.css'],
&nbsp; encapsulation: ViewEncapsulation.None
})
export class BookEditComponent implements OnInit {

&nbsp; book = {};

&nbsp; constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

&nbsp; ngOnInit() {
&nbsp; &nbsp; this.getBook(this.route.snapshot.params['id']);
&nbsp; }

&nbsp; getBook(id) {
&nbsp; &nbsp; this.http.get('/book/'+id).subscribe(data =&gt; {
&nbsp; &nbsp; &nbsp; this.book = data;
&nbsp; &nbsp; });
&nbsp; }

&nbsp; updateBook(id, data) {
&nbsp; &nbsp; this.http.put('/book/'+id, data)
&nbsp; &nbsp; &nbsp; .subscribe(res =&gt; {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; let id = res['_id'];
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.router.navigate(['/book-details', id]);
&nbsp; &nbsp; &nbsp; &nbsp; }, (err) =&gt; {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; console.log(err);
&nbsp; &nbsp; &nbsp; &nbsp; }
&nbsp; &nbsp; &nbsp; );
&nbsp; }

}</code></pre>
<p>Open and edit `src/app/book-edit/book-edit.component.html` then replace all codes with this.</p>
<pre><code>&lt;div class="container"&gt;
&nbsp; &lt;h1&gt;Edit Book&lt;/h1&gt;
&nbsp; &lt;div class="row"&gt;
&nbsp; &nbsp; &lt;div class="col-md-6"&gt;
&nbsp; &nbsp; &nbsp; &lt;form (ngSubmit)="updateBook(book._id)" #bookForm="ngForm"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;ISBN&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="text" class="form-control" [(ngModel)]="book.isbn" name="isbn" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;Title&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="text" class="form-control" [(ngModel)]="book.title" name="title" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;Author&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="text" class="form-control" [(ngModel)]="book.author" name="author" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;Published Year&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="number" class="form-control" [(ngModel)]="book.published_year" name="published_year" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;label for="name"&gt;Publisher&lt;/label&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;input type="text" class="form-control" [(ngModel)]="book.publisher" name="publisher" required&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;div class="form-group"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;button type="submit" class="btn btn-success" [disabled]="!bookForm.form.valid"&gt;Update&lt;/button&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/div&gt;
&nbsp; &nbsp; &nbsp; &lt;/form&gt;
&nbsp; &nbsp; &lt;/div&gt;
&nbsp; &lt;/div&gt;
&lt;/div&gt;</code></pre>
<h3><br>
<strong>11. Create Delete Function on Book-Detail Component</strong></h3>
<p>Open and edit `src/app/book-detail/book-detail`.component.ts then add `Router` module to `@angular/router`.</p>
<pre><code>import { ActivatedRoute, Router } from '@angular/router';</code></pre>
<p>Inject `Router` in the constructor params.</p>
<pre><code>constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }</code></pre>
<p>Add this function for delete book.</p>
<pre><code>deleteBook(id) {
&nbsp; this.http.delete('/book/'+id)
&nbsp; &nbsp; .subscribe(res =&gt; {
&nbsp; &nbsp; &nbsp; &nbsp; this.router.navigate(['/books']);
&nbsp; &nbsp; &nbsp; }, (err) =&gt; {
&nbsp; &nbsp; &nbsp; &nbsp; console.log(err);
&nbsp; &nbsp; &nbsp; }
&nbsp; &nbsp; );
}</code></pre>
<p>Add delete button in `src/app/book-detail/book-detail.component.html` on the right of Edit routerLink.</p>
<pre><code>&lt;div class="row"&gt;
&nbsp; &lt;div class="col-md-12"&gt;
&nbsp; &nbsp; &lt;a [routerLink]="['/book-edit', book._id]" class="btn btn-success"&gt;EDIT&lt;/a&gt;
&nbsp; &nbsp; &lt;button class="btn btn-danger" type="button" (click)="deleteBook(book._id)"&gt;DELETE&lt;/button&gt;
&nbsp; &lt;/div&gt;
&lt;/div&gt;</code></pre>
<h3><br>
<strong>12. Run and Test the MEAN Stack (Angular 5) CRUD Application</strong></h3>
<p>Now, it's a time for testing the MEAN Stack (Angular 5) CRUD Application.</p>
<pre><code>npm start</code></pre>
<p>And here we are.</p>
<p><img alt="MEAN Stack (Angular 5) CRUD Web Application Example - Full Result" src="https://s3-ap-southeast-1.amazonaws.com/djamblog/article-111117102226.png" style="border-style:solid; border-width:1px; height:1185px; width:500px"></p>
<p>If you need the full working source code, you can find it on our <a href="https://github.com/didinj/mean-stack-angular5-crud.git">GitHub</a>.</p>
<p>That just the basic. If you need more deep learning about MEAN Stack, Angular, and Node.js, you can find the following books:</p>
<ul>
<li><a href="http://www.anrdoezrs.net/click-8263647-12169838?url=https%3A%2F%2Fwww.apress.com%2Fus%2Fbook%2F9781484232781%3Futm_medium%3Daffiliate%26utm_source%3Dcommission_junction%26utm_campaign%3D3_nsn6445_product_PID%25zp%26utm_content%3Dus_10092017&amp;cjsku=9781484232798" target="_top">
Angular 4 Projects</a><img src="http://www.awltovhc.com/image-8263647-12169838" width="1" height="1" border="0"></li>
<li><a href="http://www.dpbolvw.net/click-8263647-12169838?url=https%3A%2F%2Fwww.apress.com%2Fus%2Fbook%2F9781484220436%3Futm_medium%3Daffiliate%26utm_source%3Dcommission_junction%26utm_campaign%3D3_nsn6445_product_PID%25zp%26utm_content%3Dus_10092017&amp;cjsku=9781484220443" target="_top">
Pro MEAN Stack Development</a><img src="http://www.ftjcfx.com/image-8263647-12169838" width="1" height="1" border="0"></li>
<li><a href="http://www.jdoqocy.com/click-8263647-12752006?url=https%3A%2F%2Fwww.apress.com%2Fde%2Fbook%2F9781430265955%3Futm_medium%3Daffiliate%26utm_source%3Dcommission_junction%26utm_campaign%3D3_nsn6445_product_PID%25zp%26utm_content%3Dde_10092017&amp;cjsku=9781430265962" target="_top">
Practical Node.js</a><img src="http://www.ftjcfx.com/image-8263647-12752006" width="1" height="1" border="0"></li>
<li><a href="http://www.kqzyfj.com/click-8263647-12169838?url=https%3A%2F%2Fwww.apress.com%2Fus%2Fbook%2F9781484200384%3Futm_medium%3Daffiliate%26utm_source%3Dcommission_junction%26utm_campaign%3D3_nsn6445_product_PID%25zp%26utm_content%3Dus_10092017&amp;cjsku=9781484200377" target="_top">
Pro Express.js</a><img src="http://www.ftjcfx.com/image-8263647-12169838" width="1" height="1" border="0"></li>
</ul>
<p>For more detailed on MEAN stack and Node.js, you can take the following course:</p>
<ul>
<li><a href="https://click.linksynergy.com/link?id=6nYo96*QrJE&amp;offerid=358574.833442&amp;type=2&amp;murl=https%3A%2F%2Fwww.udemy.com%2Fangular-2-and-nodejs-the-practical-guide%2F">Angular (Angular 2+) &amp; NodeJS - The MEAN Stack Guide</a><img src="https://ad.linksynergy.com/fs-bin/show?id=6nYo96*QrJE&amp;bids=358574.833442&amp;type=2&amp;subid=0" style="height:1px; width:1px"></li>
<li><a href="https://click.linksynergy.com/link?id=6nYo96*QrJE&amp;offerid=358574.150396&amp;type=2&amp;murl=https%3A%2F%2Fwww.udemy.com%2Fthe-ultimate-guide-to-nodejs-express%2F">Start Building Web Apps And Services With Node. js + Express</a><img src="https://ad.linksynergy.com/fs-bin/show?id=6nYo96*QrJE&amp;bids=358574.150396&amp;type=2&amp;subid=0" style="height:1px; width:1px"></li>
<li><a href="https://click.linksynergy.com/link?id=6nYo96*QrJE&amp;offerid=358574.654736&amp;type=2&amp;murl=https%3A%2F%2Fwww.udemy.com%2Fnodejs-api%2F">Build a REST API with node. js, ExpressJS, and MongoDB</a><img src="https://ad.linksynergy.com/fs-bin/show?id=6nYo96*QrJE&amp;bids=358574.654736&amp;type=2&amp;subid=0" style="height:1px; width:1px"></li>
</ul>
<p>Thanks!</p></div>
</div>
</div>