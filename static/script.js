// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Initial load of table data
  loadTableData();

  // Set event listeners for Save and Cancel buttons
  document.getElementById('saveBtn').addEventListener('click', saveChanges);
  document.getElementById('cancelBtn').addEventListener('click', cancelChanges);

  // Load table data from the Flask /data endpoint
  function loadTableData() {
    fetch('/data')
      .then(response => response.json())
      .then(data => {
        populateTable(data);
      })
      .catch(error => console.error('Error loading data:', error));
  }

  // Populate the table using the fetched data.
  // Note: The first data cell (col1) is used for the index and is auto‑updated.
  function populateTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear any existing rows
    data.forEach((rowData, i) => {
      const row = document.createElement('tr');

      // Create the drag handle cell
      const dragCell = document.createElement('td');
      dragCell.classList.add('drag-handle');
      dragCell.setAttribute('draggable', 'true');
      dragCell.textContent = '☰';
      row.appendChild(dragCell);

      // Create 12 editable cells (col1 to col12)
      // Here, we override col1 with the current row index.
      for (let j = 1; j <= 12; j++) {
        const cell = document.createElement('td');
        cell.setAttribute('contenteditable', 'true');
        if (j === 1) {
          cell.textContent = i + 1;
        } else {
          cell.textContent = rowData['col' + j] || '';
        }
        // Add an input event listener to mark the row as modified.
        cell.addEventListener('input', function() {
          row.classList.add('modified');
        });
        row.appendChild(cell);
      }

      // Attach drag & drop events to the row
      row.addEventListener('dragover', dragOver);
      row.addEventListener('dragleave', dragLeave);
      row.addEventListener('drop', drop);

      tableBody.appendChild(row);
    });

    // Attach drag events for each drag handle
    document.querySelectorAll('.drag-handle').forEach(handle => {
      handle.addEventListener('dragstart', dragStart);
      handle.addEventListener('dragend', dragEnd);
    });
  }

  let draggedRow = null;

  function dragStart(e) {
    draggedRow = this.parentNode; // The row being dragged
    e.dataTransfer.effectAllowed = 'move';
  }

  function dragEnd(e) {
    draggedRow = null;
    clearDragOver();
  }

  function dragOver(e) {
    e.preventDefault(); // Allow dropping
    this.classList.add('drag-over');
  }

  function dragLeave(e) {
    this.classList.remove('drag-over');
  }

  function drop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    if (draggedRow && draggedRow !== this) {
      // Decide whether to insert above or below the target row
      const rect = this.getBoundingClientRect();
      const offset = e.clientY - rect.top;
      if (offset < rect.height / 2) {
        this.parentNode.insertBefore(draggedRow, this);
      } else {
        this.parentNode.insertBefore(draggedRow, this.nextSibling);
      }
      // After moving the row, update the index column for all rows.
      updateIndices();
    }
  }

  function clearDragOver() {
    document.querySelectorAll('tr').forEach(row => {
      row.classList.remove('drag-over');
    });
  }

  // Update the index column (second cell of each row) with the new order.
  function updateIndices() {
    const rows = document.querySelectorAll('#tableBody tr');
    rows.forEach((row, index) => {
      // row.cells[0] is the drag handle; row.cells[1] is the index column.
      const indexCell = row.cells[1];
      if (indexCell) {
        indexCell.textContent = index + 1;
      }
    });
  }

  // Save changes: collect data from table and send to the server.
  function saveChanges() {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');
    const newData = [];
    rows.forEach(row => {
      let rowObj = {};
      // Note: row.cells[0] is the drag handle.
      // row.cells[1] corresponds to col1 (the index), row.cells[2] to col2, etc.
      for (let i = 1; i <= 12; i++) {
        rowObj['col' + i] = row.cells[i].textContent;
      }
      newData.push(rowObj);
      // Remove the modified class after saving
      row.classList.remove('modified');
    });
    
    fetch('/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    })
    .then(response => response.json())
    .then(result => {
      if(result.status !== 'success'){
        alert("Error saving data: " + result.message);
      }
    })
    .catch(error => {
      alert("Error: " + error);
    });
  }

  // Cancel changes: reload the original data from the server.
  function cancelChanges() {
    loadTableData();
  }
});
