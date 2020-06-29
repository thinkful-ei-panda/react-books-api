let bookmarks = [];
let adding = false;
let error = {};
let filter = 0;
let editing = false;


function ratingFilter(filter) {
  let filteredItems = this.bookmarks.filter(item => item.rating >= filter);
  return filteredItems;
}

function expand(id) {
  return this.bookmarks.find(item => item.id === id).expanded = true;
}

function collapse(id) {
  return this.bookmarks.find(item => item.id === id).expanded = false;
}

function findById(id) {
  return this.bookmarks.find(currentItem => currentItem.id === id);
}

function findAndDelete(id) {
  return this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
}

function findAndUpdate(id, newFormData) {
  const currentItem = this.findById(id);
  let obj = JSON.parse(newFormData);
  Object.assign(currentItem, obj);
}

function addItem(newItem) {
  !newItem.expanded;
  !newItem.editing;
  this.bookmarks.push(newItem);
}

function setError(error) {
  this.error = error;
}

export default {
  bookmarks,
  adding,
  editing,
  error,
  filter,
  findById,
  findAndDelete,
  findAndUpdate,
  addItem,
  setError,
  expand,
  collapse,
  ratingFilter
};