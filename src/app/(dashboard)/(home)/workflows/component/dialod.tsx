'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Layers2Icon } from 'lucide-react';
import React, { useState } from 'react';
import CustomDialogheader from './CustomDialogheader';
import Workflowform from './form';

export default function Workflowdialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 text-sm font-medium">
          {triggerText ?? 'Create Workflow'}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 sm:max-w-lg w-full">
        <CustomDialogheader
          icon={Layers2Icon}
          title="Create Workflow"
          subTitle="Start building your workflow"
        />
        <div className="mt-6">
          <Workflowform />
        </div>
      </DialogContent>
    </Dialog>
  );
}
