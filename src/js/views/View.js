import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;

    const html = this._generateMarkup();

    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  update(data) {
    this._data = data;

    const newHTML = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newHTML);
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, index) => {
      const curEl = currElements[index];

      // This is for updating the changed text only
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = +newEl.textContent;
      }

      // This is for updating the attributes of the elements affected
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(att => {
          curEl.setAttribute(att.name, att.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const html = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderError(message = this._errorMessage) {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderMessage(message = this._message) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
