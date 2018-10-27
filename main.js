function createStore(reducer) {
  let state;
  let listeners = [];
  const getState = () => state;
  const subscribe = listener => {
    listeners.push(listener);
    return listeners.filter(l => l !== listener);
  };
  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(l => l(state));
  };
  return {
    getState,
    subscribe,
    dispatch
  };
}

// Creating Global Reducer, which is going to combine all other reducers

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  };
}

// Creating Reducers, which will run every time global reducer runs;

// But first of all, we need to define our action types;
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const REMOVE_TODO = "REMOVE_TODO";

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(
        todo =>
          todo.id !== action.id
            ? todo
            : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

// Creating goals reducer

const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
    default:
      return state;
  }
}

// After that we need to create our actions

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  };
}
function ToggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  };
}
function RemoveTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  };
}
function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  };
}

// Now, we are ready to create our store

const store = createStore(app);
// Redux Alternative
// const store = Redux.createStore(app);

// We will subscribe our store an event, when we change state it will console log it.

store.subscribe(state => {
  console.log("The new state is", state);
});

// Now, we are going to built the DOM
function createRemoveButton(cb) {
  const button = document.createElement("button");
  button.textContent = "X";
  button.addEventListener("click", cb);
  return button;
}

function addTodo(e) {
  e.preventDefault();
  const todo = document.getElementById("todo");
  const name = todo.value;
  todo.value = "";
  store.dispatch(
    addTodoAction({
      id: generateID(),
      complete: false,
      name
    })
  );
}

function addTodoToTheDOM(todo) {
  const node = document.createElement("li");
  const text = document.createTextNode(todo.name);
  const btn = createRemoveButton(() => {
    store.dispatch(RemoveTodoAction(todo.id));
  });
  node.style.textDecoration = todo.complete ? "line-through" : "none";
  node.addEventListener("click", () => {
    store.dispatch(ToggleTodoAction(todo.id));
  });
  node.appendChild(text);
  node.appendChild(btn);
  document.getElementById("todos").appendChild(node);
}

function addGoal(e) {
  e.preventDefault();
  const goal = document.getElementById("goal");
  const name = goal.value;
  goal.value = "";
  store.dispatch(
    addGoalAction({
      id: generateID(),
      name
    })
  );
}
function addGoalToTheDOM(goal) {
  const node = document.createElement("li");
  const text = document.createTextNode(goal.name);
  const btn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
  });
  node.appendChild(text);
  node.appendChild(btn);
  document.getElementById("goals").appendChild(node);
}

store.subscribe(state => {
  const goals = document.getElementById("goals");
  const todos = document.getElementById("todos");
  goals.innerHTML = "";
  todos.innerHTML = "";
  state.goals.forEach(goal => addGoalToTheDOM(goal));
  state.todos.forEach(todo => addTodoToTheDOM(todo));
});

document.getElementById("goalBtn").addEventListener("click", addGoal);
document.getElementById("todoBtn").addEventListener("click", addTodo);

// helpers

function generateID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}
