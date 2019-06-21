import EventEmitter from "./services/event-emiter";

export default class Controller extends EventEmitter {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;
  }
}
