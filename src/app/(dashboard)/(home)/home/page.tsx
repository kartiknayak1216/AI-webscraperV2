import { Suspense } from "react";
import Periodselection from "./periodselection";
import { GetPeriod, GetStat, getstatsForday } from "./server/server";
import { Skeleton } from "@/components/ui/skeleton";
import Statuscardhed from "./statuscard";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import Statsday from "./statsday";
import CreditConsumedChart from "./creditconsume";

export default async function page({
    searchParams
  }: {
    searchParams: { month?: string; year?: string };
  }) {

    const current = new Date();
    const { month, year } = searchParams;

    const period={
        month:month?parseInt(month):current.getMonth()+1,
        year: year ? parseInt(year) : current.getFullYear(),

    }

    return(
       
        <div className='flex flex-1 flex-col h-full'>
        <div className='flex justify-between'>
          <h1 className='text-3xl font-bold'>Home</h1>
          <Suspense fallback={<Skeleton className='w-[180px] h-[40px]' />}>
            <PeriodSelection selected={period} />
          </Suspense>
        </div>
        <div className='h-full py-6 flex flex-col gap-4'>
                <Suspense fallback={<CardSkelton />}>
                  <StatusCards select={period} />
                </Suspense>
        
              
              </div>

              <div>
                <Suspense fallback={<Skeleton className="w-full h-[200px]"/>}>
                  <StaticCard selected={period}/>
                </Suspense>
              </div>
       </div>
    )
}

type Period = {
    month: number;
    year: number;
  };
  

async function PeriodSelection({ selected }: { selected: Period }) {
 const periods = await GetPeriod();
 if (!periods) {
    return null;
  }
  return(
    <div>
        <Periodselection period={periods} selected={selected}/>
    </div>
  )
}
async function StatusCards({ select }: { select: Period }) {

const status= await GetStat(select)
if(!status){
    return <div>Error while Fetching</div>;
}


return(<div>

<div className='grid gap-2 lg:grid-cols-3 min-h-[120px]  justify-between'>
      <Statuscardhed title={"Workflow Execution"} value={status.workflowexc} icon={CirclePlayIcon} />
      <Statuscardhed title={"Phase Execution"} value={status.phase} icon={WaypointsIcon} />
      <Statuscardhed title={"Credit Consumed"} value={status.credit} icon={CoinsIcon} />
    </div>

</div>)
}

function CardSkelton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-rows-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className='w-full min-h-[120px]' />
      ))}
    </div>
  );
}

async function StaticCard({ selected }: { selected: Period }) {
  const periods = await getstatsForday(selected);
  if (!periods) {
     return null;
   }
   return(
     <div className="flex flex-col gap-y-14">
      <Statsday stats={periods}/>
      <CreditConsumedChart stats={periods}/>
     </div>
   )
 }