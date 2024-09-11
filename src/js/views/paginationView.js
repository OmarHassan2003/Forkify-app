import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _currentPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateButtonHtml(pos) {
    this._currentPage = this._data.page;
    const htmlNext = `
      <button data-goto ="${
        this._currentPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${this._currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;

    const htmlPrev = `
      <button data-goto ="${
        this._currentPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._currentPage - 1}</span>
      </button>
    `;

    if (pos === -1) return htmlPrev;
    else if (pos === 0) return htmlNext + htmlPrev;
    else return htmlNext;
  }

  _generateMarkup() {
    this._currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (this._currentPage === 1 && numPages > 1)
      return this._generateButtonHtml(1);

    // Last page
    if (this._currentPage === numPages && numPages > 1)
      return this._generateButtonHtml(-1);

    // An in-between page
    if (this._currentPage < numPages) return this._generateButtonHtml(0);

    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();
