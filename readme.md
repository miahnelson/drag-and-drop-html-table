# Drag and Drop HTML Table using Flask

This is a Flask-based project demonstrating a draggable table with pagination, bulk editing, column preferences, fallback data, and sticky headers. It also supports a sticky top bar for better usability.

> **Note**: **70%** of this code was generated with the help of ChatGPT, which greatly accelerated the development process.

---

## Features

1. **Drag-and-Drop Rows**  
   - Reorder table rows by dragging a handle on the left side.
   - Auto-scroll while dragging for large datasets.

2. **Fallback Data**  
   - If `data.json` is missing, the table uses inline fallback data.

3. **Sticky Header & Top Bar**  
   - Keeps column headers and top bar visible while scrolling.

4. **Pagination & Bulk Edit**  
   - Choose how many rows per page (20, 50, 100, etc.).
   - Right-click column headers to bulk-edit checked rows in that column.

5. **Column Preferences**  
   - Show/hide and reorder columns, with “Index” always visible.

6. **Save & Cancel**  
   - Save changes to the server (`/save`).
   - Cancel discards unsaved edits on the current page.

---

## Requirements

- **Python 3.7+**
- **Flask** (any recent version)
- **Git** (if you want to clone this repository)

---

## Installation

1. **Clone** or download this repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo

2. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

3. **Install dependencies**:
   ```bash
   Copy
   pip install -r requirements.txt
   Run the Flask app:

4. **Run the Flask app**:
   ```bash
   Copy
   flask run
   By default, the app runs at http://127.0.0.1:5000.

## Usage

1. **Open your browser** to [http://127.0.0.1:5000](http://127.0.0.1:5000).
2. The **top bar** (search, pagination, columns, etc.) is **sticky** at the top.
3. **Drag rows** by clicking the “drag-handle” (☰ icon).
4. **Right-click** any column header to bulk-edit all checked rows in that column.
5. **Save** changes to `/save`, or **Cancel** to discard unsaved edits.
6. **Column Prefs**: click “Columns” to show/hide and reorder columns.

---

## Credits

- **ChatGPT**: Approximately **70%** of this project’s code was generated using ChatGPT.
- **Jeremiah Nelson** (Project Owner/Maintainer).

