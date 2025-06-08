import SalaryCalculator from "@/components/SalaryCalculator";
import Head from 'next/head';

export default function Home() {
    return (
        <>
            <Head>
                <title key="title">Salary Calculator | حاسبة الرواتب</title>
                <meta key="meta-title" name="title" content="Salary Calculator" />
            </Head>
            
            <main className="relative">
                <h1 className="text-3xl font-bold text-center my-6">حاسبة الرواتب والمستحقات</h1>
                <SalaryCalculator />
            </main>
        </>
    );
}