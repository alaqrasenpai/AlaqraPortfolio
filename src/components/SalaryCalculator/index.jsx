"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const SalaryCalculator = () => {
  // ... (نفس حالة المكون السابقة)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 mx-auto space-y-4 md:space-y-6"
      dir="rtl"
    >
      <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="alert alert-warning text-center bg-yellow-600 text-white p-2 sm:p-3 rounded mb-3 text-sm sm:text-base">
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
                  className="w-full p-1 sm:p-2 text-xs sm:text-sm rounded border border-gray-600 bg-gray-800 text-black focus:ring-2 focus:ring-blue-500 text-right"
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
              <table className="w-full border-collapse min-w-[600px] sm:min-w-0" dir="rtl">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">السنة</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">الشهر</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">الراتب الأصلي</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">النسبة المصروفة</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">المبلغ المصروف</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">المستحقات المصروفة</th>
                    <th className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">المتبقي من المستحقات</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsData.map((row, index) => (
                    <tr key={`${row.year}-${row.month}`} className="hover:bg-gray-800">
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{row.year}</td>
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{row.month}</td>
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{row.baseSalary}</td>
                      <td className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">{(row.percent * 100).toFixed(0)}%</td>
                      <td className="p-1 sm:p-2 border border-gray-700">
                        <input
                          type="number"
                          className="w-full p-0.5 sm:p-1 rounded border border-gray-600 bg-yellow-100 text-black text-right text-xs sm:text-sm"
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
                    <th colSpan="4" className="p-1 sm:p-2 border border-gray-700 text-right text-xs sm:text-sm">الإجمالي</th>
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