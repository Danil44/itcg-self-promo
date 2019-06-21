import EventEmitter from "./services/event-emiter";
import axios from "axios";
export default class Model extends EventEmitter {
  constructor() {
    super();
  }

  sendData(formData, headers) {
    const correctNumber = formData
      .get("phone")
      .replace(/\+/g, "")
      .replace(/[{()}]/g, "")
      .trim();
    formData.set("phone", correctNumber);
    axios
      .post("/auditing/orders/create/", formData, { headers: headers })
      .then(resp => {
        this.emit("success");
      })
      .catch(({ response }) => {
        this.emit("error", response.data);
      });
  }
}
