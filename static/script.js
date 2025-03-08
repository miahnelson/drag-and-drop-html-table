document.addEventListener('DOMContentLoaded', function() {
  // --- Column Preferences ---
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

  // --- Build Table Header ---
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
    // Data columns: Force "Index" visible even if deselected
    columnsPref.forEach(col => {
      if (col.visible || col.name === "Index") {
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
          // Data cells: only for columns where visible === true, or "Index"
          columnsPref.forEach(col => {
            if (col.visible || col.name === "Index") {
              const cell = document.createElement('td');
              cell.setAttribute('contenteditable', 'true');
              if (col.name === "Index") {
                // Override with current row order; updateIndices() will refresh this.
                cell.textContent = i + 1;
              } else {
                cell.textContent = rowData[col.name] || '';
              }
              cell.addEventListener('input', function() {
                row.classList.add('modified');
              });
              row.appendChild(cell);
            }
          });
          // Attach drag & drop events to the row
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

  // --- Update the "Index" Column ---
  function updateIndices() {
    // Determine the visible order of columns and locate "Index"
    const visibleCols = columnsPref.filter(col => col.visible || col.name === "Index");
    const indexPos = visibleCols.findIndex(col => col.name === "Index");
    if (indexPos === -1) return;
    // Data cells start at offset 2 (after drag and select)
    const targetCellIndex = indexPos + 2;
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      const cell = row.cells[targetCellIndex];
      if (cell) {
        cell.textContent = i + 1;
      }
    });
  }

  // --- Save and Cancel Changes ---
  function saveChanges() {
    const rows = tableBody.querySelectorAll('tr');
    const newData = [];
    rows.forEach(row => {
      let rowObj = {};
      let cellIndex = 2; // Data cells start after drag and select
      columnsPref.forEach(col => {
        if (col.visible || col.name === "Index") {
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
    // Find the target cell index among visible columns
    const visibleCols = columnsPref.filter(col => col.visible || col.name === "Index");
    const colIndex = visibleCols.findIndex(col => col.name === bulkKey);
    if (colIndex < 0) return;
    const targetCellIndex = colIndex + 2; // Offset for drag and select cells
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
    const newPrefs = [];
    const items = columnPrefsList.querySelectorAll('li');
    items.forEach(item => {
      const colName = item.getAttribute('data-col');
      const visible = item.querySelector('input[type="checkbox"]').checked;
      newPrefs.push({ name: colName, visible: visible });
    });
    // Force "Index" to always be visible.
    newPrefs.forEach(pref => {
      if (pref.name === "Index") pref.visible = true;
    });
    columnsPref = newPrefs;
    saveColumnPreferences(columnsPref);
    buildTableHeader();
    populateTable();
    closeColumnPrefsModal();
  });

  function openColumnPrefsModal() {
    columnPrefsList.innerHTML = '';
    columnsPref.forEach(col => {
      const li = document.createElement('li');
      li.classList.add('pref-item');
      li.setAttribute('draggable', 'true');
      li.setAttribute('data-col', col.name);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      if (col.name === "Index") {
        checkbox.checked = true;
        checkbox.disabled = true;
      } else {
        checkbox.checked = col.visible;
      }
      li.appendChild(checkbox);
      const label = document.createElement('span');
      label.textContent = col.name;
      li.appendChild(label);
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
    return prefs ? JSON.parse(prefs) : null;
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
