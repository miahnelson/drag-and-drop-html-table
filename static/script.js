// script.js
document.addEventListener('DOMContentLoaded', function() {
  // ------------------------------------------------
  // 1) STATE: Data, Pagination, Columns, Search
  // ------------------------------------------------
  let allData = [];           // All rows loaded from /data
  let currentPage = 1;        // Current page
  let rowsPerPage = 20;       // Default rows per page
  let searchString = "";      // Current text filter

  // Column preferences (Index is always forced visible)
  const defaultColumns = [
    { name: "Index", visible: true },
    { name: "Name", visible: true },
    { name: "Email", visible: true },
    { name: "Address", visible: true },
    { name: "City", visible: true },
    { name: "State", visible: true },
    { name: "Zip", visible: true },
    { name: "Country", visible: true },
    { name: "Phone", visible: true },
    { name: "Company", visible: true },
    { name: "Position", visible: true },
    { name: "Notes", visible: true }
  ];
  let columnsPref = loadColumnPreferences() || defaultColumns;

  // ------------------------------------------------
  // 2) DOM REFERENCES
  // ------------------------------------------------
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');

  // Pagination & Search
  const searchInput = document.getElementById('searchInput');
  const rowsPerPageSelect = document.getElementById('rowsPerPageSelect');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageInfo = document.getElementById('pageInfo');

  // Column prefs modal
  const columnPrefsBtn = document.getElementById('columnPrefsBtn');
  const columnPrefsModal = document.getElementById('columnPrefsModal');
  const closeModalSpan = columnPrefsModal.querySelector('.close');
  const savePrefsBtn = document.getElementById('savePrefsBtn');
  const cancelPrefsBtn = document.getElementById('cancelPrefsBtn');
  const columnPrefsList = document.getElementById('columnPrefsList');

  // Save & Cancel
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // ------------------------------------------------
  // 3) BUILD TABLE HEADER
  // ------------------------------------------------
  function buildTableHeader() {
    tableHeader.innerHTML = '';
    const headerRow = document.createElement('tr');

    // Cell 0: Drag
    const thDrag = document.createElement('th');
    thDrag.textContent = 'Drag';
    headerRow.appendChild(thDrag);

    // Cell 1: Select
    const thSelect = document.createElement('th');
    thSelect.textContent = 'Select';
    headerRow.appendChild(thSelect);

    // Cell 2: Actions
    const thActions = document.createElement('th');
    thActions.textContent = 'Actions';
    headerRow.appendChild(thActions);

    // Cells 3+: data columns
    columnsPref.forEach(col => {
      if (col.visible || col.name === "Index") {
        const th = document.createElement('th');
        th.textContent = col.name;

        // Right-click -> Bulk Edit
        th.addEventListener('contextmenu', function(e) {
          e.preventDefault();
          const newValue = prompt(`Enter new value for '${col.name}' (bulk edit):`);
          if (newValue !== null) {
            applyBulkEditToColumn(col, newValue);
          }
        });

        headerRow.appendChild(th);
      }
    });

    tableHeader.appendChild(headerRow);
  }

  // ------------------------------------------------
  // 4) RIGHT-CLICK BULK EDIT
  // ------------------------------------------------
  function applyBulkEditToColumn(col, newValue) {
    // Find the cell index for this column among visible columns
    const visibleCols = columnsPref.filter(c => c.visible || c.name === "Index");
    const colIndex = visibleCols.findIndex(c => c.name === col.name);
    if (colIndex < 0) return;
    // Data columns start at cell 3 (after Drag=0, Select=1, Actions=2)
    const targetCellIndex = colIndex + 3;

    // Update the displayed rows for which the user has checked the checkbox
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
      const checkbox = row.cells[1].querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        row.cells[targetCellIndex].textContent = newValue;
        row.classList.add('modified');
      }
    });
  }

  // ------------------------------------------------
  // 5) SEARCH & FILTER
  // ------------------------------------------------
  function getFilteredData() {
    if (!searchString) {
      return allData; // no filter
    }
    const lowerSearch = searchString.toLowerCase();
    return allData.filter(row => {
      // If any field (string) contains the search text
      return Object.values(row).some(val => {
        if (typeof val === 'string') {
          return val.toLowerCase().includes(lowerSearch);
        }
        return false;
      });
    });
  }

  // When user types in the search box, update searchString & show page 1
  searchInput.addEventListener('input', function() {
    searchString = this.value;
    currentPage = 1;
    displayPage();
  });

  // ------------------------------------------------
  // 6) PAGINATION
  // ------------------------------------------------
  function displayPage() {
    const filteredData = getFilteredData(); 
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
    const pageData = filteredData.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    pageData.forEach((rowData, i) => {
      const globalIndex = startIndex + i; // position in filteredData
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

      // Cell 2: Actions dropdown
      const tdActions = document.createElement('td');
      const selectActions = document.createElement('select');

      // Default option
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = 'Select...';
      selectActions.appendChild(defaultOpt);

      // Action 1
      const action1 = document.createElement('option');
      action1.value = 'Action 1';
      action1.textContent = 'Action 1';
      selectActions.appendChild(action1);

      // Action 2
      const action2 = document.createElement('option');
      action2.value = 'Action 2';
      action2.textContent = 'Action 2';
      selectActions.appendChild(action2);

      // Action dropdown change
      selectActions.addEventListener('change', function() {
        if (this.value !== '') {
          alert(`You selected: ${this.value}\nSuccess!`);
          this.value = '';
        }
      });

      tdActions.appendChild(selectActions);
      row.appendChild(tdActions);

      // Cells 3+: Data columns
      columnsPref.forEach(col => {
        if (col.visible || col.name === "Index") {
          const cell = document.createElement('td');
          cell.setAttribute('contenteditable', 'true');
          if (col.name === "Index") {
            // Show row's position in the filtered set
            cell.textContent = globalIndex + 1;
          } else {
            cell.textContent = rowData[col.name] || '';
          }
          cell.addEventListener('input', () => row.classList.add('modified'));
          row.appendChild(cell);
        }
      });

      // Row drag & drop events
      row.addEventListener('dragover', dragOver);
      row.addEventListener('dragleave', dragLeave);
      // We'll pass the entire rowData object so we know which item in allData to reorder
      row.addEventListener('drop', e => drop(e, rowData));

      tableBody.appendChild(row);
    });

    attachRowDragEvents();
    updatePaginationUI(filteredData.length);
  }

  function updatePaginationUI(totalCount) {
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = (currentPage <= 1);
    nextPageBtn.disabled = (currentPage >= totalPages);
  }

  rowsPerPageSelect.addEventListener('change', function() {
    rowsPerPage = parseInt(this.value, 10);
    currentPage = 1;
    displayPage();
  });
  prevPageBtn.addEventListener('click', function() {
    if (currentPage > 1) {
      syncCurrentPageEdits();
      currentPage--;
      displayPage();
    }
  });
  nextPageBtn.addEventListener('click', function() {
    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    if (currentPage < totalPages) {
      syncCurrentPageEdits();
      currentPage++;
      displayPage();
    }
  });

  // Before changing pages or saving, copy user edits from DOM into allData
  function syncCurrentPageEdits() {
    const filteredData = getFilteredData();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row, i) => {
      const rowData = filteredData[startIndex + i];
      if (!rowData) return;
      let cellIndex = 3; // data columns start at cell 3
      columnsPref.forEach(col => {
        if (col.visible || col.name === "Index") {
          if (col.name !== 'Index') {
            rowData[col.name] = row.cells[cellIndex].textContent;
          }
          cellIndex++;
        }
      });
      row.classList.remove('modified');
    });
  }

  // ------------------------------------------------
  // 7) DRAG & DROP REORDERING
  // ------------------------------------------------
  let draggedRowElement = null;

  function attachRowDragEvents() {
    document.querySelectorAll('.drag-handle').forEach(handle => {
      handle.addEventListener('dragstart', dragStart);
      handle.addEventListener('dragend', dragEnd);
    });
  }

  function dragStart(e) {
    draggedRowElement = this.parentNode;
    e.dataTransfer.effectAllowed = 'move';
  }

  function dragEnd() {
    draggedRowElement = null;
    clearDragOver();
  }

  function dragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  }

  function dragLeave() {
    this.classList.remove('drag-over');
  }

  // Reorder allData by removing the dragged row and inserting it before/after the target
  function drop(e, targetRowObj) {
    e.preventDefault();
    this.classList.remove('drag-over');
    if (!draggedRowElement || draggedRowElement === this) return;

    // Identify which row in allData is being dragged
    // We'll parse the "Index" cell from the dragged row or store rowData
    // For simplicity, parse from cell 3 (if columns haven't changed order).
    const draggedIndexCell = draggedRowElement.cells[3];
    if (!draggedIndexCell) return;
    const draggedIndex = parseInt(draggedIndexCell.textContent) - 1;
    const draggedObj = getFilteredData()[draggedIndex];
    if (!draggedObj) return;

    // Reorder in the global allData
    const fromPos = allData.indexOf(draggedObj);
    const toPos = allData.indexOf(targetRowObj);
    if (fromPos < 0 || toPos < 0) return;

    const rect = this.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const dropAbove = offset < rect.height / 2;

    allData.splice(fromPos, 1);
    let insertPos = dropAbove ? toPos : toPos + 1;
    if (fromPos < toPos) insertPos--;
    if (insertPos < 0) insertPos = 0;
    if (insertPos > allData.length) insertPos = allData.length;
    allData.splice(insertPos, 0, draggedObj);

    displayPage();
  }

  function clearDragOver() {
    document.querySelectorAll('tr').forEach(row => row.classList.remove('drag-over'));
  }

  // ------------------------------------------------
  // 8) SAVE & CANCEL
  // ------------------------------------------------
  saveBtn.addEventListener('click', saveChanges);
  cancelBtn.addEventListener('click', cancelChanges);

  function saveChanges() {
    // Sync the current page's edits to allData
    syncCurrentPageEdits();
    // Send allData to the server
    fetch('/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allData)
    })
    .then(res => res.json())
    .then(result => {
      if (result.status !== 'success') {
        alert("Error saving data: " + result.message);
      }
    })
    .catch(err => alert("Error: " + err));
  }

  function cancelChanges() {
    // Discard unsaved changes on current page
    displayPage();
  }

  // ------------------------------------------------
  // 9) COLUMN PREFERENCES
  // ------------------------------------------------
  columnPrefsBtn.addEventListener('click', openColumnPrefsModal);
  closeModalSpan.addEventListener('click', closeColumnPrefsModal);
  cancelPrefsBtn.addEventListener('click', closeColumnPrefsModal);
  savePrefsBtn.addEventListener('click', saveColumnPrefs);

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

  function saveColumnPrefs() {
    const newPrefs = [];
    const items = columnPrefsList.querySelectorAll('li');
    items.forEach(item => {
      const colName = item.getAttribute('data-col');
      const visible = item.querySelector('input[type="checkbox"]').checked;
      newPrefs.push({ name: colName, visible: visible });
    });
    // Force Index always visible
    newPrefs.forEach(pref => {
      if (pref.name === "Index") pref.visible = true;
    });
    columnsPref = newPrefs;
    saveColumnPreferences(columnsPref);
    buildTableHeader();
    displayPage();
    closeColumnPrefsModal();
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

  // ------------------------------------------------
  // 10) LOCAL STORAGE FOR COLUMN PREFS
  // ------------------------------------------------
  function loadColumnPreferences() {
    const prefs = localStorage.getItem('columnPreferences');
    return prefs ? JSON.parse(prefs) : null;
  }
  function saveColumnPreferences(prefs) {
    localStorage.setItem('columnPreferences', JSON.stringify(prefs));
  }

  // ------------------------------------------------
  // 11) INITIAL SETUP
  // ------------------------------------------------
  buildTableHeader();

  // Load data from /data
  fetch('/data')
    .then(res => res.json())
    .then(data => {
      allData = data;
      displayPage(); // Show the first page
    })
    .catch(err => console.error('Error loading data:', err));
});
