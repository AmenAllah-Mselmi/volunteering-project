import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import  FindUs  from "@/components/Home/FindUs"
export default function Page() {
  return (
    <>
      
        <div className="@container/main flex flex-1 flex-col gap-2 w-screen">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-9/12">
            <SectionCards />
            <FindUs />
          </div>
        </div>
    </>
  )
}