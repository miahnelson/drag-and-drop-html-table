// dragAndDrop.js

// Global references to data & display function
let allDataRef = null;
let displayPageRef = null;

/**
 * Called once from script.js after data is loaded.
 * @param {Array} dataArray - reference to allData
 * @param {Function} displayFn - reference to displayPage
 */
function initDragAndDrop(dataArray, displayFn) {
  allDataRef = dataArray;
  displayPageRef = displayFn;
}

/**
 * Attach dragstart/dragend to .drag-handle elements
 */
function attachRowDragEvents() {
  document.querySelectorAll('.drag-handle').forEach(handle => {
    handle.addEventListener('dragstart', dragStart);
    handle.addEventListener('dragend', dragEnd);
  });
}

// The row being dragged
let draggedRowElement = null;

function dragStart(e) {
  draggedRowElement = this.parentNode;
  e.dataTransfer.effectAllowed = 'move';
}

function dragEnd() {
  draggedRowElement = null;
  clearDragOver();
}

/**
 * Auto-scroll the page if the mouse is near the top or bottom edge
 * @param {DragEvent} e
 */
function autoScroll(e) {
  const scrollThreshold = 50;        // distance from top/bottom edge
  const scrollSpeed = 8;            // how many pixels to scroll each event

  // Current mouse Y position relative to the viewport
  const mouseY = e.clientY;
  const viewportHeight = window.innerHeight;

  // If near the top, scroll up
  if (mouseY < scrollThreshold) {
    window.scrollBy(0, -scrollSpeed);
  }
  // If near the bottom, scroll down
  else if (mouseY > viewportHeight - scrollThreshold) {
    window.scrollBy(0, scrollSpeed);
  }
}

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');

  // Attempt to auto-scroll if near top/bottom
  autoScroll(e);
}

function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

/**
 * drop(e, rowData) is triggered from script.js.
 * We reorder allDataRef by matching x.Index to row.dataset.indexVal
 */
function drop(e, targetRowObj) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!draggedRowElement || draggedRowElement === e.currentTarget) return;

  // Read the numeric "Index" from dataset
  const draggedIndexNum = parseInt(draggedRowElement.dataset.indexVal, 10);
  const targetIndexNum = parseInt(e.currentTarget.dataset.indexVal, 10);

  // Find their positions in the global data array by matching x.Index
  const draggedObjPos = allDataRef.findIndex(x => x.Index === draggedIndexNum);
  const targetObjPos = allDataRef.findIndex(x => x.Index === targetIndexNum);

  if (draggedObjPos < 0 || targetObjPos < 0) {
    console.error("Dragged or target object not found in allData");
    return;
  }

  // Decide whether to drop above or below
  const rect = e.currentTarget.getBoundingClientRect();
  const offset = e.clientY - rect.top;
  const dropAbove = offset < rect.height / 2;

  const [draggedObj] = allDataRef.splice(draggedObjPos, 1);
  let insertPos = dropAbove ? targetObjPos : targetObjPos + 1;
  if (draggedObjPos < targetObjPos) {
    insertPos--;
  }
  if (insertPos < 0) insertPos = 0;
  if (insertPos > allDataRef.length) insertPos = allDataRef.length;

  allDataRef.splice(insertPos, 0, draggedObj);

  // Redisplay
  displayPageRef();
}

function clearDragOver() {
  document.querySelectorAll('tr').forEach(row => row.classList.remove('drag-over'));
}

// Expose globally
window.initDragAndDrop = initDragAndDrop;
window.attachRowDragEvents = attachRowDragEvents;
window.dragOver = dragOver;
window.dragLeave = dragLeave;
window.drop = drop;
