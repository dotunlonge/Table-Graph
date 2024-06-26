import React, { useEffect, useState } from 'react';
import { Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import Modal from 'react-modal';

const Chart = () => {

  const [xAxisColumn, setXAxisColumn] = useState('Price Low');
  const [yAxisColumn, setYAxisColumn] = useState('Price High');
  const [newColumnName, setNewColumnName] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addColumnModalIsOpen, setAddColumnModalIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [xAxisDomain, setXAxisDomain] = useState([0, 'auto']);
  const [yAxisDomain, setYAxisDomain] = useState([0, 'auto']);

  const [data, setData] = useState([
    {
      Time: '12-25-2020 15:34:21.356',
      'Price Low': '100.20',
      'Price High': '157.56',
      'Price Open': '123.03',
      'Price Close': '135.72',
      Volume: '120,000'
    },
  ]);

  const [newRow, setNewRow] = useState(() => {
    const newRow = {};
    Object.keys(data[0]).forEach(key => {
      newRow[key] = '';
    });
    return newRow;
  });
  
  const [showColumns, setShowColumns] = useState(() => {
    const initialShowColumns = {};
    Object.keys(data[0]).forEach((key) => {
      initialShowColumns[key] = true; // Initially show all columns
    });
    return initialShowColumns;
  });

  const [disabledRows, setDisabledRows] = useState(() => {
    const initialDisabledRows = {};
    data.forEach((_, index) => {
      initialDisabledRows[index] = false; // Initially all rows are enabled
    });
    return initialDisabledRows;
  });

  // Add these functions to handle the changes in the select inputs
  const handleXAxisChange = (e) => {
    setXAxisColumn(e.target.value);
  };

  const handleYAxisChange = (e) => {
    setYAxisColumn(e.target.value);
  };
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTrendLineChange = (e) => {
    setShowTrendLine(e.target.checked);
  };

  const handleInputChange = (e, key) => {
    setNewRow({
      ...newRow,
      [key]: e.target.value
    });
  };
  
  const addRow = () => {
    // Validate newRow
    for (const key in newRow) {
      if (newRow[key] === '') {
        alert('Please fill in all fields');
        return;
      }
    }
  
    // Update data with the new row
    setData((prevData) => [...prevData, newRow]);
  
    // Reset newRow to empty values
    setNewRow(() => {
      const newRow = {};
      Object.keys(data[0]).forEach((key) => {
        newRow[key] = '';
      });
      return newRow;
    });
  
    // Close the modal
    setModalIsOpen(false);
  };
  
  const addColumn = () => {
    if (newColumnName.trim() === '') {
      alert('Please enter a column name');
      return;
    }
  
    // Update data with the new column
    setData(data.map(row => ({ ...row, [newColumnName]: '' })));
  
    // Update newRow to include the new column
    setNewRow(prevNewRow => ({
      ...prevNewRow,
      [newColumnName]: ''
    }));
  
    // Reset newColumnName
    setNewColumnName('');
  
    // Close the modal
    setAddColumnModalIsOpen(false);
  };
    
  const toggleRowVisibility = (rowIndex) => {
    setDisabledRows((prevDisabledRows) => ({
      ...prevDisabledRows,
      [rowIndex]: !prevDisabledRows[rowIndex],
    }));
  };

  const toggleColumnVisibility = (columnKey) => {
    setShowColumns((prevShowColumns) => ({
      ...prevShowColumns,
      [columnKey]: !prevShowColumns[columnKey],
    }));
  };

  useEffect(() => {
    if (xAxisColumn) {
      setXAxisDomain(calculateDomain(data, xAxisColumn));
    }
  }, [data, xAxisColumn]);

  // Calculate domain for Y axis
  useEffect(() => {
    if (yAxisColumn) {
      setYAxisDomain(calculateDomain(data, yAxisColumn));
    }
  }, [data, yAxisColumn]);

  return (
      <div className={`flex flex-col items-center ${isDarkMode ? 'dark' : 'light'}`}>
        
        <div className='flex flex-wrap items-center justify-center'>
  <button className="my-4 mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setModalIsOpen(true)}>Add Row</button>
  <button className="my-4 mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setAddColumnModalIsOpen(true)}>Add Column</button>
  <div className="my-4 mx-2">
    <label htmlFor="xAxis" className="mr-2">X Axis:</label>
    <select
      id="xAxis"
      value={xAxisColumn}
      onChange={handleXAxisChange}
      className="px-2 py-1 border border-gray-300 rounded"
    >
      {Object.keys(data[0]).filter(key => !['Time'].includes(key)).map(key => (
        <option key={key} value={key}>{key}</option>
      ))}
    </select>
  </div>
  <div className="my-4 mx-2">
    <label htmlFor="yAxis" className="mr-2">Y Axis:</label>
    <select
      id="yAxis"
      value={yAxisColumn}
      onChange={handleYAxisChange}
      className="px-2 py-1 border border-gray-300 rounded"
    >
      {Object.keys(data[0]).filter(key => !['Time'].includes(key)).map(key => (
        <option key={key} value={key}>{key}</option>
      ))}
    </select>
  </div>
  <div className="my-4 mx-2">
    <label htmlFor="showTrendLine" className="mr-2">Show Trend Line:</label>
    <input
      id="showTrendLine"
      type="checkbox"
      checked={showTrendLine}
      onChange={handleTrendLineChange}
      className="mr-1"
    />
  </div>
  <button className="my-4 mx-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={toggleTheme}>Toggle Theme</button>
</div>

        <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add Row Modal"
        >
        <h2>Add Row</h2>
        {Object.keys(newRow).map(key => (
        <>
        <input
          key={key}
          type="text"
          placeholder={key}
          value={newRow[key]}
          onChange={(e) => handleInputChange(e, key)}
          className="my-2 px-2 py-1 border border-gray-300 rounded"
        />
        </>
        ))}
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={addRow}>Add Row</button>
        <button className="ml-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setModalIsOpen(false)}>Cancel</button>
        </Modal>

        <Modal
        isOpen={addColumnModalIsOpen}
        onRequestClose={() => setAddColumnModalIsOpen(false)}
        contentLabel="Add Column Modal"
        >
        <h2>Add Column</h2>
        <input
        type="text"
        placeholder="Column Name"
        value={newColumnName}
        onChange={(e) => setNewColumnName(e.target.value)}
        className="my-2 px-2 py-1 border border-gray-300 rounded"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={addColumn}>Add Column</button>
        <button className="ml-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setAddColumnModalIsOpen(false)}>Cancel</button>
        </Modal>

        <table className="border-collapse border border-gray-500">
        <thead>
        <tr>
        <th></th> {/* Empty header for ghost row */}
          {Object.keys(data[0]).map((columnName) => (
            <th key={columnName} className="border border-gray-500 p-2">
              <input
                type="checkbox"
                checked={showColumns[columnName]}
                onChange={() => toggleColumnVisibility(columnName)}
              />
              {columnName}
            </th>
          ))}
        </tr>
        </thead>

        <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className={disabledRows[rowIndex] ? 'disabled' : ''}>
            <td>
              <input
                type="checkbox"
                checked={!disabledRows[rowIndex]}
                onChange={() => toggleRowVisibility(rowIndex)}
              />
            </td>
            {Object.keys(row).map((key, columnIndex) => (
              <td key={columnIndex} className='border border-gray-500 p-2'>
                {!disabledRows[rowIndex] && showColumns[key] && ( // Check if row and column should be visible
                  <div className='flex'>
                    {key.includes('Price') && `$`}
                    <input
                      type="text"
                      value={row[key]}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[rowIndex][key] = e.target.value;
                        setData(newData);
                      }}
                      disabled={disabledRows[rowIndex]}
                      className="w-full"
                    />
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
        </tbody>

        </table>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
          data={formatData(data, showColumns, disabledRows)}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis
            type='number'
            dataKey={xAxisColumn}
            name={xAxisColumn}
            domain={xAxisDomain}
            label={{ value: xAxisColumn, position: 'insideBottom', offset: -10 }}
            />
            <YAxis
            type='number'
            dataKey={yAxisColumn}
            name={yAxisColumn}
            domain={yAxisDomain}
            label={{ value: yAxisColumn, position: 'insideLeft', angle: -90, offset: 0 }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Data" data={formatData(data, showColumns, disabledRows)}  fill="#8884d8" />
            {showTrendLine && (
              <Line 
              dataKey={yAxisColumn} 
              stroke="#82ca9d" 
              dot={false} 
              type="linear"
              points={sortDataForTrendLine(formatData(data, showColumns, disabledRows), xAxisColumn, yAxisColumn)}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
    </div>
  );
};

export default Chart;


const sortDataForTrendLine = (data, xAxisColumn, yAxisColumn) => {
  try {
    return data
      .filter((d) => {
        const xValue = parseFloat(d[xAxisColumn].replace(',', ''));
        const yValue = parseFloat(d[yAxisColumn].replace(',', ''));
        return !isNaN(xValue) && !isNaN(yValue);
      })
      .sort((a, b) => {
        const xValueA = parseFloat(a[xAxisColumn].replace(',', ''));
        const xValueB = parseFloat(b[xAxisColumn].replace(',', ''));
        return xValueA - xValueB;
      })
      .map((d) => ({
        x: parseFloat(d[xAxisColumn].replace(',', '')),
        y: parseFloat(d[yAxisColumn].replace(',', '')),
      }));
  } catch (error) {
    console.error(error.message);
    return data;
  }
};

const calculateDomain = (data, column) => {
  try {
    const values = data.map((d) => {
      const value = d[column].replace(',', ''); // Remove commas
      return parseFloat(value);
    }).filter((d) => !isNaN(d));

    const max = Math.max(...values);
    return [0, max]; 
  } catch (error) {
    console.log(error.message);
    return [0, 'auto'];
  }
};

// const formatData = (data) => {
//   return data.map((item) => {
//     const formattedItem = {};
//     for (const key in item) {
//       if (key !== 'Time') { // Ignore the 'Time' column
//         const value = item[key].replace(',', ''); // Remove commas
//         formattedItem[key] = parseFloat(value); // Parse the value to a float
//       } else {
//         formattedItem[key] = item[key]; // Keep 'Time' column as is
//       }
//     }
//     return formattedItem;
//   });
// };

const formatData = (data, showColumns, disabledRows) => {
  return data.map((item, rowIndex) => {
    // Skip rows that are disabled
    if (disabledRows[rowIndex]) {
      return null;
    }

    const formattedItem = {};
    for (const key in item) {
      // Only include data for visible columns
      if (showColumns[key]) {
        if (key !== 'Time') { // Ignore the 'Time' column
          const value = item[key].replace(',', ''); // Remove commas
          formattedItem[key] = parseFloat(value); // Parse the value to a float
        } else {
          formattedItem[key] = item[key]; // Keep 'Time' column as is
        }
      }
    }
    return formattedItem;
  }).filter(item => item !== null); // Filter out null values (disabled rows)
};
