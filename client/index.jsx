import React from "react";
import ReactDOM from "react-dom";
import Tundra from "./tundra.js";

let TextField = props =>
  <input type="text" {...props}
         onKeyUp={e => e.keyCode == 13 && props.onEnter(e)} />

let TodoNew = ({onAdd}) =>
  <div className="new">
    <h3>Add New Item:</h3>
    <TextField type="text" placeholder="New Item" onEnter={onAdd} />
  </div>

let TodoItem = React.createClass({
  render() {
    return (
    <div className={this.props.item.pending}>
      <input type="checkbox" checked={this.props.item.finished} onChange={this.toggleCheck} />
      <TextField type="text" defaultValue={this.props.item.text} onEnter={this.editText} />
      <a href="#" onClick={e => this.props.onRemove(this.props.item)}>X</a>
      {this.props.item.pending &&
        <img className="spinner" src="loading.gif" width="24" height="24" />}
    </div>)
  },

  toggleCheck(e) {
    this.props.onUpdate(this.props.item, {finished: !this.props.item.finished});
  },

  editText(e) {
    this.props.onUpdate(this.props.item, {text: e.target.value});
  }
});

let App = React.createClass({
  render() {
    return (
    <div className="content">
      <div className="todos">
        {this.client.store.get().map(x =>
          <TodoItem item={x} key={x.id}
                    onUpdate={this.client.update.bind(this.client)}
                    onRemove={this.client.remove.bind(this.client)} />)}
      </div>

      <TodoNew onAdd={this.add} />
    </div>);
  },

  add(e) {
    this.client.add({text: e.target.value, finished: false});
    e.target.value = "";
  },

  componentWillMount() {
    this.client = new Tundra("todos");
  },

  componentDidMount() {
    this.client.subscribe(() => this.forceUpdate());
  }
});

ReactDOM.render(<App />, document.getElementById("app"));
