import api from "./api.js";
import store from "./store.js";
import bookmarks from "./bookmarks.js";

function main() {
  api.getBookmarks().then((items) => {
    items.forEach((item) => store.addItem(item));
    bookmarks.render();
    bookmarks.renderError();
  });
  bookmarks.render();
  bookmarks.renderError();
}

$(main);
