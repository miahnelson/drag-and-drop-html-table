document.addEventListener('DOMContentLoaded', function() {
  // --- Column Preferences ---
  // Define default columns (order and visibility).
  const defaultColumns = [
    {name: "Index", visible: true},
    {name: "Name", visible: true},
    {name: "Email", visible: true},
    {name: "Address", visible: true},
    {name: "City", visible: true},
    {name: "State", visible: true},
    {name: "Zip", visible: true},
    {name: "Country", visible: true},
    {name: "Phone", visible: true},
    {name: "Company", visible: true},
    {name: "Position", visible: true},
    {name: "Notes", visible: true}
  ];

  let columnsPref = loadColumnPreferences();
  if (!columnsPref) {
    columnsPref = defaultColumns;
    saveColumnPreferences(columnsPref);
  }

  // --- DOM Element References ---
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');
  const bulkEditSelect = document.getElementById('bulkColumn');
  const columnPrefsBtn = document.getElementById('columnPrefsBtn');
  const columnPrefsModal = document.getElementById('columnPrefsModal');
  const closeModalSpan = document.querySelector('#columnPrefsModal .close');
  const savePrefsBtn = document.getElementById('savePrefsBtn');
  const cancelPrefsBtn = document.getElementById('cancelPrefsBtn');
  const columnPrefsList = document.getElementById('columnPrefsList');

  // --- Build Table Header based on column preferences ---
  function buildTableHeader() {
    tableHeader.innerHTML = '';
    const headerRow = document.createElement('tr');
    // Fixed first two columns: Drag and Select
    const thDrag = document.createElement('th');
    thDrag.textContent = 'Drag';
    headerRow.appendChild(thDrag);
    const thSelect = document.createElement('th');
    thSelect.textContent = 'Select';
    headerRow.appendChild(thSelect);
    // Data columns (only those marked visible) in order per preferences
    columnsPref.forEach(col => {
      if (col.visible) {
        const th = document.createElement('th');
        th.textContent = col.name;
        headerRow.appendChild(th);
      }
    });
    tableHeader.appendChild(headerRow);
  }

  // --- Populate Table Body ---
  function populateTable() {
    fetch('/data')
      .then(response => response.json())
      .then(data => {
        tableBody.innerHTML = '';
        data.forEach((rowData, i) => {
          const row = document.createElement('tr');
          // Cell 0: Drag handle
          const tdDrag = document.createElement('td');
          tdDrag.classList.add('drag-handle');
          tdDrag.setAttribute('draggable', 'true');
          tdDrag.textContent = '☰';
          row.appendChild(tdDrag);
          // Cell 1: Selection checkbox
          const tdSelect = document.createElement('td');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          tdSelect.appendChild(checkbox);
          row.appendChild(tdSelect);
          // Data columns based on column preferences (only visible ones)
          columnsPref.forEach(col => {
            const cell = document.createElement('td');
            cell.setAttribute('contenteditable', 'true');
            if (col.name === "Index") {
              // Always override with current row order; updateIndices() will fix this.
              cell.textContent = i + 1;
            } else {
              cell.textContent = rowData[col.name] || '';
            }
            cell.addEventListener('input', function() {
              row.classList.add('modified');
            });
            row.appendChild(cell);
          });
          // Attach row drag & drop events
          row.addEventListener('dragover', dragOver);
          row.addEventListener('dragleave', dragLeave);
          row.addEventListener('drop', drop);
          tableBody.appendChild(row);
        });
        attachRowDragEvents();
        updateIndices();
      })
      .catch(error => console.error('Error loading data:', error));
  }

  function attachRowDragEvents() {
    document.querySelectorAll('.drag-handle').forEach(handle => {
      handle.addEventListener('dragstart', dragStart);
      handle.addEventListener('dragend', dragEnd);
    });
  }

  // --- Drag & Drop for Table Rows ---
  let draggedRow = null;
  function dragStart(e) {
    draggedRow = this.parentNode;
    e.dataTransfer.effectAllowed = 'move';
  }
  function dragEnd(e) {
    draggedRow = null;
    clearDragOver();
  }
  function dragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  }
  function dragLeave(e) {
    this.classList.remove('drag-over');
  }
  function drop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    if (draggedRow && draggedRow !== this) {
      const rect = this.getBoundingClientRect();
      const offset = e.clientY - rect.top;
      if (offset < rect.height / 2) {
        this.parentNode.insertBefore(draggedRow, this);
      } else {
        this.parentNode.insertBefore(draggedRow, this.nextSibling);
      }
      updateIndices();
    }
  }
  function clearDragOver() {
    document.querySelectorAll('tr').forEach(row => row.classList.remove('drag-over'));
  }

  // --- Update Index Column ---
  function updateIndices() {
    // Determine position (cell index) of "Index" column among visible columns.
    let visibleIndex = 0;
    columnsPref.forEach(col => {
      if (col.visible && col.name === "Index") {
        // visibleIndex is the zero-based position among visible columns.
      } else if (col.visible) {
        visibleIndex++;
      }
    });
    // Alternatively, scan visible columns:
    const visibleCols = columnsPref.filter(col => col.visible);
    const indexPos = visibleCols.findIndex(col => col.name === "Index");
    if (indexPos === -1) return;
    // The data cells start at offset 2 (after drag and select).
    const targetCellIndex = indexPos + 2;
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      const cell = row.cells[targetCellIndex];
      if (cell) {
        cell.textContent = i + 1;
      }
    });
  }

  // --- Save and Cancel Table Changes ---
  function saveChanges() {
    const rows = tableBody.querySelectorAll('tr');
    const newData = [];
    rows.forEach(row => {
      let rowObj = {};
      // Data cells start at index 2.
      let cellIndex = 2;
      columnsPref.forEach(col => {
        if (col.visible) {
          rowObj[col.name] = row.cells[cellIndex].textContent;
          cellIndex++;
        }
      });
      newData.push(rowObj);
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
    .catch(error => alert("Error: " + error));
  }
  function cancelChanges() {
    populateTable();
  }

  // --- Bulk Edit ---
  function applyBulkEdit() {
    const bulkKey = document.getElementById('bulkColumn').value;
    const bulkValue = document.getElementById('bulkValue').value;
    // Find the cell index for bulkKey in the visible columns
    const visibleCols = columnsPref.filter(col => col.visible);
    const colIndex = visibleCols.findIndex(col => col.name === bulkKey);
    if (colIndex < 0) return;
    const targetCellIndex = colIndex + 2; // offset for drag and select cells
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
      const checkbox = row.cells[1].querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        row.cells[targetCellIndex].textContent = bulkValue;
        row.classList.add('modified');
      }
    });
  }

  // --- Column Preferences Modal ---
  columnPrefsBtn.addEventListener('click', openColumnPrefsModal);
  closeModalSpan.addEventListener('click', closeColumnPrefsModal);
  cancelPrefsBtn.addEventListener('click', closeColumnPrefsModal);
  savePrefsBtn.addEventListener('click', function() {
    // Read new preferences from the modal list
    const newPrefs = [];
    const items = columnPrefsList.querySelectorAll('li');
    items.forEach(item => {
      const colName = item.getAttribute('data-col');
      const visible = item.querySelector('input[type="checkbox"]').checked;
      newPrefs.push({ name: colName, visible: visible });
    });
    columnsPref = newPrefs;
    saveColumnPreferences(columnsPref);
    buildTableHeader();
    populateTable();
    closeColumnPrefsModal();
  });

  function openColumnPrefsModal() {
    // Build modal list from current columnsPref
    columnPrefsList.innerHTML = '';
    columnsPref.forEach(col => {
      const li = document.createElement('li');
      li.classList.add('pref-item');
      li.setAttribute('draggable', 'true');
      li.setAttribute('data-col', col.name);
      // Checkbox for visibility
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = col.visible;
      li.appendChild(checkbox);
      // Label for column name
      const label = document.createElement('span');
      label.textContent = col.name;
      li.appendChild(label);
      // Drag handle indicator
      const dragIndicator = document.createElement('span');
      dragIndicator.textContent = ' ☰';
      li.appendChild(dragIndicator);
      columnPrefsList.appendChild(li);
    });
    addModalDragAndDrop();
    columnPrefsModal.style.display = 'block';
  }

  function closeColumnPrefsModal() {
    columnPrefsModal.style.display = 'none';
  }

  // Enable simple drag & drop reordering in the modal list
  function addModalDragAndDrop() {
    let draggedItem = null;
    columnPrefsList.querySelectorAll('li').forEach(item => {
      item.addEventListener('dragstart', function(e) {
        draggedItem = this;
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragover', function(e) {
        e.preventDefault();
      });
      item.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedItem && draggedItem !== this) {
          const items = Array.from(columnPrefsList.children);
          const draggedIndex = items.indexOf(draggedItem);
          const targetIndex = items.indexOf(this);
          if (draggedIndex < targetIndex) {
            columnPrefsList.insertBefore(draggedItem, this.nextSibling);
          } else {
            columnPrefsList.insertBefore(draggedItem, this);
          }
        }
      });
    });
  }

  // --- Local Storage Helpers ---
  function loadColumnPreferences() {
    const prefs = localStorage.getItem('columnPreferences');
    if (prefs) return JSON.parse(prefs);
    return null;
  }
  function saveColumnPreferences(prefs) {
    localStorage.setItem('columnPreferences', JSON.stringify(prefs));
  }

  // --- Main Control Event Listeners ---
  document.getElementById('saveBtn').addEventListener('click', saveChanges);
  document.getElementById('cancelBtn').addEventListener('click', cancelChanges);
  document.getElementById('applyBulkEditBtn').addEventListener('click', applyBulkEdit);

  // --- Initial Build ---
  buildTableHeader();
  populateTable();
});
