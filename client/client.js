import Freezer from "freezer-js";
import uuid from "uuid";

let latency = msec =>
  new Promise(resolve => setTimeout(resolve, msec));

export default class Client {
  constructor() {
    this.socket = io();
    this.store = new Freezer([])
    this.refresh();

    this.socket.on("todos:update", ({old_val, new_val}) => {
      let store = this.store.get();
      if (old_val && !new_val)
        store.reset(store.filter(x => x.id !== old_val.id))
      else {
        let target = store.find(x => x.id === new_val.id);
        target ? target.reset(new_val) : store.push(new_val);
      }
    });
  }

  subscribe(fn) {
    this.store.on("update", fn);
  }

  send(command, data) {
    return new Promise((resolve, reject) =>
        this.socket.emit(command, data, (output, err) =>
          (err || !output) ? reject(err) : resolve(output)));
  }

  async refresh() {
    this.store.get().reset(await this.send("todos"));
  }

  async update(item, props) {
    let ref = item.set({...props, pending: "update"});

    await latency(1000);

    try { await this.send("update", {id: item.id, ...props}) }
    catch (err) { ref.reset(item) }
  }

  async add(props) {
    let newItem = {id: uuid.v4(), ...props};
    this.store.get().push({...newItem, pending: "create"});

    await latency(1000);

    try { await this.send("add", newItem) }
    catch (err) {
      let store = this.store.get();
      store.reset(store.filter(x => x.id !== newItem.id));
    }
  }

  async remove(item) {
    let ref = item.set({pending: "remove"});

    await latency(1000);

    try { await this.send("remove", item) }
    catch (err) { ref.remove("pending") }
  }
}
