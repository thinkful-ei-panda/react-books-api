/* eslint-disable quotes */
import store from "./store.js";
import api from "./api.js";

function render(id, expand) {
  renderError();

  if (store.adding) {
    $("main").html(generateAddBookmarkView());
    let view = "adding";
    generateCodeBlock(view);
  } else if (store.filter !== 0 && !id) {
    let html = [
      generateInitialView(),
      generateFilteredResults(store.filter),
    ].join("");
    $("main").html(html);
    let view = "filter";
    generateCodeBlock(view);
  } else if (store.editing) {
    let html = generateEditView(id);
    $("main").html(html);
    let view = "editing";
    generateCodeBlock(view);
  } else if (expand !== undefined) {
    let html = generateExpandedView(id, expand);
    $(expand).html(html);
    let view = "expanded";
    generateCodeBlock(view);
  } else {
    let html = [generateInitialView(), generateItem()].join("");
    $("main").html(html);
    let view = "initial";
    generateCodeBlock(view);
  }
}

function renderError() {
  if (store.error.code) {
    $("div.error-container").html(`${store.error.message}`);
    let view = "error";
    generateCodeBlock(view);
  } else {
    $("div.error-container").empty();
  }
}

function generateAddBookmarkView() {
  return `<div class="error-container"></div>
    <div class="title-container">
      <h1>My Bookmarks</h1>
    </div>
    <div class="url-and-title">
    <form id="new-bookmark-form" action="#">
      <label for="new-bookmark-input">Website Address</label>
        <input type="url" id="new-bookmark-input" class="new-bookmark" name="url" placeholder="URL" 
        required>
      <label for="new-bookmark-title">Website Name</label>
        <input type="text" id="new-bookmark-title" class="new-bookmark" name="title" placeholder="Site Name" required>
        <div class="description-container">
        <input type="text" id="new-bookmark-description" class="new-bookmark" name="desc" placeholder="Brief website description (optional)">
      </div>  
        <select name="rating" class="rating-select">
        <option value="1">&hearts;+</option>
        <option value="2">&hearts;&hearts;+</option>
        <option value="3">&hearts;&hearts;&hearts;+</option>
        <option value="4">&hearts;&hearts;&hearts;&hearts;+</option>
        <option value="5">&hearts;&hearts;&hearts;&hearts;&hearts;</option>
    </div>
        </select>
        <button class="pure-button" type="submit" id="add-new-bookmark">Add Bookmark</button>
      <button class="pure-button" id="cancel-new-bookmark" type="reset">Cancel</button>
      </form>`;
}

function generateItem() {
  const htmlArr = ['<ul class="bookmark-list">'];
  let itemArr = store.bookmarks;
  for (let i = 0; i < itemArr.length; i++) {
    htmlArr.push(`<li class="bookmark-data"  data-item-id="${itemArr[i].id}">
      ${itemArr[i].title} 
      <div class="star-rating">
      <form id="${itemArr[i].id}">
      ${generateRatings(itemArr[i].id)}
      </form><button class="delete-bookmark-button" class="pure-button">Delete</button></div>
      </li>`);
  }
  htmlArr.push("</ul>");
  return htmlArr.join(" ");
}

function generateFilteredResults(filter) {
  const htmlArr = ['<ul class="bookmark-list">'];
  let itemArr = store.ratingFilter(filter);
  for (let i = 0; i < itemArr.length; i++) {
    htmlArr.push(`<li class="bookmark-data"  data-item-id="${itemArr[i].id}">
      ${itemArr[i].title} 
      <div class="star-rating"><form id="${itemArr[i].id}">
      ${generateRatings(itemArr[i].id)}
    </form><button class="delete-bookmark-button">Delete</button></div>
    </li>`);
  }
  htmlArr.push("</ul>");
  return htmlArr.join("");
}

function generateExpandedView(id, expand) {
  let item = store.findById(id);

  if (item.expanded === true) {
    store.collapse(id);
    $(expand).find(".expanded-bookmark-data").remove();
    return `${item.title} 
      <div class="star-rating"><form id="${item.id}">
      ${generateRatings(id)}
      </form><button class="delete-bookmark-button">Delete</button></div>`;
  } else {
    store.expand(id);

    return `<li class="expanded-bookmark-data"  data-item-id="${item.id}">
      ${item.title}   
      <div class="star-rating"><form id="${item.id}">
      ${generateRatings(id)}
      </form></div>  
      <div class="description-container">
        ${item.desc}
      <a class="link" href ="${item.url}">Visit Website</a></div>
      <button class="delete-bookmark-button">Delete</button> <button id="edit-bookmark">Edit</button>
      </li>`;
  }
}

function generateRatings(id) {
  let arr = [];
  let item = store.findById(id);
  let rating = [item.rating];

  for (let i = 0; i < 5; i++) {
    arr.push(`<input type="checkbox" name="rating" value="${i}"
    ${rating > i ? "checked" : ""}></input>`);
  }

  return arr.join(" ");
}

function generateEditView(id) {
  let item = store.findById(id);
  return `
  <div class="error-container"></div><div class="title-container">
    <h1>Bookmarks App</h1>
  </div>
  <div class="url-and-title">
    <form class="edit-bookmark-form" data-item-id="${item.id}" action="#">
      <label for="new-bookmark-input">Website Address</label>
        <input type="url" id="new-bookmark-input" class="edit-bookmark" name="url" value="${item.url}" 
        required>
      <label for="new-bookmark-title">Website Name</label>
        <input type="text" id="new-bookmark-title" class="edit-bookmark" name="title" value="${item.title}" required>
      <select name="rating" class="rating-select">
        <option value="1">&hearts;+</option>
        <option value="2">&hearts;&hearts;+</option>
        <option value="3">&hearts;&hearts;&hearts;+</option>
        <option value="4">&hearts;&hearts;&hearts;&hearts;+</option>
        <option value="5">&hearts;&hearts;&hearts;&hearts;&hearts;</option>
  </div>
      </select>
      <div class="description-container">
        <input type="text" id="new-bookmark-description" class="new-bookmark" name="desc" placeholder="Brief website description (optional)" required>
      </div>  
      <button type="submit" id="edit-bookmark-submit">Make Changes</button>
      <button id="cancel-edit" type="reset">Cancel</button>
    </form>`;
}

function generateCodeBlock(view) {
  if (view === "initial") {
    $("code").html(`inital store state
    let bookmarks = [];
    let adding = false;
    let error = {};
    let filter = 0;
    let editing = false;`);
  }

  if (view === "expanded") {
    $("code").html(`'expanded view store state'
      const bookmarks = [
        {
          id: 'x56w',
          title: 'Title 1',
          rating: 3,
          url: 'http://www.title1.com',
          description: 'lorem ipsum dolor sit',
          expanded: true
        }
      ];
      let adding = false;
      let error = null;
      let filter = 0;
      let editing = false;`);
  }

  if (view === "adding") {
    $("code").html(`'add bookmark view store state'
      const bookmarks = [. . .];
      let adding = true;
      let error = null;
      let filter = 0;
      let editing = false;`);
  }

  if (view === "editing") {
    $("code").html(`'edit bookmark view store state'
      const bookmarks = [. . .];
      let adding = false;
      let error = null;
      let filter = 0;
      let editing = true;`);
  }

  if (view === "filter") {
    $("code").html(`'filter bookmark view store state'
      const bookmarks = [. . .];
      let adding = false;
      let error = null;
      let filter = ${store.filter};
      let editing = false;`);
  }

  if (view === "error") {
    $("code").html(`'edit bookmark view store state'
      const bookmarks = [. . .];
      let adding = false;
      let error = ${store.error.message};
      let filter = 0;
      let editing = false;`);
  }
}

function generateInitialView() {
  return `
  <div class="error-container"></div>
  <div class="title-container">
    <h1>My Bookmarks</h1>
  </div>
      <div class="title-button-container">
        <button class="new-bookmark-button" id="new-bookmark">New Bookmark </button>
        <select name="filter-bookmark" class="filter-select">
        <option value="0">Filtered By &hearts;</option>
        <option value="1">&hearts;+</option>
        <option value="2"&hearts;&hearts;+</option>
        <option value="3">&hearts;&hearts;&hearts;+</option>
        <option value="4">&hearts;&hearts;&hearts;&hearts;+</option>
        <option value="5">&hearts;&hearts;&hearts;&hearts;&hearts;</option>
      </select>
  </div>`;
}

function handleNewBookmark() {
  $("main").on("click", "#new-bookmark", (event) => {
    store.adding = true;
    render();
  });
}

function handleFilterSelect() {
  $("main").on("change", ".filter-select", (event) => {
    store.filter = $(".filter-select").val();
    render();
  });
}

function serializeJson(form) {
  const formData = new FormData(form);
  const obj = {};
  formData.forEach((val, name) => (obj[name] = val));
  return JSON.stringify(obj);
}

function handleCreateBook() {
  $("main").on("submit", "#new-bookmark-form", (event) => {
    event.preventDefault();

    let formElement = document.querySelector("#new-bookmark-form");
    const myFormData = serializeJson(formElement);

    api.createBookmark(myFormData).then((newItem) => {
      store.addItem(newItem);
      render();
    });
    store.adding = false;
  });
}

function handleCancelCreate() {
  $("main").on("click", "#cancel-new-bookmark", (event) => {
    event.preventDefault();
    store.adding = false;
    render();
  });
}

function handleDeleteBook() {
  $("main").on("click", ".delete-bookmark-button", (event) => {
    event.preventDefault();

    const id = getBookId(event.currentTarget);
    api.deleteBookmark(id).then(() => {
      store.findAndDelete(id);
      render();
    });
  });
}

function handleEditButton() {
  $("main").on("click", "#edit-bookmark", (event) => {
    event.preventDefault();

    const id = getBookId(event.currentTarget);
    store.editing = true;
    store.collapse(id);
    render(id);
  });
}

function handleCancelEdit() {
  $("main").on("click", "#cancel-edit", (event) => {
    event.preventDefault();

    store.editing = false;
    render();
  });
}

function handleClickLink() {
  $("main").on("click", ".link", (event) => {
    event.preventDefault();

    let link = $(event.currentTarget);
    window.open(link.attr("href"), event.currentTarget);
  });
}

function handleSubmitEdit() {
  $("main").on("submit", ".edit-bookmark-form", (event) => {
    event.preventDefault();

    const id = $(event.currentTarget).data("item-id");
    let formElement = document.querySelector(".edit-bookmark-form");
    const newFormData = serializeJson(formElement);

    api.updateBookmark(id, newFormData).then(() => {
      store.findAndUpdate(id, newFormData);
      render();
    });
    store.editing = false;
  });
}

function handleExpandView() {
  $("main").on("click", ".bookmark-data", (event) => {
    event.preventDefault();

    const id = getBookId(event.currentTarget);
    let item = event.currentTarget;
    render(id, item);
  });
}

function getBookId(item) {
  return $(item).closest(".bookmark-data").data("item-id");
}

function bindEventListeners() {
  handleCancelCreate();
  handleCreateBook();
  handleNewBookmark();
  handleDeleteBook();
  handleFilterSelect();
  handleExpandView();
  handleEditButton();
  handleCancelEdit();
  handleSubmitEdit();
  handleClickLink();
  render();
}

$(bindEventListeners);

export default {
  render,
  renderError,
  bindEventListeners,
};
