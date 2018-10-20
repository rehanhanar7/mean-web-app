https://scotch.io/tutorials/getting-started-with-node-express-and-postgres-using-sequelize#toc-creating-todos


<div class="article-inner">
<p><strong>Update (January 03, 2017)</strong>: This post has been updated to fix an oversight when querying the database for todo-items to either update or delete in <code>server/controllers/todoitems.js</code>. Formerly, we were only using the particular todoitem's <code>id</code>, instead of both it's own <code>id</code> and the <code>id</code> of it's parent todo. In the comments, some avid readers have pointed out the err in that logic and this update aims to fix that.</p><div class="table-of-contents"><ul><li><a href="#toc-before-we-begin-">
Before we begin...
</a></li><li><a href="#toc-project-setup">
Project Setup
</a></li><li><a href="#toc-express-setup">
Express Setup
</a></li><li><a href="#toc-sequelize-setup">
Sequelize Setup
</a></li><li><a href="#toc-generating-models">
Generating Models
</a></li><li><a href="#toc-creating-controllers-and-routing">
Creating Controllers and Routing
</a></li><li><a href="#toc-creating-todos">
Creating Todos
</a></li><li><a href="#toc-listing-todos">
Listing todos
</a></li><li><a href="#toc-creating-todo-items">
Creating todo Items
</a></li><li><a href="#toc-listing-todo-items-inside-todos">
Listing todo-items inside todos
</a></li><li><a href="#toc-retrieving-a-single-todo">
Retrieving a single todo
</a></li><li><a href="#toc-updating-a-single-todo">
Updating a single todo
</a></li><li><a href="#toc-deleting-todos">
Deleting todos
</a></li><li><a href="#toc-updating-and-deleting-todo-items">
Updating and Deleting Todo Items
</a></li></ul></div>
<p>I remember when I, a few months ago, needed to learn how to write JavaScript web applications using Express, NodeJS and PostgreSQL as my database. It wasn't an easy journey as I could not find any decent beginner materials on this topic.</p>
<p>I ended up settling on <a href="http://mherman.org/blog/2015/10/22/node-postgres-sequelize/">Michael Herman's blog post</a> on this topic and <a href="http://docs.sequelizejs.com/en/latest/">Sequelize docs.</a></p>
<p>So, I've decided to write a blog post about getting started with these technologies. Pretty much like Michael Herman's, in that we're going to be using PostgreSQL and Sequelize as the ORM of choice to write a minimalistic Todo list application.</p>

<div class="is-hidden-with-subscription has-text-centered">
<div id="bsa-zone_1537909991-8_123456" data-google-query-id="CPD294fkld4CFVqajgod4UQGfg" style=""><div id="google_ads_iframe_/8691100/Scotchio_S2S_InContent_FirstPos_BTF_0__container__" style="border: 0pt none; display: inline-block; width: 336px; height: 280px;"><iframe frameborder="0" src="https://tpc.googlesyndication.com/safeframe/1-0-30/html/container.html" id="google_ads_iframe_/8691100/Scotchio_S2S_InContent_FirstPos_BTF_0" title="3rd party ad content" name="" scrolling="no" marginwidth="0" marginheight="0" width="336" height="280" data-is-safeframe="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" style="border: 0px; vertical-align: bottom;" data-load-complete="true"></iframe></div></div>
</div>
<p>By the end of this tutorial, we will have created an API for a todo list application that will enable us to create multiple todos, add list items to those todos, update the list items and delete them. By working through an application in which we implement functionality to add things, update and delete them from a database, this tutorial will serve as an introduction to writing more advanced CRUD applications.</p>
<h2 id="toc-before-we-begin-">
<a href="#toc-before-we-begin-">Before we begin...</a>
</h2>
<p>Let's take a moment to review the tools we're going to be using:</p>
<ul>
<li><a href="https://nodejs.org/en/">NodeJS</a> - We're going to use this to run JavaScript code on the server. I've decided to use the latest version of Node, v6.3.0 at the time of writing, so that we'll have access to most of the new features introduced in ES6.</li>
<li><a href="https://expressjs.com/">Express</a> - As per their website, Express is a "Fast, unopinionated, minimalist web framework for Node.js", that we're going to be building our Todo list application on.</li>
<li><a href="https://www.postgresql.org/docs/9.5/static/index.html">PostgreSQL</a> - This is a powerful open-source database that we're going to use to store our Todos. Unfortunately, <a href="https://www.postgresql.org/download/">details on how to install and configure PostgreSQL on your particular system fall beyond the scope of this tutorial</a>. However, if you face issues while installing PostgreSQL, or you don't want to dive into installing it, you can opt for a version of PostgreSQL hosted online. I recommend <a href="https://www.elephantsql.com/">ElephantSQL</a>. I found it's pretty easy to get started with. However, the free version will only give you a 20MB allowance. Taking into consideration the pretty small size of the application we're building, this should be more than enough.</li>
<li><a href="http://docs.sequelizejs.com/en/latest/">Sequelize</a> - In addition, we're going to use Sequelize, which is a database <a href="https://en.wikipedia.org/wiki/Object-relational_mapping">ORM</a> that will interface with the Postgres database for us.</li>
<li><a href="https://www.getpostman.com/docs/introduction">Postman</a> - A Chrome app that we'll use to practically test our API.</li>
</ul>
<p>This tutorial assumes at least some prior knowledge of the JavaScript language. In addition, we're going to be leveraging some of the latest JavaScript features and it's recommended that you go through these tutorials from <a href="https://scotch.io/">scotch.io</a> ( <a href="https://scotch.io/tutorials/better-node-with-es6-pt-i">Part I</a>, <a href="https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes">Part II</a>, <a href="https://scotch.io/tutorials/better-javascript-with-es6-pt-iii-cool-collections-slicker-strings">Part III</a>) to familiarize yourself with the new ES6 syntax. We're also assuming that you're at least comfortable working on the command line (creating folders, files, changing directories, e.t.c).</p>
<p>Code blocks will look like this:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">helloWorld</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`Hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">, and welcome to the world of computing!`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Hello world!'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>
<p>while shell commands will look like this:</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token keyword">echo</span> <span class="token string">"This is awesome!"</span></code></pre>
<p>When you encounter shell commands, what you'll be expected to type in will be everything except the leading <code>$</code>. This leading <code>$</code> is called a <a href="https://en.wikibooks.org/wiki/Guide_to_Unix/Explanations/Shell_Prompt">shell prompt</a>, and may be different depending on the terminal you're working in.</p>
<p>When you encounter any piece of code wrapped with ellipses (<code>...</code>), it means that's a code snippet which should be taken into context with the surrounding code in that file. This is used to save on space and reduce redundancy.</p>
<p>Alright, let's get to it! :)</p>
<h2 id="toc-project-setup">
<a href="#toc-project-setup">Project Setup</a>
</h2>
<p>Let's begin by setting up our workspace. While we could use express-generator to scaffold the project structure for us, we're going to be creating one from scratch. Run the following commands.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">mkdir</span> -p postgres-express-react-node-tutorial/<span class="token punctuation">{</span>bin,server<span class="token punctuation">}</span>
$ <span class="token function">cd</span> postgres-express-react-node-tutorial</code></pre>
<p>We're leveraging shell expansion to create three directories, a top level <code>postgres-express-react-node-tutorial</code> directory containing <code>bin</code> and <code>server</code>. All of the code necessary to create our server-side application will go into the <code>server</code> folder.</p>
<p>All subsequent commands will assume that you're in the top-level <code>postgres-express-react-node-tutorial</code> folder.</p>

<div class="is-hidden-with-subscription has-text-centered">
<div id="bsa-zone_1537909991-9_123456" data-google-query-id="COX694fkld4CFQTtjgodk4IAtQ" style=""><div id="google_ads_iframe_/8691100/Scotchio_S2S_InContent_SecondPos_BTF_0__container__" style="border: 0pt none;"><iframe id="google_ads_iframe_/8691100/Scotchio_S2S_InContent_SecondPos_BTF_0" title="3rd party ad content" name="google_ads_iframe_/8691100/Scotchio_S2S_InContent_SecondPos_BTF_0" width="336" height="280" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" srcdoc="" style="border: 0px; vertical-align: bottom;" data-load-complete="true"></iframe></div></div>
</div>
<p>That done, we're going to initialize a NodeJS application, with the help of <code>npm</code>, which should have come bundled with your NodeJS install. Run:</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">npm</span> init -y</code></pre>
<p>This will create a <code>package.json</code> file with some sensible default config. Omit the <code>-y</code> if you want more control over this config. Your project structure should now look like:</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">postgres-express-react-node-tutorial
├── bin
├── package.json
└── server</code></pre>
<h2 id="toc-express-setup">
<a href="#toc-express-setup">Express Setup</a>
</h2>
<p>Install Express and a few of it's dependencies.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">npm</span> <span class="token function">install</span> --save express body-parser morgan</code></pre>
<p>The <code>--save</code> flag will save these packages to the <code>dependencies</code> section of your <code>package.json</code> file. You could save some typing by running the above command as</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">npm</span> i -S express body-parser morgan</code></pre>
<p><code>i</code> is an alias for <code>install</code> while <code>-S</code> is an alias for <code>--save</code>.</p>
<p>Create a file in the root folder and call it <code>app.js</code>.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">touch</span> app.js</code></pre>
<p>In this file, let's create our Express application.</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'express'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> logger <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'morgan'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> bodyParser <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'body-parser'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Set up the express app</span>
<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Log requests to the console.</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token function">logger</span><span class="token punctuation">(</span><span class="token string">'dev'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Parse incoming requests data (https://github.com/expressjs/body-parser)</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>bodyParser<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>bodyParser<span class="token punctuation">.</span><span class="token function">urlencoded</span><span class="token punctuation">(</span><span class="token punctuation">{</span> extended<span class="token punctuation">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Setup a default catch-all route that sends back a welcome message in JSON format.</span>
app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'*'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  message<span class="token punctuation">:</span> <span class="token string">'Welcome to the beginning of nothingness.'</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> app<span class="token punctuation">;</span></code></pre>
<p>Inside the <code>bin</code> folder, create a file and call it <code>www</code>.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">touch</span> bin/www</code></pre>
<p>Put the following code inside <code>bin/www</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token comment">// This will be our application entry. We'll setup our server here.</span>
<span class="token keyword">const</span> http <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'http'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'../app'</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// The express app we just created</span>

<span class="token keyword">const</span> port <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">PORT</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token number">8000</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token keyword">set</span><span class="token punctuation">(</span><span class="token string">'port'</span><span class="token punctuation">,</span> port<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> server <span class="token operator">=</span> http<span class="token punctuation">.</span><span class="token function">createServer</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span><span class="token punctuation">;</span>
server<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span>port<span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>
<p>With that in place, we'll need a way to restart the server every time we change something in our code. For that, we'll use the excellent <code>nodemon</code> npm package.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">npm</span> i -D nodemon</code></pre>
<p>Then, open up your <code>package.json</code> file and create a command to run the server. That command will be created under the <code>scripts</code> section. Edit your <code>package.json</code> in the <code>scripts</code> section as follows:</p>
<pre class="language-json" data-title="json"><code class="language-json">...
<span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">"start:dev"</span><span class="token operator">:</span> <span class="token string">"nodemon ./bin/www"</span><span class="token punctuation">,</span>
  <span class="token property">"test"</span><span class="token operator">:</span> <span class="token string">"echo \"Error: no test specified\" &amp;&amp; exit 1"</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
...</code></pre>
<p>Now try running the application by executing</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">npm</span> run start:dev</code></pre>
<p>and visiting <code>http://localhost:8000</code>. You should see <code>{"message":"Welcome to the beginning of nothingness."}</code></p>
<p>At this point in time, your project structure should look like:</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">postgres-express-react-node-tutorial
├── app.js
├── bin
│   └── www
├── package.json
└── server</code></pre>
<p>For comparison, you can find the code for this section <a href="https://github.com/andela-jmuturi/postgres-express-node-tutorial/tree/express-setup">here</a>.</p>
<h2 id="toc-sequelize-setup">
<a href="#toc-sequelize-setup">Sequelize Setup</a>
</h2>
<p>For this part, we are going to require a working PostgreSQL installation. There are lots of resources on the web on how to install and configure Postgres, so I will not concentrate on that.</p>
<p>Next, we are going to require <a href="http://docs.sequelizejs.com/en/latest/">Sequelize</a>. This is an <a href="https://en.wikipedia.org/wiki/Object-relational_mapping">ORM</a> that will interface with the Postgres database for us. Feel free to go through <a href="http://docs.sequelizejs.com/en/latest/">it's documentation</a> to get a feel of it. We are going to be making use of the <a href="https://github.com/sequelize/cli">Sequelize CLI</a> package to bootstrap the project for us. It will also help us generate <a href="https://en.wikipedia.org/wiki/Schema_migration">database migrations</a>.</p>
<p>Let's begin by installing Sequelize CLI package.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">npm</span> <span class="token function">install</span> -g sequelize-cli</code></pre>
<p>You can install the <code>sequelize-cli</code> package in your project locally by using <code>-D</code> (equivalent to using <code>--save-dev</code>) instead of the <code>-g</code> (<code>--global</code>) flag. The downside of doing this will be that you'll need to prefix every call to the <code>sequelize</code> command with <code>./node_modules/.bin</code>.</p>
<p>Next, we need to configure Sequelize for our project. For that, we will create a <code>.sequelizerc</code> file in our project's root folder. In this file, we are going to be specifying the paths to files required by Sequelize. Put the following content into this file:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'path'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token string">"config"</span><span class="token punctuation">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">'./server/config'</span><span class="token punctuation">,</span> <span class="token string">'config.json'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token string">"models-path"</span><span class="token punctuation">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">'./server/models'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token string">"seeders-path"</span><span class="token punctuation">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">'./server/seeders'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token string">"migrations-path"</span><span class="token punctuation">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">'./server/migrations'</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>The <code>config.json</code> file contain our application configuration settings, such as database authentication configuration. <code>migrations</code> folder will hold our application's migrations, while the <code>models</code> folder will hold the application models. Seed data is initial data provided with a system for testing, training or templating purposes. The <code>seeders</code> folder typically holds seed data, but we're not going to be using that in this tutorial.</p>
<p>At this point, we are going to need to install the actual Sequelize package, alongside its dependencies.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">npm</span> <span class="token function">install</span> --save sequelize pg pg-hstore</code></pre>
<p><code>pg</code> will be responsible for creating the database connection while <code>pg-hstore</code> is a module for serializing and deserializing JSON data into the Postgres hstore format.</p>
<p>Now, with the paths defined, we will need to run the <code>init</code> command in order to create the specified folders and generate boilerplate code.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ sequelize init</code></pre>
<p>If you inspect your directory right now, you will realize that the above command just created the directories and generated the boilerplate code. Your directory structure should now look like this.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">postgres-express-react-node-tutorial
├── app.js
├── bin
│   └── www
├── package.json
└── server
    ├── config
    │   └── config.json
    ├── migrations
    ├── models
    │   └── index.js
    └── seeders</code></pre>
<p>Let's consider, for example, the <code>server/models/index.js</code> file that was autogenerated.</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token string">'use strict'</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> fs        <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'fs'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> path      <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'path'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> Sequelize <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'sequelize'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> basename  <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">basename</span><span class="token punctuation">(</span>module<span class="token punctuation">.</span>filename<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> env       <span class="token operator">=</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">||</span> <span class="token string">'development'</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> config    <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span>__dirname <span class="token operator">+</span> <span class="token string">'/../config/config.json'</span><span class="token punctuation">)</span><span class="token punctuation">[</span>env<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> db        <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span>config<span class="token punctuation">.</span>use_env_variable<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> sequelize <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Sequelize</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">[</span>config<span class="token punctuation">.</span>use_env_variable<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> sequelize <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Sequelize</span><span class="token punctuation">(</span>config<span class="token punctuation">.</span>database<span class="token punctuation">,</span> config<span class="token punctuation">.</span>username<span class="token punctuation">,</span> config<span class="token punctuation">.</span>password<span class="token punctuation">,</span> config<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

fs
  <span class="token punctuation">.</span><span class="token function">readdirSync</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">'.'</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>file <span class="token operator">!==</span> basename<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">3</span><span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">'.js'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> model <span class="token operator">=</span> sequelize<span class="token punctuation">[</span><span class="token string">'import'</span><span class="token punctuation">]</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> file<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    db<span class="token punctuation">[</span>model<span class="token punctuation">.</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> model<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>db<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>modelName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>db<span class="token punctuation">[</span>modelName<span class="token punctuation">]</span><span class="token punctuation">.</span>associate<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    db<span class="token punctuation">[</span>modelName<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">associate</span><span class="token punctuation">(</span>db<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

db<span class="token punctuation">.</span>sequelize <span class="token operator">=</span> sequelize<span class="token punctuation">;</span>
db<span class="token punctuation">.</span>Sequelize <span class="token operator">=</span> Sequelize<span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> db<span class="token punctuation">;</span></code></pre>
<p>In this file, we are requiring the modules we're going to be using. Then, we're reading the configuration specific to our current Node environment. If we don't have a Node environment defined, we're defaulting to <code>development</code>. Then, we are establishing a connection with our database, after which we read our models folder, discovering and importing any and all the models in it, adding them to the db object and applying relationships between the models, if such relationships exist.</p>
<h3 id="toc-refactoring-server-models-index-js">Refactoring <code>server/models/index.js</code></h3>
<p>Since the generated <code>server/models/index.js</code> file is in ES5 syntax, we are going to refactor it to ES6 syntax. If you are not familiar with ES6 syntax, you can learn more about it from this awesome Scotch.io tutorial series: <a href="https://scotch.io/tutorials/better-node-with-es6-pt-i">Part I</a>, <a href="https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes">Part II</a>, <a href="https://scotch.io/tutorials/better-javascript-with-es6-pt-iii-cool-collections-slicker-strings">Part III</a>.</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> fs <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'fs'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'path'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> Sequelize <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'sequelize'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> basename <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">basename</span><span class="token punctuation">(</span>module<span class="token punctuation">.</span>filename<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> env <span class="token operator">=</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">NODE_ENV</span> <span class="token operator">||</span> <span class="token string">'development'</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> config <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token template-string"><span class="token string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>__dirname<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/../config/config.json`</span></span><span class="token punctuation">)</span><span class="token punctuation">[</span>env<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> db <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> sequelize<span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>config<span class="token punctuation">.</span>use_env_variable<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  sequelize <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Sequelize</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">[</span>config<span class="token punctuation">.</span>use_env_variable<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
  sequelize <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Sequelize</span><span class="token punctuation">(</span>
    config<span class="token punctuation">.</span>database<span class="token punctuation">,</span> config<span class="token punctuation">.</span>username<span class="token punctuation">,</span> config<span class="token punctuation">.</span>password<span class="token punctuation">,</span> config
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

fs
  <span class="token punctuation">.</span><span class="token function">readdirSync</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>file <span class="token operator">=&gt;</span>
    <span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">'.'</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
    <span class="token punctuation">(</span>file <span class="token operator">!==</span> basename<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
    <span class="token punctuation">(</span>file<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">3</span><span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">'.js'</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>file <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> model <span class="token operator">=</span> sequelize<span class="token punctuation">.</span><span class="token keyword">import</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> file<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    db<span class="token punctuation">[</span>model<span class="token punctuation">.</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> model<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>db<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>modelName <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>db<span class="token punctuation">[</span>modelName<span class="token punctuation">]</span><span class="token punctuation">.</span>associate<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    db<span class="token punctuation">[</span>modelName<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">associate</span><span class="token punctuation">(</span>db<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

db<span class="token punctuation">.</span>sequelize <span class="token operator">=</span> sequelize<span class="token punctuation">;</span>
db<span class="token punctuation">.</span>Sequelize <span class="token operator">=</span> Sequelize<span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> db<span class="token punctuation">;</span></code></pre>
<p>With the application bootstrapped, the only thing that we still have to do is creating our database then updating the <code>config.json</code> file to reflect our various environments settings.</p>
<p>First, we need to create a development database.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ createdb todos-dev</code></pre>
<p><code>createdb</code> command will be available to us after installing PostgreSQL.</p>
<h3 id="toc-a-quick-note">A Quick Note</h3>
<p>If we opted to use a Postgres database hosted online, we will need the database url provided to us by the database host we chose. Assuming we're using ElephantSQL, we'll need to go to the <a href="https://customer.elephantsql.com/instance">ElephantSQL dashboard</a> and click on <code>details</code> to view the details of our free database instance. We then copy the <code>URL</code> provided in the details. We are going to need this URL in the configuration below.</p>
<p>Then, we need to update our config to use the db we just created.</p>
<p>If we're using a local database, we replace <code>username</code> with our username and <code>password</code> with our database's password. In my case, notice I didn't create any password for my db, so I'm just going to leave that field <code>null</code>. Remember to change the <code>dialect</code> to <code>postgres</code>.</p>
<pre class="language-json" data-title="json"><code class="language-json"><span class="token punctuation">{</span>
  <span class="token property">"development"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"username"</span><span class="token operator">:</span> <span class="token string">"waiyaki"</span><span class="token punctuation">,</span>
    <span class="token property">"password"</span><span class="token operator">:</span> <span class="token null">null</span><span class="token punctuation">,</span>
    <span class="token property">"database"</span><span class="token operator">:</span> <span class="token string">"todos-dev"</span><span class="token punctuation">,</span>
    <span class="token property">"host"</span><span class="token operator">:</span> <span class="token string">"127.0.0.1"</span><span class="token punctuation">,</span>
    <span class="token property">"port"</span><span class="token operator">:</span> <span class="token number">5432</span><span class="token punctuation">,</span>
    <span class="token property">"dialect"</span><span class="token operator">:</span> <span class="token string">"postgres"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"test"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"username"</span><span class="token operator">:</span> <span class="token string">"waiyaki"</span><span class="token punctuation">,</span>
    <span class="token property">"password"</span><span class="token operator">:</span> <span class="token null">null</span><span class="token punctuation">,</span>
    <span class="token property">"database"</span><span class="token operator">:</span> <span class="token string">"todos-test"</span><span class="token punctuation">,</span>
    <span class="token property">"host"</span><span class="token operator">:</span> <span class="token string">"127.0.0.1"</span><span class="token punctuation">,</span>
    <span class="token property">"port"</span><span class="token operator">:</span> <span class="token number">5432</span><span class="token punctuation">,</span>
    <span class="token property">"dialect"</span><span class="token operator">:</span> <span class="token string">"postgres"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>
<p>If we're using an online database, we will need to replace the <code>development</code> environment database configuration settings with our database URL. Since we're only concerned about the <code>development</code> environment because it's all we're going to use, that's what we'll replace. We are going to be exporting the URL we copied earlier into our <code>development</code> environment as <code>DATABASE_URL</code>. Our config will now look like:</p>
<pre class="language-json" data-title="json"><code class="language-json"><span class="token punctuation">{</span>
  <span class="token property">"development"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"use_env_variable"</span><span class="token operator">:</span> <span class="token string">"DATABASE_URL"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"test"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"username"</span><span class="token operator">:</span> <span class="token string">"waiyaki"</span><span class="token punctuation">,</span>
    <span class="token property">"password"</span><span class="token operator">:</span> <span class="token null">null</span><span class="token punctuation">,</span>
    <span class="token property">"database"</span><span class="token operator">:</span> <span class="token string">"todos-test"</span><span class="token punctuation">,</span>
    <span class="token property">"host"</span><span class="token operator">:</span> <span class="token string">"127.0.0.1"</span><span class="token punctuation">,</span>
    <span class="token property">"port"</span><span class="token operator">:</span> <span class="token number">5432</span><span class="token punctuation">,</span>
    <span class="token property">"dialect"</span><span class="token operator">:</span> <span class="token string">"postgres"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>
<p>This signals Sequelize to look inside our environment and extract the key whose name is <code>DATABASE_URL</code> and use that to connect to our DB. The specific logic that does that is in <code>server/models/index.js</code>, as shown in this snippet:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token keyword">let</span> sequelize<span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>config<span class="token punctuation">.</span>use_env_variable<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// From the environment, extract the key with the name provided in the config as use_env_variable</span>
  <span class="token comment">// and use that to establish a connection to our database.</span>
  sequelize <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Sequelize</span><span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">[</span>config<span class="token punctuation">.</span>use_env_variable<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
  sequelize <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Sequelize</span><span class="token punctuation">(</span>
    config<span class="token punctuation">.</span>database<span class="token punctuation">,</span> config<span class="token punctuation">.</span>username<span class="token punctuation">,</span> config<span class="token punctuation">.</span>password<span class="token punctuation">,</span> config
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token operator">...</span></code></pre>
<p>Finally, we'll need to actually export our database URL into our environment. In our terminal, let's issue the following command:</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ <span class="token function">export</span> DATABASE_URL<span class="token operator">=</span>our-database-url</code></pre>
<p>where <code>our-database-url</code> is the URL we copied from ElephantSQL. Every time we need to run this application, we will need to export the <code>DATABASE_URL</code> first. Fortunately, there exists <a href="https://www.npmjs.com/package/dotenv">dotenv</a>, an npm package that makes automatically exporting values into our app environment a breeze. It reads key-value pairs stored in a config file, typically named <code>.env</code> and exports them into our environment. We won't use it in this application but I recommend you check it out.</p>
<p>We are not actually going to use the <code>test</code> environment in this tutorial. However, I'm including it here for didactic purposes to show that we can have different databases for different environments, which is what we'd actually want in a real-world application.</p>
<p>For purposes of comparison, you can find the code to this section <a href="https://github.com/andela-jmuturi/postgres-express-node-tutorial/tree/sequelize-setup">here</a>.</p>
<h2 id="toc-generating-models">
 <a href="#toc-generating-models">Generating Models</a>
</h2>
<p>With our configuration in place, we are now ready to generate models. We are going to have two models, <code>Todo</code> and <code>TodoItem</code>. The relationship between a <code>Todo</code> and it's <code>TodoItems</code> is going to be one-to-many, such that a <code>Todo</code> can have many <code>TodoItems</code> while a <code>TodoItem</code> can only belong to one <code>Todo</code>.</p>
<p>Run the following command.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ sequelize model:create --name Todo --attributes title:string</code></pre>
<p>This will generate a <code>todo.js</code> file in the <code>server/models</code> folder as well as a <code>&lt;date&gt;-create-todo.js</code> migration file in the <code>server/migrations</code> folder. <code>&lt;date&gt;</code> will be the date the model was generated.</p>
<p>The generated Todo model code is:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token string">'use strict'</span><span class="token punctuation">;</span>
module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span>sequelize<span class="token punctuation">,</span> DataTypes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> Todo <span class="token operator">=</span> sequelize<span class="token punctuation">.</span><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">'Todo'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    title<span class="token punctuation">:</span> DataTypes<span class="token punctuation">.</span><span class="token constant">STRING</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    classMethods<span class="token punctuation">:</span> <span class="token punctuation">{</span>
      associate<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span>models<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// associations can be defined here</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> Todo<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>In this file, we are defining our <code>Todo</code> model. It's going to have a single attribute, <code>title</code>, that is a String.</p>
<p>If you inspect the two generated files, you'll realize that they are in ES5. We're going to refactor them into ES6, for consistency with the rest of our project. Before we do that, let's generate our TodoItem model.</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ sequelize model:create --name TodoItem --attributes content:string,complete:boolean</code></pre>
<p>In addition to refactoring, we're going to be editing the generated model fields a little bit to better suit our needs. We are also going to be defining the relationships between our models. In previous Sequelize (before v4) versions, these relationships would be created in the <code>classMethods</code> section of the options in the model code. We are going to refactor this to use the v4 way of creating relationships.</p>
<p>After refactoring, editing the model fields and defining the relationships between our models, we arrive at:</p>
<p><code>server/models/todo.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token punctuation">(</span>sequelize<span class="token punctuation">,</span> DataTypes<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> Todo <span class="token operator">=</span> sequelize<span class="token punctuation">.</span><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">'Todo'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    title<span class="token punctuation">:</span> <span class="token punctuation">{</span>
      type<span class="token punctuation">:</span> DataTypes<span class="token punctuation">.</span><span class="token constant">STRING</span><span class="token punctuation">,</span>
      allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  Todo<span class="token punctuation">.</span><span class="token function-variable function">associate</span> <span class="token operator">=</span> <span class="token punctuation">(</span>models<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    Todo<span class="token punctuation">.</span><span class="token function">hasMany</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>TodoItem<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      foreignKey<span class="token punctuation">:</span> <span class="token string">'todoId'</span><span class="token punctuation">,</span>
      <span class="token keyword">as</span><span class="token punctuation">:</span> <span class="token string">'todoItems'</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> Todo<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>Notice that we edited the <code>title</code> field and added a not-null constraint. This means that the database will not allow us to write to it if we don't provide a value for the <code>title</code> field. We also defined the relationship between a <code>Todo</code> and it's <code>TodoItems</code> in the <code>Todo.associate</code> class method. The <code>as: 'todoItems'</code> means that every time we query for a todo and include it's todo items, they'll be included under the key <code>todoItems</code> instead of <code>TodoItems</code> (Sequelize defaults to using the pluralized model name). We're going to see how to make that inclusion a little later. Personally, I think it looks better this way.</p>
<p><code>server/models/todoitem.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token punctuation">(</span>sequelize<span class="token punctuation">,</span> DataTypes<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> TodoItem <span class="token operator">=</span> sequelize<span class="token punctuation">.</span><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">'TodoItem'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    content<span class="token punctuation">:</span> <span class="token punctuation">{</span>
      type<span class="token punctuation">:</span> DataTypes<span class="token punctuation">.</span><span class="token constant">STRING</span><span class="token punctuation">,</span>
      allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    complete<span class="token punctuation">:</span> <span class="token punctuation">{</span>
      type<span class="token punctuation">:</span> DataTypes<span class="token punctuation">.</span><span class="token constant">BOOLEAN</span><span class="token punctuation">,</span>
      defaultValue<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  TodoItem<span class="token punctuation">.</span><span class="token function-variable function">associate</span> <span class="token operator">=</span> <span class="token punctuation">(</span>models<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    TodoItem<span class="token punctuation">.</span><span class="token function">belongsTo</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>Todo<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      foreignKey<span class="token punctuation">:</span> <span class="token string">'todoId'</span><span class="token punctuation">,</span>
      onDelete<span class="token punctuation">:</span> <span class="token string">'CASCADE'</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> TodoItem<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>Notice that we've edited both the <code>content</code> and <code>complete</code> fields. We've added a not-null constraint in the <code>content</code> field and a <code>default</code> value for the <code>complete</code> field. In general, having a default value means that if we don't provide a value for that field when creating it, the database is going to use the provided default value for that field. In addition to that, we've also defined the relationship between the <code>TodoItems</code> and the <code>Todo</code> objects. The <code>onDelete: CASCADE</code> tells Postgres that if we delete a todo, it's associated todo items should be deleted as well (cascade the delete action).</p>
<p>For consistency, we're also refactoring our migration files to ES6 and ending up with:</p>
<p><code>server/migrations/&lt;date&gt;-create-todo.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  up<span class="token punctuation">:</span> <span class="token punctuation">(</span>queryInterface<span class="token punctuation">,</span> Sequelize<span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    queryInterface<span class="token punctuation">.</span><span class="token function">createTable</span><span class="token punctuation">(</span><span class="token string">'Todos'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      id<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        autoIncrement<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        primaryKey<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">INTEGER</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      title<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">STRING</span><span class="token punctuation">,</span>
        allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      createdAt<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">DATE</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      updatedAt<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">DATE</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  down<span class="token punctuation">:</span> <span class="token punctuation">(</span>queryInterface <span class="token comment">/* , Sequelize */</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> queryInterface<span class="token punctuation">.</span><span class="token function">dropTable</span><span class="token punctuation">(</span><span class="token string">'Todos'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p><code>server/migrations/&lt;date&gt;-create-todo-item.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  up<span class="token punctuation">:</span> <span class="token punctuation">(</span>queryInterface<span class="token punctuation">,</span> Sequelize<span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    queryInterface<span class="token punctuation">.</span><span class="token function">createTable</span><span class="token punctuation">(</span><span class="token string">'TodoItems'</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      id<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        autoIncrement<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        primaryKey<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">INTEGER</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      content<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">STRING</span><span class="token punctuation">,</span>
        allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      complete<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">BOOLEAN</span><span class="token punctuation">,</span>
        defaultValue<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      createdAt<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">DATE</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      updatedAt<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        allowNull<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">DATE</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      todoId<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        type<span class="token punctuation">:</span> Sequelize<span class="token punctuation">.</span><span class="token constant">INTEGER</span><span class="token punctuation">,</span>
        onDelete<span class="token punctuation">:</span> <span class="token string">'CASCADE'</span><span class="token punctuation">,</span>
        references<span class="token punctuation">:</span> <span class="token punctuation">{</span>
          model<span class="token punctuation">:</span> <span class="token string">'Todos'</span><span class="token punctuation">,</span>
          key<span class="token punctuation">:</span> <span class="token string">'id'</span><span class="token punctuation">,</span>
          <span class="token keyword">as</span><span class="token punctuation">:</span> <span class="token string">'todoId'</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  down<span class="token punctuation">:</span> <span class="token punctuation">(</span>queryInterface <span class="token comment">/* , Sequelize */</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    queryInterface<span class="token punctuation">.</span><span class="token function">dropTable</span><span class="token punctuation">(</span><span class="token string">'TodoItems'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>When we run these migrations, the <code>up</code> function will be executed. It will take care of creating the table and it's associated columns for us. If, for whatever reason, we needed to rollback (undo) the migration, the <code>down</code> function would be executed and it would undo whatever the <code>up</code> function did, thus returning the our database to the same state it was in before we performed the migration.</p>
<p>These migrations are a representation of how we want our models to look like in the database. Notice we define the relationship between our models in the <code>create-todo-item.js</code> migration file as well. The <code>todoId</code> field was not automatically generated and we've had to manually define it. Sequelize automatically generates the <code>id</code>, <code>createdAt</code> and <code>updatedAt</code> fields for you. In addition to that, any time a model is saved, the <code>updatedAt</code> field is automatically updated to reflect the new update time.</p>
<p>With the models and migrations in place, we're now ready to persist the models to the database by running the migrations. To do this, we run the following command:</p>
<pre class="language-bash" data-title="bash"><code class="language-bash">$ sequelize db:migrate</code></pre>
<p>This will discover the migrations in our migrations folder and execute them. If you try running the same command again, it would not execute any migrations since it's clever enough to know that all of the current migrations have been executed.</p>
<p>For purposes of comparison, you can find the code to this section <a href="https://github.com/andela-jmuturi/postgres-express-node-tutorial/tree/generating-models">here</a>.</p>
<h2 id="toc-creating-controllers-and-routing">
<a href="#toc-creating-controllers-and-routing">Creating Controllers and Routing</a>
</h2>
<p>With our models in place, let's move on to creating the controllers. We're going to have two controllers, <code>todosController</code> and <code>todoItemsController</code>. The <code>todosController</code> will be responsible for creating, listing, updating and deleting todos, while the <code>todoItemsController</code> will be responsible for creating, updating and deleting todo items.</p>
<h2 id="toc-creating-todos">
<a href="#toc-creating-todos">Creating Todos</a>
</h2>
<p>Create a <code>todo.js</code> file inside <code>server/controllers/</code>. Inside this file, let's add the functionality to create todos.</p>
<p><code>server/controllers/todos.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> Todo <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'../models'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Todo<span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function">create</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Todo
      <span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        title<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>title<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todo <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">201</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>todo<span class="token punctuation">)</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>The above code snippet creates a new todo and if successful, it returns it. If it encounters an error, it returns that error instead. (<em>Granted, this isn't the best way to handle these errors, but we'll go with it for now, for the sake of simplicity.</em> ;))</p>
<p>This <code>create</code> function is designed to be a <a href="https://expressjs.com/en/guide/routing.html">route handler</a> for whichever Express route we'll choose to attach it to. The <code>req</code> parameter is the incoming request from the client. The <code>res</code> parameter is the response we're preparing to eventually send back to the client in <em>response</em> to their <em>request</em> :). All Express route handlers follow this method signature. We can have a third parameter, conventionally named <code>next</code>, which is a function that passes the request on to the next route handler (meaning that a route can be handled by multiple route handlers, in which case it's <em>piped</em> or passed along all of those route handlers). We are, however, not going to see a use case for that in this application :(.</p>
<p>Next, we create an <code>index.js</code> file inside <code>server/controllers</code>, where we're going to be exporting our controllers from. I find this helpful since it helps me consolidate my imports (require statements) from once central place.</p>
<p><code>server/controllers/index.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> todos <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'./todos'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  todos<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>Next, we need to add an API route that maps to this functionality. Create a <code>routes</code> folder inside the <code>server</code> folder. Inside the new <code>routes</code> folder, create an <code>index.js</code> file. We are going to place all our routes in this <code>index.js</code> file. However, in a real-world application, you might want to split up your routes and place then in different folders.</p>
<p>Inside <code>server/routes/index.js</code>, add the following code:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> todosController <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'../controllers'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>todos<span class="token punctuation">;</span>

module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token punctuation">(</span>app<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/api'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    message<span class="token punctuation">:</span> <span class="token string">'Welcome to the Todos API!'</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  app<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/api/todos'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>create<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>This will add two new routes, a welcome route at <code>/api</code> and a route to create todos at <code>/api/todos</code>. When we hit <code>/api</code>, we are instructing our application to send back a JSON object welcoming the user to our life-changing Todos API. If we post some data to <code>/api/todos</code>, we are telling our application to run the <code>todosController.create</code> function, which will take the request object, extract the posted data and create a todo from it. In this case, we say that the <code>todosController.create</code> function is the POST route handler for the <code>/api/todos</code> endpoint.</p>
<p>Next, we need to make the application aware that we just added the routes. Open up your <code>app.js</code>. We're going to be adding a <code>require</code> statement right before the route we'd earlier created, such that our <code>app.js</code> file now looks like:</p>
<p><code>app.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'express'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> logger <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'morgan'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> bodyParser <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'body-parser'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token function">logger</span><span class="token punctuation">(</span><span class="token string">'dev'</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>bodyParser<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>bodyParser<span class="token punctuation">.</span><span class="token function">urlencoded</span><span class="token punctuation">(</span><span class="token punctuation">{</span> extended<span class="token punctuation">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Require our routes into the application.</span>
<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'./server/routes'</span><span class="token punctuation">)</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'*'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  message<span class="token punctuation">:</span> <span class="token string">'Welcome to the beginning of nothingness.'</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> app<span class="token punctuation">;</span></code></pre>
<p>Note that we have to require our routes before the <code>app.get('*', ...)</code> catch-all route we'd added earlier. This is because the catch-all route will match any route and serve the welcome message, hence if we require our other routes after it, those other routes will never be hit.</p>
<p>Next, we open up Postman and issue a POST request to create a new todo item as in the image below.</p>
<p><img alt="First Todo" data-src="https://scotch-res.cloudinary.com/image/upload/dpr_1,w_650,q_auto:good,f_auto/media/3047/NLs3eamOQe6HcLf9XpXk_first-todo.png" class="loaded" src="https://scotch-res.cloudinary.com/image/upload/dpr_1,w_650,q_auto:good,f_auto/media/3047/NLs3eamOQe6HcLf9XpXk_first-todo.png" data-was-processed="true"></p>
<p>Yay!</p>
<p>If you make a GET request to <code>/api</code> using either Postman or your browser, you should see the welcome message we specified in our routes. If you visit any other route that we've not explicitly handled in our routes, you should still see the default *"Welcome to the beginning of nothingness."* message. Feel free to create a few more todos.</p>
<h2 id="toc-listing-todos">
<a href="#toc-listing-todos">Listing todos</a>
</h2>
<p>Next, we're going to add functionality to list all todos. Add the following code snippet to your <code>todosController</code> after the create method.</p>
<p><code>server/controllers/todos.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token function">list</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> Todo
    <span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todos <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token operator">...</span></code></pre>
<p>In this code snippet, we're fetching all todos from our database and sending them back to the user as an array in the response. If we encounter an error while fetching the todos from the database, we send that error object instead.</p>
<p>Next, open up <code>server/routes/index.js</code> and create a new url that maps a todos GET request to the list method right below the POST route we'd added earlier.</p>
<p><code>server/routes/index.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
app<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/api/todos'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>create<span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/api/todos'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>list<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">...</span></code></pre>
<p>Open up Postman and try out this new route.</p>
<p><img alt="List Todos" data-src="https://scotch-res.cloudinary.com/image/upload/dpr_1,w_650,q_auto:good,f_auto/media/3047/m0KLLJAsSXqDUEW4CZEK_list-todos.png" class="loaded" src="https://scotch-res.cloudinary.com/image/upload/dpr_1,w_650,q_auto:good,f_auto/media/3047/m0KLLJAsSXqDUEW4CZEK_list-todos.png" data-was-processed="true"></p>
<p>If you inspect the output, you'll realise that our listed <code>todos</code> do not have any <code>todoitems</code>. Let's add functionality to create <code>todoitems</code> next, after which we'll modify our list method to return todos together with their <code>todoitems</code>.</p>
<h2 id="toc-creating-todo-items">
<a href="#toc-creating-todo-items">Creating todo Items</a>
</h2>
<p>Create a <code>todoitems.js</code> file inside your <code>controllers</code> directory. In this file, let's add functionality to create a <code>todoitem</code>.</p>
<p><code>server/controllers/todoitems.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> TodoItem <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'../models'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>TodoItem<span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function">create</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> TodoItem
      <span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        content<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>content<span class="token punctuation">,</span>
        todoId<span class="token punctuation">:</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>todoId<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todoItem <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">201</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>todoItem<span class="token punctuation">)</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p><code>server/controllers/index.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> todos <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'./todos'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> todoItems <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'./todoitems'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  todos<span class="token punctuation">,</span>
  todoItems<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>In the above code snippet, we're creating a <code>todoitem</code> and associating it with a particular <code>todo</code>. We are grabbing the id of that particular <code>todo</code> from the request params. We are also adding the <code>todoItems</code> controller to our default exports. Notice that we're using the <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer">ES6 object shorthand notation</a> to add the methods to <code>module.exports</code>.</p>
<p>Let's set up the route for creating a new <code>todoitem</code> and see how the <code>todoId</code> is specified. Open up your routes file and add the following route:</p>
<p><code>server/routes/index.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
app<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId/items'</span><span class="token punctuation">,</span> todoItemsController<span class="token punctuation">.</span>create<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">...</span></code></pre>
<p>The <code>:todoId</code> in the route is made available to us by Express in the <code>request.params</code> object as <code>todoId</code> and is the same one we're accessing in our controller. Do not forget to require <code>todoItems</code> controller as <code>todoItemsController</code> at the top of your routes file.</p>
<p>With this new route in place, we can go ahead and try it out in Postman.</p>
<p><img alt="Create a todo item" data-src="https://scotch-res.cloudinary.com/image/upload/dpr_1,w_650,q_auto:good,f_auto/media/3047/UY1zEBRsuxr06ExSMDGw_first-todo-item.png" class="loaded" src="https://scotch-res.cloudinary.com/image/upload/dpr_1,w_650,q_auto:good,f_auto/media/3047/UY1zEBRsuxr06ExSMDGw_first-todo-item.png" data-was-processed="true"></p>
<h2 id="toc-listing-todo-items-inside-todos">
<a href="#toc-listing-todo-items-inside-todos">Listing todo-items inside todos</a>
</h2>
<p>Now that we can create todo items, let's modify our <code>todosController.list</code> code so that it returns a <code>todo</code> together with it's associated items.</p>
<p><code>server/controllers/todos.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token function">list</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> Todo
    <span class="token punctuation">.</span><span class="token function">findAll</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      include<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
        model<span class="token punctuation">:</span> TodoItem<span class="token punctuation">,</span>
        <span class="token keyword">as</span><span class="token punctuation">:</span> <span class="token string">'todoItems'</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todos <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>todos<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token operator">...</span></code></pre>
<p>In the above code snippet, we find all <code>todos</code> and include all associated <code>todoitems</code> from the <code>TodoItem</code> model. We include them as <code>todoItems</code>, as we did when defining the relationship in the <code>Todo</code> model. Remember to require the <code>TodoItem</code> model at the top of your <code>server/controllers/todos.js</code> file.</p>
<p>We can view the results by making a GET request to <code>/api/todos</code> in Postman:</p>
<p><img alt="List todos with associated todo items" data-src="https://scotch-res.cloudinary.com/image/upload/w_auto,q_auto:good,f_auto/media/3047/GZDDX21eSfOfMAke4of6_list-todos-with-items.png"></p>
<h2 id="toc-retrieving-a-single-todo">
<a href="#toc-retrieving-a-single-todo">Retrieving a single todo</a>
</h2>
<p>Next, we're going to add functionality to retrieve one todo based on it's id. Let's add the following code inside <code>server/controllers/todos.js</code></p>
<p><code>server/controllers/todos.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token function">retrieve</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> Todo
    <span class="token punctuation">.</span><span class="token function">findById</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>todoId<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      include<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
        model<span class="token punctuation">:</span> TodoItem<span class="token punctuation">,</span>
        <span class="token keyword">as</span><span class="token punctuation">:</span> <span class="token string">'todoItems'</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todo <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>todo<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          message<span class="token punctuation">:</span> <span class="token string">'Todo Not Found'</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>todo<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token operator">...</span></code></pre>
<p>In the code snippet above, we're finding the todo whose <code>id</code> matches the <code>todoId</code> we get from the request parameters and we're also including it's associated todo items. If such a todo exists, we're sending it back in the response. If it doesn't, we're sending back an error message letting the user know we didn't find the specified todo. If we encounter an error when processing this request, we're sending back the error object.</p>
<p>Then add a new route that maps to the retrieve view:</p>
<p><code>server/routes/index.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>retrieve<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">...</span></code></pre>
<p>If you make a GET request to <code>/api/todos/1</code>using Postman, you should see the todo with id 1, with it's todo-items included in an array as well.</p>
<p><img alt="Retrieve a single todo" data-src="https://scotch-res.cloudinary.com/image/upload/w_auto,q_auto:good,f_auto/media/3047/3nZAmhPJSTedcCMO1kCc_retrieve-single-todo.png"></p>
<h2 id="toc-updating-a-single-todo">
<a href="#toc-updating-a-single-todo">Updating a single todo</a>
</h2>
<p>Let's now add functionality to update a single todo:</p>
<p><code>server/controllers/todos.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token function">update</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> Todo
    <span class="token punctuation">.</span><span class="token function">findById</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>todoId<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      include<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
        model<span class="token punctuation">:</span> TodoItem<span class="token punctuation">,</span>
        <span class="token keyword">as</span><span class="token punctuation">:</span> <span class="token string">'todoItems'</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todo <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>todo<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          message<span class="token punctuation">:</span> <span class="token string">'Todo Not Found'</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> todo
        <span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          title<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>title <span class="token operator">||</span> todo<span class="token punctuation">.</span>title<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>todo<span class="token punctuation">)</span><span class="token punctuation">)</span>  <span class="token comment">// Send back the updated todo.</span>
        <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token operator">...</span></code></pre>
<p>In the code snippet above, we're finding the todo whose id matches the <code>todoId</code> supplied in the request params. We are then updating it's title. If no title was provided, we're defaulting to the title the todo already had.</p>
<p>We also need to add a new route that maps to the update method:</p>
<p><code>server/routes/index.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
app<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>update<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">...</span></code></pre>
<p>You can issue a PUT request using Postman to practically test this route:</p>
<p><img alt="Updating a todo" data-src="https://scotch-res.cloudinary.com/image/upload/w_auto,q_auto:good,f_auto/media/3047/5mwe7haiS52ixqiVCLM2_update-todo.png"></p>
<h2 id="toc-deleting-todos">
<a href="#toc-deleting-todos">Deleting todos</a>
</h2>
<p>Finally, let's add functionality to delete todos:</p>
<p><code>server/controllers/todos.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token function">destroy</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> Todo
    <span class="token punctuation">.</span><span class="token function">findById</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>todoId<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todo <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>todo<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          message<span class="token punctuation">:</span> <span class="token string">'Todo Not Found'</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> todo
        <span class="token punctuation">.</span><span class="token function">destroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">204</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token operator">...</span></code></pre>
<p>This code is almost the same as the one we had for updating a todo, except we're not including the todo items. Remember that when you delete a todo, it's corresponding todo items are deleted as well. This is because we specified the <code>onDelete</code> action as <code>CASCADE</code> when we were setting up our models.</p>
<p>Then add the corresponding route:</p>
<p><code>server/routes/index.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
app<span class="token punctuation">.</span><span class="token keyword">delete</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>destroy<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">...</span></code></pre>
<p>If you try this out in Postman, you might be surprised that you don't get any data back. You can modify the delete code to return a <code>200</code> status code and a delete successful message as shown in the code snippet below:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
  <span class="token keyword">return</span> todo
    <span class="token punctuation">.</span><span class="token function">destroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span> message<span class="token punctuation">:</span> <span class="token string">'Todo deleted successfully.'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">...</span></code></pre>
<p>Personally, I prefer returning <code>204 No Content</code>.</p>
<h2 id="toc-updating-and-deleting-todo-items">
<a href="#toc-updating-and-deleting-todo-items">Updating and Deleting Todo Items</a>
</h2>
<p>Having gone through updating and deleting todos, it'll be a breeze going through updating and deleting todo items since the code is very similar. As such, we're going to do it all in one go.</p>
<p>Add the following code to your <code>todoItemsController</code>.</p>
<p><code>server/controllers/todoitems.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token function">update</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> TodoItem
    <span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        where<span class="token punctuation">:</span> <span class="token punctuation">{</span>
          id<span class="token punctuation">:</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>todoItemId<span class="token punctuation">,</span>
          todoId<span class="token punctuation">:</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>todoId<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todoItem <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>todoItem<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          message<span class="token punctuation">:</span> <span class="token string">'TodoItem Not Found'</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> todoItem
        <span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          content<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>content <span class="token operator">||</span> todoItem<span class="token punctuation">.</span>content<span class="token punctuation">,</span>
          complete<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>complete <span class="token operator">||</span> todoItem<span class="token punctuation">.</span>complete<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>updatedTodoItem <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>updatedTodoItem<span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>

<span class="token function">destroy</span><span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> TodoItem
    <span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        where<span class="token punctuation">:</span> <span class="token punctuation">{</span>
          id<span class="token punctuation">:</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>todoItemId<span class="token punctuation">,</span>
          todoId<span class="token punctuation">:</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>todoId<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>todoItem <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>todoItem<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          message<span class="token punctuation">:</span> <span class="token string">'TodoItem Not Found'</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> todoItem
        <span class="token punctuation">.</span><span class="token function">destroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">204</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token keyword">catch</span><span class="token punctuation">(</span>error <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">400</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token operator">...</span></code></pre>
<p><strong>Edit</strong>: As pointed out by good people in the comments, you'll notice that we're finding the todo item to either update or delete by two criteria: it's own <code>id</code> which we're grabbing from the <code>params</code> as <code>todoItemId</code> and the <code>id</code> of it's parent todo, which we're obtaining from the <code>params</code> object as <code>todoId</code>.</p>
<p>Let us, for a moment, focus on the <code>update</code> method. In the <code>update</code> method, we are grabbing the provided <code>todoItemId</code> from the request. We are then finding the todo item with that id and in readiness to update it. If we don't find it, we return early and send and error message to the user.</p>
<p>Earlier on, when we were updating the todo title, we had this statement:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  title<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>title <span class="token operator">||</span> todo<span class="token punctuation">.</span>title<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token operator">...</span></code></pre>
<p>To recap, we said that we either use the new title or default to the old one if a title was not provided. You will notice the same pattern when we're updating the todo item in this statement:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  content<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>content <span class="token operator">||</span> todoItem<span class="token punctuation">.</span>content<span class="token punctuation">,</span>
  complete<span class="token punctuation">:</span> req<span class="token punctuation">.</span>body<span class="token punctuation">.</span>complete <span class="token operator">||</span> todoItem<span class="token punctuation">.</span>complete<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token operator">...</span></code></pre>
<p>While this approach works for our application, since we have a small number of fields, it wouldn't scale very well if you had to update a model with many fields. As such, you might want to use another approach where you give the Sequelize model <code>update</code> function the data and then specify the fields it should update. Using this approach, we change change our <code>.update</code> statement to:</p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token operator">...</span>
<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>body<span class="token punctuation">,</span> <span class="token punctuation">{</span> fields<span class="token punctuation">:</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>body<span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token operator">...</span></code></pre>
<p>To recap, using this approach, we pass the whole update object we get from the request (<code>req.body</code>) to the update function. Using ES6's <code>Object.keys</code> function, we extract the keys from the update object and tell the <code>TodoItem</code> Sequelize model to only update the fields that are present in the update data object. If we have a field in our model that's missing from the update object, the update operation will leave that field untouched. This saves us the trouble of having to define defaults using the <code>||</code> operator. You can read more about updating models in these <a href="http://docs.sequelizejs.com/en/latest/docs/instances/#updating-saving-persisting-an-instance">Sequelize docs.</a></p>
<p>The <code>destroy</code> method finds a todo item with the stipulated id and deletes it.</p>
<p>Finally, we will add the two new routes in our routes file, right below the route to create todo items. Our complete routes file now looks like:</p>
<p><code>server/routes/index.js</code></p>
<pre class="language-javascript" data-title="javascript"><code class="language-javascript"><span class="token keyword">const</span> todosController <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'../controllers'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>todos<span class="token punctuation">;</span>
<span class="token keyword">const</span> todoItemsController <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'../controllers'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>todoItems<span class="token punctuation">;</span>

module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token punctuation">(</span>app<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/api'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    message<span class="token punctuation">:</span> <span class="token string">'Welcome to the Todos API!'</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  app<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/api/todos'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>create<span class="token punctuation">)</span><span class="token punctuation">;</span>
  app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/api/todos'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>list<span class="token punctuation">)</span><span class="token punctuation">;</span>
  app<span class="token punctuation">.</span><span class="token keyword">get</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>retrieve<span class="token punctuation">)</span><span class="token punctuation">;</span>
  app<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>update<span class="token punctuation">)</span><span class="token punctuation">;</span>
  app<span class="token punctuation">.</span><span class="token keyword">delete</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId'</span><span class="token punctuation">,</span> todosController<span class="token punctuation">.</span>destroy<span class="token punctuation">)</span><span class="token punctuation">;</span>

  app<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId/items'</span><span class="token punctuation">,</span> todoItemsController<span class="token punctuation">.</span>create<span class="token punctuation">)</span><span class="token punctuation">;</span>
  app<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId/items/:todoItemId'</span><span class="token punctuation">,</span> todoItemsController<span class="token punctuation">.</span>update<span class="token punctuation">)</span><span class="token punctuation">;</span>
  app<span class="token punctuation">.</span><span class="token keyword">delete</span><span class="token punctuation">(</span>
    <span class="token string">'/api/todos/:todoId/items/:todoItemId'</span><span class="token punctuation">,</span> todoItemsController<span class="token punctuation">.</span>destroy
  <span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// For any other request method on todo items, we're going to return "Method Not Allowed"</span>
  app<span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span><span class="token string">'/api/todos/:todoId/items'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token operator">=&gt;</span>
    res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">405</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      message<span class="token punctuation">:</span> <span class="token string">'Method Not Allowed'</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
<p>This was a long post but yay! We're done! Well, almost. :)</p>
<p>There are some improvements you could decide to make, for example:</p>
<ul>
<li>Better error handling. Currently, we're assuming that all errors are due to the data the user has provided. We're also sending back the whole error object. That could be a security issue since you might leak information about your architecture to the end user.</li>
<li>Form fields validation. We currently have no front-facing input fields validation. Whenever you're building a web application, it's <strong>imperative</strong> that you validate user input before it hits the database. Our current validation (not null constraint) occurs at the database level. One way of performing this validation would be by intercepting the request in a middleware and validating that it contains the required fields.</li>
</ul>
<p>You can find the complete code in this <a href="https://github.com/andela-jmuturi/postgres-express-node-tutorial">GitHub repo</a>.</p>
<p>I hope this helped you to get up and running with Node, Express and Postgres. :)</p>
</div>
