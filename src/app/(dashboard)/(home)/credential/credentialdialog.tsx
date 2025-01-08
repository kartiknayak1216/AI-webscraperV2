'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheckIcon } from 'lucide-react';
import CustomDialogheader from '../workflows/component/CustomDialogheader';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CreateCredentialServer } from './server/server';
import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/navigation';

const credentialSchema = z.object({
  name: z.string().min(1, 'Credential name is required'),
  value: z.string().min(1, 'Credential value is required'),
});

export default function Credentialdialog({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);  
const router = useRouter()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(credentialSchema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setLoading(true);  
      const { name, value } = data as { name: string; value: string };

      const response = await CreateCredentialServer(name, value);

      if (response.status === 200) {
        toast.success('Credential created successfully!');
        reset();
        setOpen(false);
        router.refresh()
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error creating credential:', error);
      toast.error('An error occurred while creating the credential.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 text-sm font-medium">
          {triggerText ?? 'Create Credential'}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 sm:max-w-lg w-full">
        <CustomDialogheader
          icon={ShieldCheckIcon}
          title="Create Credential"
          subTitle="Secure your data with credentials"
        />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="name">Credential Name</Label>
            <Input
              id="name"
              placeholder="Enter credential name"
              {...register('name')}
              className="mt-2"
            />
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-red-400 mt-2">{message}</p>
              )}
            />
          </div>
          <div>
            <Label htmlFor="value">Credential Value</Label>
            <Input
              id="value"
              type="password"
              placeholder="Enter credential value"
              {...register('value')}
              className="mt-2"
            />
            <ErrorMessage
              errors={errors}
              name="value"
              render={({ message }) => (
                <p className="text-red-400 mt-2">{message}</p>
              )}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} >
              {loading ? 'Creating...' : 'Create Credential'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
