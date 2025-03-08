// script.js
document.addEventListener('DOMContentLoaded', function() {
  // ------------------------------------------------
  // 1) STATE: Data, Pagination, Columns, Search
  // ------------------------------------------------
  let allData = [];           // All rows loaded from /data or fallback
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

  // Fallback data if /data is missing
  const fallbackData = [
    {
      "Index": 1,
      "Name": "John Doe",
      "Email": "john.doe@example.com",
      "Address": "123 Main St",
      "City": "New York",
      "State": "NY",
      "Zip": "10001",
      "Country": "USA",
      "Phone": "555-0101",
      "Company": "Acme Inc.",
      "Position": "Manager",
      "Notes": "N/A"
    },
    {
      "Index": 2,
      "Name": "Jane Smith",
      "Email": "jane.smith@example.com",
      "Address": "456 Oak Ave",
      "City": "Los Angeles",
      "State": "CA",
      "Zip": "90001",
      "Country": "USA",
      "Phone": "555-0102",
      "Company": "Beta Corp",
      "Position": "Engineer",
      "Notes": "N/A"
    },
    {
      "Index": 3,
      "Name": "Barbara Clark",
      "Email": "barbara.clark@example.com",
      "Address": "333 Oak St",
      "City": "Charlotte",
      "State": "NC",
      "Zip": "28202",
      "Country": "USA",
      "Phone": "555-0115",
      "Company": "Omicron LLC",
      "Position": "Coordinator",
      "Notes": "N/A"
    },
    {
      "Index": 4,
      "Name": "Robert Brown",
      "Email": "robert.brown@example.com",
      "Address": "101 Maple St",
      "City": "Houston",
      "State": "TX",
      "Zip": "77001",
      "Country": "USA",
      "Phone": "555-0104",
      "Company": "Delta Co.",
      "Position": "Analyst",
      "Notes": "N/A"
    },
    {
      "Index": 5,
      "Name": "James Rodriguez",
      "Email": "james.rodriguez@example.com",
      "Address": "707 Aspen Dr",
      "City": "San Jose",
      "State": "CA",
      "Zip": "95101",
      "Country": "USA",
      "Phone": "555-0110",
      "Company": "Epsilon Ltd.",
      "Position": "Manager",
      "Notes": "N/A"
    },
    {
      "Index": 6,
      "Name": "Alice Johnson",
      "Email": "alice.johnson@example.com",
      "Address": "789 Pine Rd",
      "City": "Chicago",
      "State": "IL",
      "Zip": "60601",
      "Country": "USA",
      "Phone": "555-0103",
      "Company": "Zeta LLC",
      "Position": "Designer",
      "Notes": "N/A"
    },
    {
      "Index": 7,
      "Name": "Michael Wilson",
      "Email": "michael.wilson@example.com",
      "Address": "303 Cedar Rd",
      "City": "Philadelphia",
      "State": "PA",
      "Zip": "19019",
      "Country": "USA",
      "Phone": "555-0106",
      "Company": "Beta Corp",
      "Position": "Developer",
      "Notes": "N/A"
    },
    {
      "Index": 8,
      "Name": "Sarah Miller",
      "Email": "sarah.miller@example.com",
      "Address": "404 Birch Ln",
      "City": "San Antonio",
      "State": "TX",
      "Zip": "78201",
      "Country": "USA",
      "Phone": "555-0107",
      "Company": "Gamma Inc.",
      "Position": "New",
      "Notes": "N/A"
    },
    {
      "Index": 9,
      "Name": "David Garcia",
      "Email": "david.garcia@example.com",
      "Address": "505 Spruce Ave",
      "City": "San Diego",
      "State": "CA",
      "Zip": "92101",
      "Country": "USA",
      "Phone": "555-0108",
      "Company": "Theta Co.",
      "Position": "Director",
      "Notes": "N/A"
    },
    {
      "Index": 10,
      "Name": "Laura Martinez",
      "Email": "laura.martinez@example.com",
      "Address": "606 Walnut St",
      "City": "Dallas",
      "State": "TX",
      "Zip": "75201",
      "Country": "USA",
      "Phone": "555-0109",
      "Company": "Iota Corp",
      "Position": "Supervisor",
      "Notes": "N/A"
    },
    {
      "Index": 11,
      "Name": "Linda Hernandez",
      "Email": "linda.hernandez@example.com",
      "Address": "808 Poplar Blvd",
      "City": "Austin",
      "State": "TX",
      "Zip": "73301",
      "Country": "USA",
      "Phone": "555-0111",
      "Company": "Lambda Inc.",
      "Position": "Coordinator",
      "Notes": "N/A"
    },
    {
      "Index": 12,
      "Name": "Emily Davis",
      "Email": "emily.davis@example.com",
      "Address": "202 Elm St",
      "City": "Phoenix",
      "State": "AZ",
      "Zip": "85001",
      "Country": "USA",
      "Phone": "555-0105",
      "Company": "Mu LLC",
      "Position": "New",
      "Notes": "N/A"
    },
    {
      "Index": 1,
      "Name": "John Doe",
      "Email": "john.doe@example.com",
      "Address": "123 Main St",
      "City": "New York",
      "State": "NY",
      "Zip": "10001",
      "Country": "USA",
      "Phone": "555-0101",
      "Company": "Acme Inc.",
      "Position": "Manager",
      "Notes": "N/A"
    },
    {
      "Index": 2,
      "Name": "Jane Smith",
      "Email": "jane.smith@example.com",
      "Address": "456 Oak Ave",
      "City": "Los Angeles",
      "State": "CA",
      "Zip": "90001",
      "Country": "USA",
      "Phone": "555-0102",
      "Company": "Beta Corp",
      "Position": "Engineer",
      "Notes": "N/A"
    },
    {
      "Index": 3,
      "Name": "Barbara Clark",
      "Email": "barbara.clark@example.com",
      "Address": "333 Oak St",
      "City": "Charlotte",
      "State": "NC",
      "Zip": "28202",
      "Country": "USA",
      "Phone": "555-0115",
      "Company": "Omicron LLC",
      "Position": "Coordinator",
      "Notes": "N/A"
    },
    {
      "Index": 4,
      "Name": "Robert Brown",
      "Email": "robert.brown@example.com",
      "Address": "101 Maple St",
      "City": "Houston",
      "State": "TX",
      "Zip": "77001",
      "Country": "USA",
      "Phone": "555-0104",
      "Company": "Delta Co.",
      "Position": "Analyst",
      "Notes": "N/A"
    },
    {
      "Index": 5,
      "Name": "James Rodriguez",
      "Email": "james.rodriguez@example.com",
      "Address": "707 Aspen Dr",
      "City": "San Jose",
      "State": "CA",
      "Zip": "95101",
      "Country": "USA",
      "Phone": "555-0110",
      "Company": "Epsilon Ltd.",
      "Position": "Manager",
      "Notes": "N/A"
    },
    {
      "Index": 6,
      "Name": "Alice Johnson",
      "Email": "alice.johnson@example.com",
      "Address": "789 Pine Rd",
      "City": "Chicago",
      "State": "IL",
      "Zip": "60601",
      "Country": "USA",
      "Phone": "555-0103",
      "Company": "Zeta LLC",
      "Position": "Designer",
      "Notes": "N/A"
    },
    {
      "Index": 7,
      "Name": "Michael Wilson",
      "Email": "michael.wilson@example.com",
      "Address": "303 Cedar Rd",
      "City": "Philadelphia",
      "State": "PA",
      "Zip": "19019",
      "Country": "USA",
      "Phone": "555-0106",
      "Company": "Beta Corp",
      "Position": "Developer",
      "Notes": "N/A"
    },
    {
      "Index": 8,
      "Name": "Sarah Miller",
      "Email": "sarah.miller@example.com",
      "Address": "404 Birch Ln",
      "City": "San Antonio",
      "State": "TX",
      "Zip": "78201",
      "Country": "USA",
      "Phone": "555-0107",
      "Company": "Gamma Inc.",
      "Position": "New",
      "Notes": "N/A"
    },
    {
      "Index": 9,
      "Name": "David Garcia",
      "Email": "david.garcia@example.com",
      "Address": "505 Spruce Ave",
      "City": "San Diego",
      "State": "CA",
      "Zip": "92101",
      "Country": "USA",
      "Phone": "555-0108",
      "Company": "Theta Co.",
      "Position": "Director",
      "Notes": "N/A"
    },
    {
      "Index": 10,
      "Name": "Laura Martinez",
      "Email": "laura.martinez@example.com",
      "Address": "606 Walnut St",
      "City": "Dallas",
      "State": "TX",
      "Zip": "75201",
      "Country": "USA",
      "Phone": "555-0109",
      "Company": "Iota Corp",
      "Position": "Supervisor",
      "Notes": "N/A"
    },
    {
      "Index": 11,
      "Name": "Linda Hernandez",
      "Email": "linda.hernandez@example.com",
      "Address": "808 Poplar Blvd",
      "City": "Austin",
      "State": "TX",
      "Zip": "73301",
      "Country": "USA",
      "Phone": "555-0111",
      "Company": "Lambda Inc.",
      "Position": "Coordinator",
      "Notes": "N/A"
    },
    {
      "Index": 12,
      "Name": "Emily Davis",
      "Email": "emily.davis@example.com",
      "Address": "202 Elm St",
      "City": "Phoenix",
      "State": "AZ",
      "Zip": "85001",
      "Country": "USA",
      "Phone": "555-0105",
      "Company": "Mu LLC",
      "Position": "New",
      "Notes": "N/A"
    },
    {
      "Index": 1,
      "Name": "John Doe",
      "Email": "john.doe@example.com",
      "Address": "123 Main St",
      "City": "New York",
      "State": "NY",
      "Zip": "10001",
      "Country": "USA",
      "Phone": "555-0101",
      "Company": "Acme Inc.",
      "Position": "Manager",
      "Notes": "N/A"
    },
    {
      "Index": 2,
      "Name": "Jane Smith",
      "Email": "jane.smith@example.com",
      "Address": "456 Oak Ave",
      "City": "Los Angeles",
      "State": "CA",
      "Zip": "90001",
      "Country": "USA",
      "Phone": "555-0102",
      "Company": "Beta Corp",
      "Position": "Engineer",
      "Notes": "N/A"
    },
    {
      "Index": 3,
      "Name": "Barbara Clark",
      "Email": "barbara.clark@example.com",
      "Address": "333 Oak St",
      "City": "Charlotte",
      "State": "NC",
      "Zip": "28202",
      "Country": "USA",
      "Phone": "555-0115",
      "Company": "Omicron LLC",
      "Position": "Coordinator",
      "Notes": "N/A"
    },
    {
      "Index": 4,
      "Name": "Robert Brown",
      "Email": "robert.brown@example.com",
      "Address": "101 Maple St",
      "City": "Houston",
      "State": "TX",
      "Zip": "77001",
      "Country": "USA",
      "Phone": "555-0104",
      "Company": "Delta Co.",
      "Position": "Analyst",
      "Notes": "N/A"
    },
    {
      "Index": 5,
      "Name": "James Rodriguez",
      "Email": "james.rodriguez@example.com",
      "Address": "707 Aspen Dr",
      "City": "San Jose",
      "State": "CA",
      "Zip": "95101",
      "Country": "USA",
      "Phone": "555-0110",
      "Company": "Epsilon Ltd.",
      "Position": "Manager",
      "Notes": "N/A"
    },
    {
      "Index": 6,
      "Name": "Alice Johnson",
      "Email": "alice.johnson@example.com",
      "Address": "789 Pine Rd",
      "City": "Chicago",
      "State": "IL",
      "Zip": "60601",
      "Country": "USA",
      "Phone": "555-0103",
      "Company": "Zeta LLC",
      "Position": "Designer",
      "Notes": "N/A"
    },
    {
      "Index": 7,
      "Name": "Michael Wilson",
      "Email": "michael.wilson@example.com",
      "Address": "303 Cedar Rd",
      "City": "Philadelphia",
      "State": "PA",
      "Zip": "19019",
      "Country": "USA",
      "Phone": "555-0106",
      "Company": "Beta Corp",
      "Position": "Developer",
      "Notes": "N/A"
    },
    {
      "Index": 8,
      "Name": "Sarah Miller",
      "Email": "sarah.miller@example.com",
      "Address": "404 Birch Ln",
      "City": "San Antonio",
      "State": "TX",
      "Zip": "78201",
      "Country": "USA",
      "Phone": "555-0107",
      "Company": "Gamma Inc.",
      "Position": "New",
      "Notes": "N/A"
    },
    {
      "Index": 9,
      "Name": "David Garcia",
      "Email": "david.garcia@example.com",
      "Address": "505 Spruce Ave",
      "City": "San Diego",
      "State": "CA",
      "Zip": "92101",
      "Country": "USA",
      "Phone": "555-0108",
      "Company": "Theta Co.",
      "Position": "Director",
      "Notes": "N/A"
    },
    {
      "Index": 10,
      "Name": "Laura Martinez",
      "Email": "laura.martinez@example.com",
      "Address": "606 Walnut St",
      "City": "Dallas",
      "State": "TX",
      "Zip": "75201",
      "Country": "USA",
      "Phone": "555-0109",
      "Company": "Iota Corp",
      "Position": "Supervisor",
      "Notes": "N/A"
    },
    {
      "Index": 11,
      "Name": "Linda Hernandez",
      "Email": "linda.hernandez@example.com",
      "Address": "808 Poplar Blvd",
      "City": "Austin",
      "State": "TX",
      "Zip": "73301",
      "Country": "USA",
      "Phone": "555-0111",
      "Company": "Lambda Inc.",
      "Position": "Coordinator",
      "Notes": "N/A"
    },
    {
      "Index": 12,
      "Name": "Emily Davis",
      "Email": "emily.davis@example.com",
      "Address": "202 Elm St",
      "City": "Phoenix",
      "State": "AZ",
      "Zip": "85001",
      "Country": "USA",
      "Phone": "555-0105",
      "Company": "Mu LLC",
      "Position": "New",
      "Notes": "N/A"
    }  
  ];

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
      // If any field (string) includes the search text
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
      // i is the index on this page; globalIndex is the index in the filtered set
      const globalIndex = startIndex + i;

      // Create a table row
      const row = document.createElement('tr');

      // Store the row's "Index" as a data attribute, ignoring column order
      // We parse it as a number so we can reorder by it
      row.dataset.indexVal = parseInt(rowData.Index, 10);

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

          // If this is the "Index" column, do NOT let the user edit it
          if (col.name === "Index") {
            cell.setAttribute('contenteditable', 'false');
            cell.textContent = globalIndex + 1; // position in the filtered set
          } else {
            cell.setAttribute('contenteditable', 'true');
            cell.textContent = rowData[col.name] || '';
          }
          cell.addEventListener('input', () => row.classList.add('modified'));
          row.appendChild(cell);
        }
      });

      // Attach row-level drag & drop events from dragAndDrop.js
      // (global functions: dragOver, dragLeave, drop)
      row.addEventListener('dragover', e => dragOver(e));
      row.addEventListener('dragleave', e => dragLeave(e));
      row.addEventListener('drop', e => drop(e, rowData));

      tableBody.appendChild(row);
    });

    // After building rows, attach .drag-handle events from dragAndDrop.js
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
    // Discard unsaved changes on the current page
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

  // 1) Attempt to load data from /data
  fetch('/data')
    .then(res => {
      if (!res.ok) {
        // If /data not found (404), fallback
        throw new Error("No data.json found on server");
      }
      return res.json();
    })
    .then(data => {
      // If fetch succeeded, parse "Index"
      data.forEach(d => {
        d.Index = parseInt(d.Index, 10);
      });
      allData = data;
      initDragAndDrop(allData, displayPage);
      displayPage();
    })
    .catch(err => {
      // If server data not found or error, fallback
      console.warn("Using fallback data instead:", err);
      fallbackData.forEach(d => {
        d.Index = parseInt(d.Index, 10);
      });
      allData = fallbackData;
      initDragAndDrop(allData, displayPage);
      displayPage();
    });
});
