import SalaryCalculator from "@/components/SalaryCalculator";
import Head from "next/head";

export default function Home() {
    return (
        <>
            <Head>
                <title>Salary Calculator | حاسبة الرواتب والمستحقات</title>
                <meta name="description" content="أداة لحساب الرواتب والمستحقات للموظفين بناءً على بيانات وزارة المالية" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div className="container mx-auto px-4 py-8">

                    <SalaryCalculator />
                </div>
            </main>
        </>
    );
}