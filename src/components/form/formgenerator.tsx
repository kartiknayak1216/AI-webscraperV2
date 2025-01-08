import React from 'react';
import { useForm, UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@hookform/error-message';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  type: 'text' | 'email' | 'password';
  inputType: 'select' | 'input' | 'textarea';
  register: UseFormRegister<any>;
  error: FieldErrors<FieldValues>;
  defaultValue?: string;
  placeholder?: string;
  name: string;
  label?: string;
  form?: string;
  lines?: number;
  options?: {
    value: string;
    label: string;
    id: string;
  }[];
};

export default function FormGenerator({
  error,
  inputType,
  lines,
  label,
  form,
  name,
  options,
  register,
  type,
  defaultValue,
  placeholder,
}: Props) {

  const renderErrorMessage = (name: string, error: FieldErrors<FieldValues>) => (
    <ErrorMessage
      errors={error}
      name={name}
      render={({ message }) => (
        <p className="text-red-400 mt-2">{message === 'Required' ? '' : message}</p>
      )}
    />
  );

  switch (inputType) {
    case 'input':
      return (
        <div className="flex flex-col gap-2">
          {label && <Label>{label}</Label>}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            form={form}
            defaultValue={defaultValue}
            {...register(name)}
          />
          {renderErrorMessage(name, error)}
        </div>
      );

    case 'textarea':
      return (
        <div className="flex flex-col gap-2">
          {label && <Label>{label}</Label>}
          <Textarea
            id={`input-${label}`}
            rows={lines}
            placeholder={placeholder}
            form={form}
            defaultValue={defaultValue}
            {...register(name)}
          />
          {renderErrorMessage(name, error)}
        </div>
      );

    case 'select':
      return (
        <div className="flex flex-col gap-2">
          {label && <Label>{label}</Label>}
          <Select>
            <SelectTrigger
              className="w-full"
              form={form}
              id={`select-${label}`}
              {...register(name)}
            >
              <SelectValue placeholder={placeholder} />
              <SelectContent>
                <SelectGroup>
                  {options?.map((option) => (
                    <SelectItem value={option.value} key={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </SelectTrigger>
          </Select>
          {renderErrorMessage(name, error)}
        </div>
      );
  }
}
