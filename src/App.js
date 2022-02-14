
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [todo, setTodo] = useState([])

  useEffect(() => {
    getTodos();
  }, [])

  const [url, setUrl] = useState("https://assets.breatheco.de/apis/fake/todos/user/maxRodriguez")

  const getTodos = () => {

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {  
        console.log(resp);
        if (resp.status === 404){
          createTodos();
        }
        return resp.json() // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
      })
      .then(data => {
        //Aquí es donde debe comenzar tu código después de que finalice la búsqueda 
        setTodo(data)
      })
      .catch(error => {
        //manejo de errores
        console.log(error);
      });
  }

  const createTodos = () => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([])
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.result){
          getTodos();
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const updateTodos = (todo) => {
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo)
    }).then(resp => {
      console.log("updateTodos " + resp.ok); // will be true if the response is successfull
      console.log("updateTodos " + resp.status); // the status code = 200 or code = 400 etc.
      return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
    })
      .then(data => {
        //here is were your code should start after the fetch finishes        
          getTodos();       
        console.log(data); //this will print on the console the exact object received from the server
      })
      .catch(error => {
        //error handling
        console.log(error);
      });
  }


  const deleteTodos = () => {
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      } 
    })
    .then((response) => {
      response.json()
    })
    .then((data) => {
      getTodos()
      console.log(data);
    })
    .catch((error) => console.log(error))
  }



  const todoList = todo.length > 0 ? todo.map((todo, index) => {
    return (
      <li key={index}>
        {todo.label}
        <button onClick={() => removeTodo(index)}>
        <i className="fas fa-trash-alt"></i>
        </button>
      </li>
    )
  }): (<li>Lista vacia</li>)


  const handlePost = e => {
    if (e.keyCode === 13 && e.target.value !== "") {
      let task = [...todo].concat({ label: e.target.value, done: false })
      setTodo(task)
      updateTodos(task);
      e.target.value = "";
    }
  }

  const removeTodo = (i) => {
    let newTodo = [...todo]
    newTodo.splice(i, 1)
    updateTodos(newTodo)
  }

  const itemsLeft = () => {
    if (todo.length === 0) {
      return "Tareas que quedan hacer"
    } else if (todo.length === 1) {
      return "Tareas que faltan hacer"
    } else if (todo.length > 1) {
      return `${todo.length} ¡Tareas que faltan hacer!`
    }
  }



  return (

    <div className="container">
      <h1 className="title">LISTA DE TAREAS</h1>
      <ul className="listItemClass">
        <input type="text" onKeyUp={handlePost} placeholder="Escriba tarea y enter" />
        {todoList}
      </ul>
      <div className="footer">
        <small>{itemsLeft()}</small>
        <button className="btn btn-outline-danger btn-sm float-end" onClick={() => deleteTodos()}>ELIMINAR TODO</button>
      </div>
    </div>

  );
}

export default App;
