var logger = require('koa-logger');
var route = require('koa-route');
var views = require('co-views');
var parse = require('co-body');
var koa = require('koa');
var app = koa();


var todos = []; //Save Todos

app.use(logger());
// ROUTE
app.use(route.get('/', list));
app.use(route.get('/todo/new', add));
app.use(route.get('/todo/:id', show));
app.use(route.get('/todo/delete/:id', remove));
app.use(route.get('/todo/edit/:id', edit));
app.use(route.post('/todo/create', create));
app.use(route.post('/todo/update', update));

var render= views(__dirname + '/views', { map: { html: 'swig' }});

/**
 * LIST.
 */
function *list() {
  this.body = yield render('index', { todos: todos });
}

/**
 * NEW
 */
function *add() {
  this.body = yield render('new');
}

/**
 * EDIT
 */
function *edit(id) {
    var todo = todos[id];
    if (!todo) this.throw(404, 'invalid todo id');
    this.body = yield render('edit', { todo: todo });
}

/**
 * SHOW
 */

function *show(id) {
  var todo = todos[id];
  if (!todo) this.throw(404, 'invalid todo id');
  this.body = yield render('show', { todo: todo });
}

/**
 * REMOVE
 */
function *remove(id) {
    var todo = todos[id];
    if (!todo) this.throw(404, 'invalid todo id');
   todos.splice(id,1);
    //Changing the Id for working with index
    for (var i = 0; i < todos.length; i++)
    {
        todos[i].id=i;
    }
    this.redirect('/');
}

/**
 * CREATE
 */
function *create() {
  var todo = yield parse(this);
  todo.created_on = new Date;
  todo.updated_on = new Date;
  var id = todos.push(todo);
  todo.id = id-1;//Id with index of the array
  this.redirect('/');
}

/**
 * UPDATE
 */
function *update() {
    var todo = yield parse(this);
    var index=todo.id;
    todos[index].name=todo.name;
    todos[index].description=todo.description;
    todos[index].updated_on = new Date;
    this.redirect('/');
}

app.listen(1337);
console.log('listening on port 1337');