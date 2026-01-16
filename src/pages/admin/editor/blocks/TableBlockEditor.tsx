import React from 'react';
import { Table, Plus, Trash, X } from 'lucide-react';
import { TableBlock } from '../../../../types/blocks';
import { useEditorStore } from '../../../../store/editorStore';

interface TableBlockEditorProps {
  stepId: string;
  block: TableBlock;
}

const TableBlockEditor: React.FC<TableBlockEditorProps> = ({ stepId, block }) => {
  const { updateBlock } = useEditorStore();
  
  // Safe defaults
  const headers = block.content?.headers || ['Header 1', 'Header 2'];
  const rows = block.content?.rows || [['Cell 1', 'Cell 2']];

  const updateTable = (newHeaders: string[], newRows: string[][]) => {
      updateBlock(stepId, block.id, {
          content: {
              headers: newHeaders,
              rows: newRows
          }
      });
  };

  const addColumn = () => {
      const newHeaders = [...headers, `Header ${headers.length + 1}`];
      const newRows = rows.map(row => [...row, '']);
      updateTable(newHeaders, newRows);
  };

  const addRow = () => {
      const newRow = new Array(headers.length).fill('');
      updateTable(headers, [...rows, newRow]);
  };

  const removeColumn = (index: number) => {
      if (headers.length <= 1) return;
      const newHeaders = headers.filter((_, i) => i !== index);
      const newRows = rows.map(row => row.filter((_, i) => i !== index));
      updateTable(newHeaders, newRows);
  };

  const removeRow = (index: number) => {
      const newRows = rows.filter((_, i) => i !== index);
      updateTable(headers, newRows);
  };

  const updateHeader = (index: number, value: string) => {
      const newHeaders = [...headers];
      newHeaders[index] = value;
      updateTable(newHeaders, rows);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
      const newRows = [...rows];
      newRows[rowIndex] = [...newRows[rowIndex]]; // Copy row
      newRows[rowIndex][colIndex] = value;
      updateTable(headers, newRows);
  };

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
       <div className="bg-neutral-800/50 p-2 border-b border-neutral-800 flex items-center justify-between">
           <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase font-bold tracking-wider">
               <Table className="w-4 h-4" /> Data Table
           </div>
           <div className="flex gap-2">
               <button onClick={addColumn} className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded text-gray-300 flex items-center">
                   <Plus className="w-3 h-3 mr-1" /> Col
               </button>
               <button onClick={addRow} className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded text-gray-300 flex items-center">
                   <Plus className="w-3 h-3 mr-1" /> Row
               </button>
           </div>
       </div>

       <div className="p-4 overflow-x-auto">
           <table className="w-full border-collapse text-sm text-left">
               <thead>
                   <tr>
                       {headers.map((header, i) => (
                           <th key={i} className="group border border-neutral-700 p-0 min-w-[150px] relative">
                               <input 
                                   value={header}
                                   onChange={(e) => updateHeader(i, e.target.value)}
                                   className="w-full bg-neutral-800 text-orange-500 font-bold p-2 focus:outline-none focus:bg-neutral-700"
                               />
                               <button 
                                 onClick={() => removeColumn(i)}
                                 className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-0.5 hover:scale-110 transition-all z-10"
                                 title="Remove Column"
                               >
                                   <X className="w-3 h-3" />
                               </button>
                           </th>
                       ))}
                       <th className="w-8 border-none bg-transparent"></th>
                   </tr>
               </thead>
               <tbody>
                   {rows.map((row, rowIndex) => (
                       <tr key={rowIndex} className="group/row">
                           {row.map((cell, colIndex) => (
                               <td key={colIndex} className="border border-neutral-700 p-0">
                                   <input 
                                       value={cell}
                                       onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                       className="w-full bg-transparent text-gray-300 p-2 focus:outline-none focus:bg-white/5"
                                   />
                               </td>
                           ))}
                           <td className="border-none p-2 text-center opacity-0 group-hover/row:opacity-100">
                               <button onClick={() => removeRow(rowIndex)} className="text-neutral-600 hover:text-red-500 transition-colors">
                                   <Trash className="w-4 h-4" />
                               </button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
    </div>
  );
};

export default TableBlockEditor;
