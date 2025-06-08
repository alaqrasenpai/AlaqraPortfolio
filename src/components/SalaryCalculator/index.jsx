"use client";
import { useState } from 'react';
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
    "2021-11": { percent: 0.75, min: 1650 },
    "2021-12": { percent: 0.8, min: 1650 },
    "2022-01": { percent: 0.8, min: 2000 },
    "2022-02": { percent: 0.8, min: 2000 },
    "2022-03": { percent: 0.8, due: 0.16, min: 2000 },
    "2022-04": { percent: 0.8, due: 0.2, min: 2000 },
    "2022-05": { percent: 0.8, due: 0.05, min: 2000 },
    "2022-06": { percent: 0.8, due: 0.16, min: 2000 },
    "2022-07": { percent: 0.8, due: 0.1, min: 2000 },
    "2022-08": { percent: 0.8, due: 0.12, min: 2000 },
    "2022-09": { percent: 0.8, due: 0.1, min: 2000 },
    "2022-10": { percent: 0.8, due: 0.06, min: 2000 },
    "2022-11": { percent: 0.8, due: 0.05, min: 2000 },
    "2022-12": { percent: 0.8, due: 0.05, min: 2000 },
    "2023-01": { percent: 0.85, min: 2000 },
    "2023-02": { percent: 0.8, due: 0.05, min: 2000 },
    "2023-03": { percent: 1.0 },
    "2023-04": { percent: 0.8, min: 2000 },
    "2023-05": { percent: 0.85, min: 2000 },
    "2023-06": { percent: 0.85, min: 2000 },
    "2023-07": { percent: 0.85, min: 2000 },
    "2023-08": { percent: 0.9, min: 2000 },
    "2023-09": { percent: 0.9, min: 2000 },
    "2023-10": { percent: 0.5, min: 2000 },
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



  // const calculateResults = () => {
  //   let newRowsData = [];
  //   let totalPaid = 0, totalDuePaid = 0, totalDue = 0;
  //   let dueAccumulated = 0;

  //   for (const [key, data] of Object.entries(salaryData)) {
  //     const [year, month] = key.split("-");
  //     const baseSalary = salaries[year];
  //     if (!baseSalary) continue;

  //     const percent = data.percent;
  //     const duePercent = data.due || 0;
  //     const minSalary = data.min || 0;

  //     const calculated = baseSalary * percent;
  //     const paid = Math.min(
  //       calculated > minSalary ? calculated : minSalary,
  //       baseSalary
  //     );

  //     // حساب المستحقات المدفوعة من المتبقي السابق
  //     const duePaid = Math.min(dueAccumulated, baseSalary * duePercent);

  //     // تحديث المتبقي: (الراتب - المدفوع) + (المتبقي السابق - المستحقات المدفوعة)
  //     dueAccumulated = (baseSalary - paid) + (dueAccumulated - duePaid);

  //     totalPaid += paid;
  //     totalDuePaid += duePaid;
  //     totalDue = dueAccumulated;

  //     newRowsData.push({
  //       yearMonth: `${year}/${month}`,
  //       baseSalary,
  //       percent,
  //       duePercent,
  //       minSalary,
  //       originalPaid: paid,
  //       duePaid,
  //       dueAccumulated
  //     });
  //   }

  //   setRowsData(newRowsData);
  //   setTotals({
  //     paid: totalPaid,
  //     duePaid: totalDuePaid,
  //     due: totalDue
  //   });
  //   setShowResults(true);
  // };

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

      const calculated = baseSalary * percent;
      const paid = Math.min(
        calculated > minSalary ? calculated : minSalary,
        baseSalary
      );

      // حساب المستحقات المدفوعة كنسبة من المتبقي المتراكم وليس من الراتب الحالي
      const duePaid = duePercent * dueAccumulated;

      // تحديث المتبقي: (الراتب - المدفوع) + (المتبقي السابق - المستحقات المدفوعة)
      dueAccumulated = (baseSalary - paid) + (dueAccumulated - duePaid);

      totalPaid += paid;
      totalDuePaid += duePaid;
      totalDue = dueAccumulated;

      newRowsData.push({
        yearMonth: `${year}/${month}`,
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

  // const handlePaidChange = (index, value) => {
  //   const newValue = parseFloat(value) || 0;
  //   const updatedRows = [...rowsData];
  //   const baseSalary = updatedRows[index].baseSalary;

  //   updatedRows[index].originalPaid = newValue;

  //   // إعادة الحساب بنفس المنطق الجديد
  //   let totalPaid = 0, totalDuePaid = 0, totalDue = 0;
  //   let dueAccumulated = 0;

  //   const recalculatedRows = updatedRows.map(row => {
  //     const baseSalary = row.baseSalary;
  //     const duePercent = row.duePercent || 0;
  //     const paid = row.originalPaid;

  //     // حساب المستحقات المدفوعة من المتبقي السابق
  //     const duePaid = Math.min(dueAccumulated, baseSalary * duePercent);

  //     // تحديث المتبقي
  //     dueAccumulated = (baseSalary - paid) + (dueAccumulated - duePaid);

  //     totalPaid += paid;
  //     totalDuePaid += duePaid;
  //     totalDue = dueAccumulated;

  //     return {
  //       ...row,
  //       duePaid,
  //       dueAccumulated
  //     };
  //   });

  //   setRowsData(recalculatedRows);
  //   setTotals({
  //     paid: totalPaid,
  //     duePaid: totalDuePaid,
  //     due: totalDue
  //   });
  // };


  const handlePaidChange = (index, value) => {
    const newValue = parseFloat(value) || 0;
    const updatedRows = [...rowsData];

    // تحديث القيمة المدفوعة فقط
    updatedRows[index].originalPaid = newValue;

    // إعادة حساب كل القيم بدءًا من الصف المعدل
    let dueAccumulated = 0;
    let totalPaid = 0, totalDuePaid = 0, totalDue = 0;

    const recalculatedRows = updatedRows.map((row, i) => {
      // إذا كان هذا هو الصف الأول أو الصف المعدل أو ما بعده، نعيد الحساب
      if (i === 0 || i >= index) {
        const baseSalary = row.baseSalary;
        const duePercent = row.duePercent || 0;
        const paid = i === index ? newValue : row.originalPaid;

        // حساب المستحقات كنسبة من المتبقي المتراكم
        const duePaid = duePercent * dueAccumulated;

        // تحديث المتبقي
        dueAccumulated = (baseSalary - paid) + (dueAccumulated - duePaid);

        totalPaid += paid;
        totalDuePaid += duePaid;
        totalDue = dueAccumulated;

        return {
          ...row,
          originalPaid: paid,
          duePaid,
          dueAccumulated
        };
      } else {
        // للصفوف قبل الصف المعدل، نترك القيم كما هي ونضيفها للمجموع
        totalPaid += row.originalPaid;
        totalDuePaid += row.duePaid;
        dueAccumulated = row.dueAccumulated;
        return row;
      }
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
      className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 mx-auto space-y-4 md:space-y-6"
      dir="rtl"
    >
      <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="text-center bg-yellow-600 text-white p-2 sm:p-3 rounded mb-3 text-sm sm:text-base">
          ⚠️ هذه النتائج تقريبية وبناءً على بيانات وزارة المالية
        </div>

        <h1 className="mb-3 text-center text-xl sm:text-2xl font-bold">حاسبة الرواتب والمستحقات</h1>

        <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[2021, 2022, 2023, 2024, 2025].map(year => (
              <div key={year} className="col-span-1">
                <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-right">راتب {year}</label>
                <input
                  type="number"
                  className="w-full p-1 sm:p-2 text-xs sm:text-sm rounded border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 text-right placeholder-gray-400"
                  value={salaries[year] || ''}
                  onChange={(e) => handleSalaryChange(year, e.target.value)}
                  dir="ltr"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-3 px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors float-right text-sm sm:text-base"
          >
            احسب
          </button>
        </form>

        {showResults && (
          <div className="mt-4 sm:mt-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-right">النتائج:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" dir="rtl">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">السنة/الشهر</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">الراتب الأصلي</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">النسبة</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">المبلغ المصروف</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">المستحقات</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">المتبقي</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-800">
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{row.yearMonth}</td>
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{row.baseSalary}</td>
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{(row.percent * 100).toFixed(0)}%</td>
                      <td className="p-1 sm:p-2 border border-gray-700">
                        <input
                          type="number" step="1"
                          className="w-full p-0.5 sm:p-1 rounded border border-gray-600 bg-gray-700 text-white text-right text-xs sm:text-sm"
                          value={row.originalPaid.toFixed(2)}
                          onChange={(e) => handlePaidChange(index, e.target.value)}
                          dir="ltr"
                        />
                      </td>
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">
                        {row.duePaid > 0 ? row.duePaid.toFixed(2) : '-'}
                      </td>
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">
                        {row.dueAccumulated.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-800">
                  <tr>
                    <th colSpan="3" className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">الإجمالي</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{totals.paid.toFixed(2)}</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{totals.duePaid.toFixed(2)}</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{totals.due.toFixed(2)}</th>
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