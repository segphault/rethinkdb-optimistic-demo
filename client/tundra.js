import Freezer from "freezer-js";
import uuid from "uuid";

const horizon = Horizon();
const latency = msec =>
  new Promise(resolve => setTimeout(resolve, msec));

export default class Tundra {
  constructor(collection) {
    this.store = new Freezer([]);
    this.collection = horizon(collection);

    this.collection.watch({rawChanges: true})
    .forEach(({old_val, new_val, type}) => {
      let store = this.store.get();

      if (type === "initial")
        store.push(new_val);
      else if (type === "remove")
        store.reset(store.filter(x => x.id !== old_val.id))
      else if (type === "change" || type === "add") {
        let target = store.find(x => x.id === new_val.id);
        target ? target.reset(new_val) : store.push(new_val);
      }
    });
  }

  subscribe(fn) {
    this.store.on("update", fn);
  }

  async update(item, props) {
    let ref = item.set({...props, pending: "update"});

    await latency(1000);

    try {
      await this.collection.update({id: item.id, ...props}).toPromise();
    } catch (err) { ref.reset(item) }
  }

  async add(props) {
    let newItem = {id: uuid.v4(), ...props};
    this.store.get().push({...newItem, pending: "add"});

    await latency(1000);

    try {
      await this.collection.store(newItem).toPromise();
    } catch (err) {
      let store = this.store.get();
      store.reset(store.filter(x => x.id !== newItem.id));
    }
  }

  async remove(item) {
    let ref = item.set({pending: "remove"});

    await latency(1000);

    try {
      await this.collection.remove(item.id).toPromise();
    } catch (err) { ref.remove("pending") }
  }
}
