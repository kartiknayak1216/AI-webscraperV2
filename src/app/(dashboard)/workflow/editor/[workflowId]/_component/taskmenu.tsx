"use client";
import { TaskType } from '@/lib/types/task';
import React, { useRef } from 'react';
import { TaskRegistery } from '../../_task';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function Taskmenu() {
  return (
    <div className="relative h-screen overflow-hidden border-r w-[340px] min-w-[340px]">
   <Link href="/home">
      <div className="flex items-center justify-between p-4 border-b cursor-pointer">
        <div className="flex items-center gap-2 ml-2">
          <div className="flex flex-row">
            <span className="text-xl font-semibold">SCRAPE</span>
            <span className="text-xl font-normal">FLOW</span>
          </div>
        </div>
      </div></Link>

      <div className='mt-2'>
        <Accordion defaultValue={["extraction", "interaction","jsonoperation","asyncoperation","delivery"]} type="multiple" className="w-full">
          <AccordionItem value="extraction">
          <AccordionTrigger className="font-semibold text-md flex justify-center items-center gap-x-7 w-full">
             Data Extraction
             </AccordionTrigger>
              <AccordionContent className="flex flex-col">
              <TaskMenuBtn task={TaskType.PAGE_TO_HTML} />
              <TaskMenuBtn task={TaskType.EXTRACT_TEXT_FROM_HTML} />
            </AccordionContent>
          </AccordionItem>

         <AccordionItem value="interaction">
          <AccordionTrigger className="font-semibold text-md flex justify-center items-center gap-x-7 w-full">
             Web Interaction
             </AccordionTrigger>
              <AccordionContent className="flex flex-col">
              <TaskMenuBtn task={TaskType.FILL_INPUT} />
              <TaskMenuBtn task={TaskType.CLICK_ELEMENT} />
          </AccordionContent>
          </AccordionItem> 

          <AccordionItem value="jsonoperation">
          <AccordionTrigger className="font-semibold text-md flex justify-center items-center gap-x-7 w-full">
             JSON Operation
             </AccordionTrigger>
              <AccordionContent className="flex flex-col">
              <TaskMenuBtn task={TaskType.EXTRACT_TEXT_JSON} />
              <TaskMenuBtn task={TaskType.ADD_TEXT_JSON} />
              <TaskMenuBtn task={TaskType.MERGE_JSON} />
            </AccordionContent>
          </AccordionItem>


          <AccordionItem value="asyncoperation">
          <AccordionTrigger className="font-semibold text-md flex justify-center items-center gap-x-7 w-full">
             Async Operation
             </AccordionTrigger>
              <AccordionContent className="flex flex-col">
              <TaskMenuBtn task={TaskType.WAIT_FOR_ELEMENT} />
            </AccordionContent>
          </AccordionItem>


          <AccordionItem value="delivery">
          <AccordionTrigger className="font-semibold text-md flex justify-center items-center gap-x-7 w-full">
             Result Delivery
             </AccordionTrigger>
              <AccordionContent className="flex flex-col">
              <TaskMenuBtn task={TaskType.DELIVER_WEBHOOK} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dataai">
          <AccordionTrigger className="font-semibold text-md flex justify-center items-center gap-x-7 w-full">
            <div className='flex flex-row gap-2'>
              <div className=""> Data Extractaction Ai</div>
              <Badge className='font-bold bg-blue-500'>Ai</Badge>
            </div>
             </AccordionTrigger>
              <AccordionContent className="flex flex-col">
              <TaskMenuBtn task={TaskType.EXTRACT_DATA_WITH_AI} />
          </AccordionContent>
          </AccordionItem> 

        </Accordion>



     

      </div>
    </div>
  );
}

function TaskMenuBtn({ task }: { task: TaskType }) {
  const buttonRef = useRef<HTMLButtonElement|null>(null); // Create a ref for the drag image
  const tasks = TaskRegistery[task];

  const onDragStart = (event: React.DragEvent, type: TaskType) => {
    console.log("drag started")
    event.dataTransfer.setData("NODEDATA", type);
    event.dataTransfer.effectAllowed = "move";

    if (buttonRef.current) {
      event.dataTransfer.setDragImage(buttonRef.current, 0, 0); // Adjust the 50, 50 for the image position
    }
  };

  return (
    

      <Button
      ref={buttonRef}
        variant={"secondary"}
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        className="w-full cursor-grab border-black flex gap-2 dark:border-neutral-700 bg-gray-200 dark:bg-gray-800 rounded-lg p-3 mb-2 hover:bg-gray-300 dark:hover:bg-gray-700 active:bg-gray-400 dark:active:bg-gray-600 transition-all duration-200 ease-in-out hover:scale-104 active:scale-100 shadow-md"
      >
        <div className="flex items-center gap-2">
          <tasks.icon size={20} />
          <span>{tasks.label}</span>
        </div>
      </Button>
  )
}

