"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SalaryCalculator = () => {
  const [salaries, setSalaries] = useState({
    2021: null,
    2022: null,
    2023: null,
    2024: null,
    2025: null
  });
  
  const [rowsData, setRowsData] = useState([]);
  const [totals, setTotals] = useState({
    paid: 0,
    duePaid: 0,
    due: 0
  });
  const [showResults, setShowResults] = useState(false);

  const salaryData = {
    "2021-11": { percent: 0.75 },
    "2021-12": { percent: 0.8 },
    "2022-01": { percent: 0.8 },
    "2022-02": { percent: 0.8 },
    "2022-03": { percent: 0.8, due: 0.16 },
    "2022-04": { percent: 0.8, due: 0.2 },
    "2022-05": { percent: 0.8, due: 0.05 },
    "2022-06": { percent: 0.8, due: 0.16 },
    "2022-07": { percent: 0.8, due: 0.1 },
    "2022-08": { percent: 0.8, due: 0.12 },
    "2022-09": { percent: 0.8, due: 0.1 },
    "2022-10": { percent: 0.8, due: 0.06 },
    "2022-11": { percent: 0.8, due: 0.05 },
    "2022-12": { percent: 0.8, due: 0.05 },
    "2023-01": { percent: 0.85 },
    "2023-02": { percent: 0.8, due: 0.05 },
    "2023-03": { percent: 1.0 },
    "2023-04": { percent: 0.8 },
    "2023-05": { percent: 0.85 },
    "2023-06": { percent: 0.85 },
    "2023-07": { percent: 0.85 },
    "2023-08": { percent: 0.9 },
    "2023-09": { percent: 0.9 },
    "2023-10": { percent: 0.5 },
    "2023-11": { percent: 0.65, due: 0.14 },
    "2023-12": { percent: 0.6, min: 2000 },
    "2024-01": { percent: 0.65, min: 2000 },
    "2024-02": { percent: 0.7, min: 2000 },
    "2024-03": { percent: 0.5, min: 2000 },
    "2024-04": { percent: 0.5, min: 2000 },
    "2024-05": { percent: 0.7, min: 3000 },
    "2024-06": { percent: 0.7, min: 3000 },
    "2024-07": { percent: 0.7, min: 3500 },
    "2024-08": { percent: 0.7, min: 3500 },
    "2024-09": { percent: 0.7, min: 3500 },
    "2024-10": { percent: 0.7, min: 3500 },
    "2024-11": { percent: 0.7, min: 3500 },
    "2024-12": { percent: 0.7, min: 3500 },
    "2025-01": { percent: 0.7, min: 3500 },
    "2025-02": { percent: 0.7, min: 3500 },
    "2025-03": { percent: 0.7, min: 3500 },
    "2025-04": { percent: 0.7, min: 3500 }
  };

  const handleSalaryChange = (year, value) => {
    setSalaries(prev => ({
      ...prev,
      [year]: value ? parseFloat(value) : null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateResults();
  };

  const calculateResults = () => {
    let newRowsData = [];
    let totalPaid = 0, totalDuePaid = 0, totalDue = 0;
    let dueAccumulated = 0;

    for (const [key, data] of Object.entries(salaryData)) {
      const [year, month] = key.split("-");
      const baseSalary = salaries[year];
      if (!baseSalary) continue;

      const percent = data.percent;
      const duePercent = data.due || 0;
      const minSalary = data.min || 0;

      const paid = Math.max(baseSalary * percent, minSalary);
      const duePaid = baseSalary * duePercent;

      dueAccumulated += (baseSalary - paid);
      dueAccumulated -= duePaid;

      totalPaid += paid;
      totalDuePaid += duePaid;
      totalDue = dueAccumulated;

      newRowsData.push({
        year,
        month,
        baseSalary,
        percent,
        duePercent,
        minSalary,
        originalPaid: paid,
        duePaid,
        dueAccumulated
      });
    }

    setRowsData(newRowsData);
    setTotals({
      paid: totalPaid,
      duePaid: totalDuePaid,
      due: totalDue
    });
    setShowResults(true);
  };

  const handlePaidChange = (index, value) => {
    const newValue = parseFloat(value) || 0;
    const updatedRows = [...rowsData];
    updatedRows[index].originalPaid = newValue;
    setRowsData(updatedRows);
    
    // Recalculate all rows
    let totalPaid = 0, totalDuePaid = 0, totalDue = 0;
    let dueAccumulated = 0;
    
    const recalculatedRows = updatedRows.map(row => {
      const baseSalary = row.baseSalary;
      const duePaid = row.duePaid;
      const paid = row.originalPaid;
      
      dueAccumulated += (baseSalary - paid);
      dueAccumulated -= duePaid;
      
      totalPaid += paid;
      totalDuePaid += duePaid;
      totalDue = dueAccumulated;
      
      return {
        ...row,
        dueAccumulated
      };
    });
    
    setRowsData(recalculatedRows);
    setTotals({
      paid: totalPaid,
      duePaid: totalDuePaid,
      due: totalDue
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-auto xl:max-w-4xl px-4 mx-auto lg:px-16 space-y-6 md:space-y-8"
    >
      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg">
        <div className="alert alert-warning text-center bg-yellow-600 text-white p-3 rounded mb-4" role="alert">
          ⚠️ هذه النتائج تقريبية وبناءً على بيانات وزارة المالية
        </div>

        <h1 className="mb-4 text-center text-2xl font-bold">حاسبة الرواتب والمستحقات</h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[2021, 2022, 2023, 2024, 2025].map(year => (
              <div key={year} className="col-span-1">
                <label className="block mb-2 text-sm font-medium">راتب {year}</label>
                <input
                  type="number"
                  className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-black focus:ring-2 focus:ring-blue-500"
                  value={salaries[year] || ''}
                  onChange={(e) => handleSalaryChange(year, e.target.value)}
                />
              </div>
            ))}
          </div>
          
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            احسب
          </button>
        </form>

        {showResults && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">النتائج:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3 border border-gray-700">السنة</th>
                    <th className="p-3 border border-gray-700">الشهر</th>
                    <th className="p-3 border border-gray-700">الراتب الأصلي</th>
                    <th className="p-3 border border-gray-700">النسبة المصروفة</th>
                    <th className="p-3 border border-gray-700">المبلغ المصروف</th>
                    <th className="p-3 border border-gray-700">المستحقات المصروفة</th>
                    <th className="p-3 border border-gray-700">المتبقي من المستحقات</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsData.map((row, index) => (
                    <tr key={`${row.year}-${row.month}`} className="hover:bg-gray-800">
                      <td className="p-3 border border-gray-700">{row.year}</td>
                      <td className="p-3 border border-gray-700">{row.month}</td>
                      <td className="p-3 border border-gray-700">{row.baseSalary}</td>
                      <td className="p-3 border border-gray-700">{(row.percent * 100).toFixed(0)}%</td>
                      <td className="p-3 border border-gray-700">
                        <input
                          type="number"
                          className="w-full p-1 rounded border border-gray-600 bg-yellow-100 text-black"
                          value={row.originalPaid.toFixed(2)}
                          onChange={(e) => handlePaidChange(index, e.target.value)}
                        />
                      </td>
                      <td className="p-3 border border-gray-700">
                        {row.duePaid > 0 ? row.duePaid.toFixed(2) : '-'}
                      </td>
                      <td className="p-3 border border-gray-700">
                        {row.dueAccumulated.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-800">
                  <tr>
                    <th colSpan="4" className="p-3 border border-gray-700">الإجمالي</th>
                    <th className="p-3 border border-gray-700">{totals.paid.toFixed(2)}</th>
                    <th className="p-3 border border-gray-700">{totals.duePaid.toFixed(2)}</th>
                    <th className="p-3 border border-gray-700">{totals.due.toFixed(2)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SalaryCalculator;