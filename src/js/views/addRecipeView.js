import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { wait } from '../helpers.js';
import { MODAL_RENDER_FORM_SEC, MODAL_CLOSE_SEC } from '../config.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _windowForm = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _message = 'Recipe was succesfully uploaded 🍴';
  _formElement = document.querySelector('.upload').innerHTML;

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._windowForm.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      console.log(data);
      handler(data);
    });
  }

  _generateMarkup() {}

  async closeFormWindow() {
    this.toggleWindow();
  }

  async clearRender() {
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', this._formElement);
  }

  async renderForm() {
    try {
      await wait(MODAL_CLOSE_SEC);
      await this.closeFormWindow();
      await wait(MODAL_RENDER_FORM_SEC);
      await this.clearRender();
    } catch (err) {
      console.error(err);
    }
  }
}

export default new AddRecipeView();
