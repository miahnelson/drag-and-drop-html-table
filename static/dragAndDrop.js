// dragAndDrop.js

// Global references to the data array and the display function
let allDataRef = null;
let displayPageRef = null;

// This function is called once in your main script to provide references
function initDragAndDrop(dataArray, displayFn) {
  allDataRef = dataArray;
  displayPageRef = displayFn;
}

// Attaches the dragstart/dragend events to .drag-handle elements
function attachRowDragEvents() {
  document.querySelectorAll('.drag-handle').forEach(handle => {
    handle.addEventListener('dragstart', dragStart);
    handle.addEventListener('dragend', dragEnd);
  });
}

// The row being dragged
let draggedRowElement = null;

function dragStart(e) {
  draggedRowElement = this.parentNode; // The <tr>
  e.dataTransfer.effectAllowed = 'move';
}

function dragEnd() {
  draggedRowElement = null;
  clearDragOver();
}

function dragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

// drop(e, rowData) is triggered from your main script's row creation
// We rely on row.dataset.indexVal (a numeric index) to reorder allData.
function drop(e, targetRowObj) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!draggedRowElement || draggedRowElement === e.currentTarget) return;

  // Identify the numeric "Index" of the dragged row
  const draggedIndexNum = parseInt(draggedRowElement.dataset.indexVal, 10);
  // Identify the numeric "Index" of the target row
  const targetIndexNum = parseInt(e.currentTarget.dataset.indexVal, 10);

  // Find their positions in the global data array by matching x.Index
  const draggedObjPos = allDataRef.findIndex(x => x.Index === draggedIndexNum);
  const targetObjPos = allDataRef.findIndex(x => x.Index === targetIndexNum);

  if (draggedObjPos < 0 || targetObjPos < 0) {
    console.error("Dragged or target object not found in allData (using 'Index')");
    return;
  }

  // Decide whether to drop above or below
  const rect = e.currentTarget.getBoundingClientRect();
  const offset = e.clientY - rect.top;
  const dropAbove = offset < rect.height / 2;

  // Remove the dragged object from its old position
  const [draggedObj] = allDataRef.splice(draggedObjPos, 1);

  // Calculate the new position
  let insertPos = dropAbove ? targetObjPos : targetObjPos + 1;
  if (draggedObjPos < targetObjPos) {
    insertPos--;
  }
  if (insertPos < 0) insertPos = 0;
  if (insertPos > allDataRef.length) insertPos = allDataRef.length;

  // Insert the dragged object at the new position
  allDataRef.splice(insertPos, 0, draggedObj);

  // Redisplay the table using the function from the main script
  displayPageRef();
}

function clearDragOver() {
  document.querySelectorAll('tr').forEach(row => row.classList.remove('drag-over'));
}

// Expose these functions to the global scope
window.initDragAndDrop = initDragAndDrop;
window.attachRowDragEvents = attachRowDragEvents;
window.dragOver = dragOver;
window.dragLeave = dragLeave;
window.drop = drop;
