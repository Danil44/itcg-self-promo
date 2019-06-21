import Model from "./model";
import View from "./view";
import Controller from "./controller";

const model = new Model();
const view = new View();
new Controller(model, view);
