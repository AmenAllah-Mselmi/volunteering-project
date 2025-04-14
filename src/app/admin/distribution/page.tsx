"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { distributionColumns } from './columns';
export default function DistributionsPage() {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:9090/api/distributions');
        const data = await response.json();
        setDistributions(data);
      } catch (error) {
        console.error('Failed to fetch distributions:', error);
      } finally {
        setLoading(false);
      }
    }
    const interval=setInterval(fetchData,5000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto py-10 flex flex-col items-center w-screen h-screen">
      <div className="w-11/12">
        <div className="flex justify-between items-center mb-6 w-4/5">
          <h1 className="text-2xl font-bold">Distributions</h1>
          <Button asChild>
            <Link href="/admin/distribution/create">New Distribution</Link>
          </Button>
        </div>
        <div className="w-full">
          <DataTable columns={distributionColumns} data={distributions} />
        </div>
      </div>
    </div>
  );
}