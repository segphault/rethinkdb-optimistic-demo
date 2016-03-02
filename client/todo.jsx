import React from "react";

let toggleCheck = (e, item) =>
  socket.emit("todos|update",
    Object.assign({}, item, {finished: e.target.checked}));

  //socket.emit("todos|update", {...item, ...{}})

let editTitle = (e, x) =>
  console.log("Toggle Check", e.target.value);

let TodoItem = ({item}) =>
  <li>
    <input type="checkbox" checked={item.status} onChange={e => toggleCheck(e, item)} />
    <input type="text" value={item.text} onChange={e => editTitle(e, item)} />
  </li>;

export let TodoList = ({items}) =>
  <div className="todos">
    <ul>{items.map(x => <TodoItem item={x} key={x.id} />)}</ul>
  </div>;
