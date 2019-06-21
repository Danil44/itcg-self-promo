import EventEmitter from "./services/event-emiter";
import { tns } from "tiny-slider/src/tiny-slider.module.js";
import { brotliDecompressSync } from "zlib";
import Inputmask from "inputmask";

export default class View extends EventEmitter {
  constructor() {
    super();

    this.form = document.querySelector(".order-modal__form");

    this.form.addEventListener("submit", this.handleSendFormData.bind(this));
  }

  showSuccess() {
    const orderModal = document.querySelector(".order-modal");
    const bodyContent = document.querySelector("body");
    const successModal = document.querySelector(".order-success");

    resetForm(this.form);

    successModal.classList.remove("closed");
    orderModal.classList.add("closed");

    setTimeout(() => {
      successModal.classList.add("closed");
      bodyContent.style.position = "unset";
    }, 3000);

    function resetForm(form) {
      const inputs = form.querySelectorAll("input");
      const comment = form.querySelector("textarea");
      const errorText = form.querySelectorAll(".order-modal__error-desc");

      comment.value = "";
      inputs.forEach(input => {
        if (input.classList.contains("invalid-field")) {
          input.classList.remove("invalid-field");
        }
        input.value = "";
      });
      errorText.forEach(text => {
        if (text.innerHTML !== "") {
          text.innerHTML = "";
        }
      });
    }
  }

  showError(errorData) {
    for (let key in errorData) {
      if (key !== "comment") {
        this.form
          .querySelector(`input[name=${key}]`)
          .classList.add("invalid-field");
        this.form.querySelector(`[data-field=${key}]`).innerHTML =
          errorData[key][0];
      }
    }
  }

  handleSendFormData(evt) {
    evt.preventDefault();
    const csrfToken = document.querySelector(
      'input[name="csrfmiddlewaretoken"]'
    ).value;
    const formData = new FormData(this.form);

    const headers = {
      "X-CSRFToken": csrfToken
    };

    this.emit("send", formData, headers);
  }

  addPhoneInputMask() {
    const input = document.querySelectorAll('input[name="phone"]');
    Inputmask("+38(099)99999999", { repeat: 15 }).mask(input);
  }

  slider() {
    const casesItems = document.querySelectorAll(".cases__item");
    const mobileTabletSize = window.matchMedia("(max-width: 1023px)");

    const slideCount =
      casesItems.length >= 6 && !mobileTabletSize.matches ? 3 : 1;

    const itemsCount = mobileTabletSize.matches ? 1 : 3;
    console.log(slideCount);
    const slider = tns({
      container: ".my-slider",
      loop: true,
      items: itemsCount,
      slideBy: slideCount,
      nav: false,
      autoplay: true,
      speed: 400,
      autoplayButtonOutput: false,
      controlsContainer: "#customize-controls",
      mouseDrag: true
    });
  }

  scrollNavigation() {
    function smoothScroll(targetSection, duration) {
      const target = document.querySelector(targetSection);
      const targetPosition = target.getBoundingClientRect().top;
      const startPosition = window.pageYOffset || window.scrollY;
      const distance = targetPosition - startPosition;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      }
      requestAnimationFrame(animation);
    }

    const casesBtn = document.querySelector(".js-cases");
    const articlesBtn = document.querySelector(".js-articles");
    const expertsBtn = document.querySelector(".js-experts");

    casesBtn.addEventListener("click", () => {
      smoothScroll(".cases", 1000);
    });
    articlesBtn.addEventListener("click", () => {
      smoothScroll(".articles", 1000);
    });
    expertsBtn.addEventListener("click", () => {
      smoothScroll(".experts", 1000);
    });
  }

  openOrderModal() {
    const openButtons = document.querySelectorAll(".js-order-open");
    const orderModal = document.querySelector(".order-modal");
    const bodyContent = document.querySelector("body");
    openButtons.forEach(button =>
      button.addEventListener("click", handleOpenModal)
    );

    function handleOpenModal(evt) {
      evt.preventDefault();
      if (orderModal.classList.contains("closed")) {
        orderModal.classList.remove("closed");
        bodyContent.style.position = "fixed";
      }
    }

    const closeButton = document.querySelector(".js-order-close");
    if (closeButton) {
      closeButton.addEventListener("click", handleCloseModal);
    }

    function handleCloseModal(evt) {
      evt.preventDefault();
      if (!orderModal.classList.contains("closed")) {
        orderModal.classList.add("closed");
        bodyContent.style.position = "unset";
      }
    }
  }

  openArticle() {
    const openButton = document.querySelectorAll(".article__show-btn");
    const openTitle = document.querySelectorAll(".article__title");

    openTitle.forEach(title =>
      title.addEventListener("click", handleOpenArticle)
    );

    openButton.forEach(button =>
      button.addEventListener("click", handleOpenArticle)
    );

    function handleOpenArticle(evt) {
      evt.preventDefault();
      const article = this.previousElementSibling || this.nextElementSibling;
      const openBtnInner = this.parentElement.querySelector(".btn-text");

      if (article.classList.contains("show-article")) {
        openBtnInner.innerHTML = "Читать";
        openBtnInner.classList.add("down-show-arrow");
        openBtnInner.classList.remove("up-show-arrow");
        article.classList.remove("show-article");
      } else {
        openBtnInner.innerHTML = "Скрыть";
        openBtnInner.classList.remove("down-show-arrow");
        openBtnInner.classList.add("up-show-arrow");
        article.classList.add("show-article");
      }
    }
  }

  firstPageAnimation() {
    const whiteLogo = document.querySelector(".logo--white");
    const orangeLogo = document.querySelector(".logo--orange");
    const mobileTebletSize = window.matchMedia("(max-width: 1023px)");

    const man = document.querySelector(".man");
    const thief = document.querySelector(".thief");

    const backgroundElement = document.querySelector(".main__header");

    if (backgroundElement.classList.contains("header--blue")) {
      backgroundElement.classList.remove("header--blue");
      backgroundElement.classList.add("header--orange");

      if (mobileTebletSize.matches) {
        whiteLogo.classList.add("invisible");
        orangeLogo.classList.remove("invisible");
      } else {
        orangeLogo.classList.add("invisible");
        whiteLogo.classList.remove("invisible");
      }

      man.classList.add("invisible");
      thief.classList.remove("invisible");
      thief.classList.add("run-thief");
    } else {
      backgroundElement.classList.remove("header--orange");
      backgroundElement.classList.add("header--blue");

      whiteLogo.classList.remove("invisible");
      orangeLogo.classList.add("invisible");

      man.classList.remove("invisible");
      thief.classList.add("invisible");
      thief.classList.remove("run-thief");
    }
  }
}
