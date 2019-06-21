import EventEmitter from "./services/event-emiter";

export default class Controller extends EventEmitter {
  constructor(model, view) {
    super();
    this.model = model;
    this.view = view;

    view.on("send", this.sendData.bind(this));
    model.on("error", this.showError.bind(this));
    model.on("success", this.showSuccess.bind(this));

    this.view.openArticle();
    this.view.openOrderModal();
    this.view.addPhoneInputMask();
    this.loadAnimation();
  }

  loadAnimation() {
    const mobileTabletSize = window.matchMedia("(max-width: 1023px)");
    const timeout = mobileTabletSize.matches ? 2000 : 3000;
    const casesItems = document.querySelectorAll(".cases__item");

    if (window.location.pathname === "/" || casesItems.length >= 4) {
      this.view.slider();
    }

    if (!mobileTabletSize.matches && window.location.pathname === "/") {
      this.view.scrollNavigation();
    }

    if (window.location.pathname === "/") {
      setInterval(() => {
        this.view.firstPageAnimation();
      }, timeout);
    }
  }

  sendData(formData, headers) {
    this.model.sendData(formData, headers);
  }

  showError(errorData) {
    this.view.showError(errorData);
  }

  showSuccess() {
    this.view.showSuccess();
  }
}
