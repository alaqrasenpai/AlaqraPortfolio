"use client";

import { useState } from "react";

const monthsNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

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

export default function SalaryCalculator() {
  const [salaries, setSalaries] = useState({});
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ paid: 0, duePaid: 0, due: 0 });

  const handleChange = (e) => {
    setSalaries({ ...salaries, [e.target.name]: parseFloat(e.target.value) || "" });
  };

  const calculate = () => {
    let rows = [];
    let totalPaid = 0,
      totalDuePaid = 0,
      totalDue = 0,
      dueAccumulated = 0;

    for (const [key, data] of Object.entries(salaryData)) {
      const [year, month] = key.split("-");
      const baseSalary = salaries[`salary${year}`];
      if (!baseSalary) continue;

      const percent = data.percent;
      const duePercent = data.due || 0;
      const minSalary = data.min || 0;

      const paid = Math.max(baseSalary * percent, minSalary);
      const duePaid = baseSalary * duePercent;

      dueAccumulated += baseSalary - paid;
      dueAccumulated -= duePaid;

      totalPaid += paid;
      totalDuePaid += duePaid;
      totalDue = dueAccumulated;

      rows.push({ year, month, baseSalary, percent, paid, duePaid, dueAccumulated });
    }

    setResults(rows);
    setTotals({ paid: totalPaid, duePaid: totalDuePaid, due: totalDue });
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4 text-center">
        ⚠️ هذه النتائج تقريبية وبناءً على بيانات وزارة المالية.
        <br />
        <strong>في حال لم تكن تعمل في سنة معينة، اترك الحقل الخاص بها فارغًا.</strong>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {[2021, 2022, 2023, 2024, 2025].map((year) => (
          <div key={year}>
            <label className="block mb-1">راتب {year}</label>
            <input
              type="number"
              name={`salary${year}`}
              value={salaries[`salary${year}`] || ""}
              onChange={handleChange}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        ))}
      </div>

      <button onClick={calculate} className="bg-blue-600 text-white px-4 py-2 rounded">
        احسب
      </button>

      {results.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full border border-gray-300 text-center text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th>السنة</th>
                <th>الشهر</th>
                <th>الراتب الأصلي</th>
                <th>النسبة المصروفة</th>
                <th>المبلغ المصروف</th>
                <th>المستحقات المصروفة</th>
                <th>المتبقي</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  <td>{row.year}</td>
                  <td>{row.month}</td>
                  <td>{row.baseSalary}</td>
                  <td>{(row.percent * 100).toFixed(0)}%</td>
                  <td>{row.paid.toFixed(2)}</td>
                  <td>{row.duePaid ? row.duePaid.toFixed(2) : "-"}</td>
                  <td>{row.dueAccumulated.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={4} className="font-bold">
                  الإجمالي
                </td>
                <td>{totals.paid.toFixed(2)}</td>
                <td>{totals.duePaid.toFixed(2)}</td>
                <td>{totals.due.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <footer className="mt-10 text-center text-sm text-gray-500">
        الموقع من برمجة وتطوير
        <a
          href="https://alaqra.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mx-1"
        >
          alaqra.dev
        </a>
      </footer>
    </div>
  );
}
