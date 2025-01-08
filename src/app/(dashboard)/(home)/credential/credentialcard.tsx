"use client"
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Credential } from '@prisma/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteDialog from './deletedialog';
import { TooltipWraapper } from '@/components/global/tooltipwrapper';
import { FileTextIcon, MoreVerticalIcon, ShieldCheckIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';


export default function CredentialCard({ credential }: { credential: Credential }) {
    
    const createdAt = format(new Date(credential.createdAt), 'MM/dd/yyyy, hh:mm:ss a');
  
    return (
      <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
        <CardContent className="p-4 flex items-center justify-between h-[120px]">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              {/* Credential Icon */}
              <ShieldCheckIcon className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-semibold">{credential.name}</span>
            </div>
  
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <div>
                <div className="text-sm text-gray-500">Created At:</div>
                <div className="text-sm text-gray-600">{createdAt}</div>
              </div>
            </div>
  
    
          </div>
  
          <div className="flex items-center space-x-3">
            <FileTextIcon className="w-5 h-5 text-gray-500" />
            <WorkflowAction id={credential.id} workflowname={credential.name} />
          </div>
        </CardContent>
      </Card>
    );
  }

function WorkflowAction({ id, workflowname }: { id: string, workflowname: string }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <DeleteDialog open={open} setOpen={setOpen} workflowName={workflowname} id={id} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <TooltipWraapper content="More actions">
                <div className="flex items-center justify-center w-full h-full">
                  <MoreVerticalIcon size={18} />
                </div>
              </TooltipWraapper>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive flex items-center gap-2" onSelect={() => setOpen(true)}>
              <TrashIcon size={16} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }