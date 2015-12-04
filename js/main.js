var todoTemplate = $('#todoTemplate').html();
var renderTodos  = _.template(todoTemplate);

var $list = $('.todos');
var todoList;

/*------  TODO  ------*/
function Todo(data) {
  this.name = data.name;
  this.id   = data.id;
  this.completed = data.completed || false;
};

Todo.prototype.destroy = function(callback) {
  $.ajax({
      url : "http://localhost:4000/todos/" + this.id,
      type: "DELETE",
      success: function(result){
        callback(result);
      }
  });
};

Todo.prototype.updateCompleted = function(value) {
  $.ajax({
    type: "PUT",
    url : 'http://localhost:4000/todos/' + this.id, 
    data: {"completed": value}, 
    success: function(data) {
      console.log(data)
    }
  });
};

Todo.prototype.updateName = function(value) {
  $.ajax({
    type: "PUT",
    url: 'http://localhost:4000/todos/' + this.id, 
    data: {"name": value}, 
    success: function(data) {
      console.log(data)
    }
  });
};

Todo.prototype.save = function(callback) {
  $.post('http://localhost:4000/todos', {"name": this.name}, _.bind(function(data) {
    this.id = data.id;
    callback();
  }, this));
}




/*-----  RENDER LIST  -----*/
function renderList(list) {
  $('ul').empty().html(renderTodos(list))
};




/*----  MAP TODO ITEM  ----*/
function mapTodo(list) {
  todoList = _.map(list, function(item) {
    return new Todo(item)
  })
  return todoList;
}




/*---------  GET  ---------*/
$.get('http://localhost:4000/todos', function(data) {
  renderList(mapTodo(data))
});




/*----------  POST  ----------*/
$('#submit-button').on('click', function() {
  var $userInput = $('#new-todo');
  var todo = new Todo({name: $userInput.val()});
  todo.save(function() {
    renderList(todoList)
  });
  todoList.push(todo);
  $userInput.val(null);
});

$('#new-todo').keypress(function(e){
  if (e.which == 13) {
    $('#submit-button').click()
  }
});




/*----------  CHECKED  ----------*/
$list.on('change', '.checkbox', function() {
  var todoID = $(this).parents('.row').data('id');
  
  var todo = _.find(todoList, function(todo) {
    return todo.id === todoID;
  });
  
  this.checked ? todo.updateCompleted(true) : todo.updateCompleted(false);
});




/*----------  DELETE  ----------*/
$list.on('click', '.delete-button', function() {
  var todoID = $(this).parents('.row').data('id');

   var todo = _.find(todoList, function(todo) {
    return todo.id === todoID;
   });

  todo.destroy(function(result) {
    todoList = [];
    todoList = _.map(result, function(item) {
      return (new Todo(item));
    });
    renderList(todoList);  
  })
});




/*----------  EDIT  ----------*/
$list.on('dblclick', '.text', function() {
  var $input = $('.edit-input');
  $(this).hide();
  $(this).next().show();
  $input.val( $(this).text() );
  $input.focus();

  $input.on('blur', function() {
    var newValue = $(this).val();
    console.log(newValue);
    $(this).hide();
    $(this).prev().show();
    $(this).prev().text(newValue);

    $input.keypress(function(e){
      if (e.which == 13) {
        $(this).blur();
      }
    });

    var todoID = $(this).parents('.row').data('id');

    var todo = _.find(todoList, function(todo) {
      return todo.id === todoID;
    });
    todo.updateName(newValue);
  })
});

$list.on('click', '.edit-button', function() {
  $(this).parents('li').children('.list-item').children('.text').dblclick();
});


















/*----------  QUESTIONS  ----------*/


//  1. traversing the dom - grabbing nested children with .children
//  2. full explanation on functions for templates
//  3. calling the save function


/*=============================================
=               PERSONAL NOTES                =
=============================================*/

/*

GET /todos
POST /todos
GET /todos/1
PUT /todos/1
DELETE /todos/1

*/

