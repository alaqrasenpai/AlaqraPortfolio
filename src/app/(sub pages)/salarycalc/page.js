import SalaryCalculator from "@/components/SalaryCalculator";
import Head from 'next/head';

export const metadata = {
    title: "حاسبة الرواتب والمستحقات | Salary Calculator",
    description: "أداة لحساب الرواتب والمستحقات للموظفين بناءً على بيانات وزارة المالية",
};

export default function SalaryPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">
                حاسبة الرواتب والمستحقات
            </h1>

            <SalaryCalculator />
        </div>
    );
}
