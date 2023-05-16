"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";

// Counting total todo's Complete
const totalCheckd = (todo) => {
  // let count = 0
  // todo.forEach((item) => {
  //   if (item.complete === true) count++;
  // });
  // return count;

  const total = todo?.reduce((acc, cur) => {
    if (cur.complete === true) acc++;
    return acc;
  }, 0);
  // console.log(total);
  if (total > 0) return total;
};

export default function Input() {
  const todoList = [
    {
      id: 1,
      name: "Devender",
      timeStamp: moment().format(),
      complete: true,
    },
    {
      id: 2,
      name: "Dheeraj",
      timeStamp: moment().format(),
      complete: false,
    },
    {
      id: 3,
      name: "Sandeep",
      timeStamp: moment().format(),
      complete: false,
    },
    {
      id: 4,
      name: "Rahul",
      timeStamp: moment().format(),
      complete: true,
    },
  ];

  // To get data from local Storage...
  const backup = JSON.parse(localStorage.getItem("data")) || [];

  const [todo, setToDo] = useState(backup);
  console.log(todo);

  const [input, setInput] = useState("");
  // console.log(input);

  const [edit, setEdit] = useState(false);
  const [todoId, setTodoId] = useState();
  // console.log(todoId);

  const uniqId = uuidv4();
  // console.log(uniqId);

  const findObject = (id) => {
    let findObject = todo.find((item) => item.id === id);
    // console.log(findObject);
    return findObject;
  };

  // Submit Handler If there is edit then First Operation otherwise else is new Todo
  const submitHandler = () => {
    if (input === "") return;

    if (edit) {
      toast.info("Todo edited successfully!");

      const editTodo = todo.map((item) => {
        if (item.id === todoId) {
          item.name = input;
          item.timeStamp = moment().format();
          // console.log("if wala item", item);
          return item;
        }
        // console.log("map wala item", item);
        return item;
      });
      // console.log(editTodo);
      setToDo(editTodo);
      setEdit(false);
      setInput("");
      localStorage.setItem("data", JSON.stringify(editTodo));
    } else {
      toast.success("Todo list added successfully!");
      let obj = {
        id: uniqId,
        name: input,
        timeStamp: moment().format(),
        complete: false,
      };
      // console.log(obj);
      setToDo([obj, ...todo]);
      setInput("");
      localStorage.setItem("data", JSON.stringify([obj, ...todo]));
    }
  };

  // To check the edit id and change their name
  const editTodo = (id) => {
    // console.log(id);
    setEdit(true);
    let obj = findObject(id);
    // console.log(obj);
    setInput(obj.name);
    setTodoId(id);
  };

  // To delete the specific item from array...
  const deleteTodo = (id) => {
    toast.error("Delete Succesfully!");
    console.log(id);
    let remove = todo.filter((item) => item.id !== id);
    // console.log(remove);
    setToDo(remove);
    localStorage.setItem("data", JSON.stringify(remove));
  };

  // toggle checkbox button functionality...
  const toggleCheckbox = (event, id) => {
    // console.log(id);
    let checkBox = event.target.checked;
    const updatedTodos = todo.map((item) => {
      // console.log(item);
      if (item.id === id) {
        return { ...item, complete: checkBox };
      }
      return item;
    });
    setToDo(updatedTodos);
    localStorage.setItem("data", JSON.stringify(updatedTodos));
  };

  return (
    <div>
      <h1
        style={{ display: "flex", marginTop: "20px", justifyContent: "center" }}
        for="new-task"
      >
        Total {todo?.length > 0 ? todo?.length : ""} Todo's List / Completed
        Todo's {totalCheckd(todo)}
      </h1>
      <div className="main">
        <div>
          <TextField
            sx={{ marginRight: "20px", backgroundColor: "white" }}
            id="outlined-basic"
            label="Enter Here"
            variant="outlined"
            size="small"
            name="name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={submitHandler} variant="contained">
            {edit ? "Update Todo" : "Add To List"}
          </Button>
        </div>
      </div>
      <div
        style={{ display: "grid", justifyContent: "center", marginTop: "20px" }}
      >
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            justifyContent: "space-evenly",
          }}
        >
          {todo?.map((value) => {
            return (
              <ListItem key={value.id} secondaryAction={""} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={value.complete}
                      onChange={(e) => toggleCheckbox(e, value.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={value.name}
                    secondary={moment(value.timeStamp).format("lll")}
                  />
                </ListItemButton>
                <div>
                  <Button
                    sx={{
                      marginRight: "10px",
                      backgroundColor: "yellow",
                      color: "black",
                    }}
                    variant="outlined"
                    onClick={() => editTodo(value.id)}
                  >
                    edit
                  </Button>
                  <Button
                    sx={{
                      marginRight: "10px",
                      backgroundColor: "red",
                      color: "black",
                    }}
                    color="primary"
                    variant="outlined"
                    onClick={() => deleteTodo(value.id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListItem>
            );
          })}
        </List>

        {/* {todo.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={item.complete}
                  onChange={(e) => toggleComplete(e, item.id)}
                />
                <li>{item.name}</li>
                <div style={{ fontSize: "13px" }}>
                  {moment(item.timeStamp).format("hh:m DD:MM:YYYY")}
                </div>
              </div>
              <div>
                <button
                  onClick={() => editTodo(item.id)}
                  style={{ backgroundColor: "yellow", marginLeft: "20px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(item.id)}
                  style={{ backgroundColor: "red", marginLeft: "20px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })} */}

        <ToastContainer
          theme="colored"
          position="bottom-center"
          autoClose={2000}
        />
      </div>{" "}
    </div>
  );
}
