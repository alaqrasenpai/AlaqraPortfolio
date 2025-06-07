import { useState, useRef } from "react";
import Head from "next/head";

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
  "2025-04": { percent: 0.7, min: 3500 },
};

export default function SalaryCalculator() {
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ totalPaid: 0, totalDuePaid: 0, totalDue: 0 });
  const [showResults, setShowResults] = useState(false);

  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();

    const form = formRef.current;
    const salaries = {
      2021: parseFloat(form.salary2021.value) || null,
      2022: parseFloat(form.salary2022.value) || null,
      2023: parseFloat(form.salary2023.value) || null,
      2024: parseFloat(form.salary2024.value) || null,
      2025: parseFloat(form.salary2025.value) || null,
    };

    let totalPaid = 0,
      totalDuePaid = 0,
      totalDue = 0;
    let dueAccumulated = 0;

    const rows = [];

    for (const [key, data] of Object.entries(salaryData)) {
      const [year, month] = key.split("-");
      const baseSalary = salaries[year];
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

      rows.push({
        year,
        month,
        baseSalary,
        percent,
        paid,
        duePaid,
        dueAccumulated,
      });
    }

    setResults(rows);
    setTotals({ totalPaid, totalDuePaid, totalDue });
    setShowResults(true);
  }

  return (
    <>
      <Head>
        <title>حساب المستحقات والرواتب</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Bootstrap CSS CDN */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        body {
          direction: rtl;
          background-color: #f8f9fa;
          padding-bottom: 100px;
        }
        table th, table td {
          text-align: center;
          white-space: nowrap;
        }
        @media (max-width: 767px) {
          .year-input {
            margin-bottom: 15px;
          }
        }
      `}</style>

      <div className="container mt-4">
        <div className="alert alert-warning text-center" role="alert">
          ⚠️ هذه النتائج تقريبية وبناءً على بيانات وزارة المالية.
          <br />
          <strong>في حال لم تكن تعمل في سنة معينة، اترك الحقل الخاص بها فارغًا.</strong>
        </div>

        <h1 className="mb-4 text-center">حاسبة الرواتب والمستحقات</h1>

        <form id="salary-form" onSubmit={handleSubmit} ref={formRef}>
          <div className="row">
            {[2021, 2022, 2023, 2024, 2025].map((year) => (
              <div key={year} className="col-12 col-sm-6 col-md-2 year-input">
                <label>راتب {year}</label>
                <input type="number" className="form-control" name={`salary${year}`} />
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            احسب
          </button>
        </form>

        {showResults && (
          <div className="mt-4" id="results">
            <h3>النتائج:</h3>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>السنة</th>
                    <th>الشهر</th>
                    <th>الراتب الأصلي</th>
                    <th>النسبة المصروفة</th>
                    <th>المبلغ المصروف</th>
                    <th>المستحقات المصروفة</th>
                    <th>المتبقي من المستحقات</th>
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
                      <td>{row.duePaid > 0 ? row.duePaid.toFixed(2) : "-"}</td>
                      <td>{row.dueAccumulated.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-secondary">
                  <tr>
                    <th colSpan={4}>الإجمالي</th>
                    <th>{totals.totalPaid.toFixed(2)}</th>
                    <th>{totals.totalDuePaid.toFixed(2)}</th>
                    <th>{totals.totalDue.toFixed(2)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center mt-5 py-3 bg-dark text-white fixed-bottom">
        <div className="container">
          <small>
            الموقع من برمجة وتطوير{" "}
            <a
              href="https://alaqra.dev/"
              className="text-info text-decoration-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              alaqra.dev
            </a>
          </small>
        </div>
      </footer>
    </>
  );
}
