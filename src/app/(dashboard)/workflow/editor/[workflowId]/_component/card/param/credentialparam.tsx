"use client";

import { Label } from "@/components/ui/label";
import { TaskParams } from "@/lib/types/task";
import { cn } from "@/lib/utils";
import React, { useEffect, useId, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FetchCredentialServer } from "@/app/(dashboard)/(home)/credential/server/server";
import { Credential } from "@prisma/client";

export interface ParamProps {
  param: TaskParams;
  value: string | undefined;
  updateNodeParamValue: (data: string) => void;
  isReq: boolean;
}

export default function CredentialParam({
  param,
  value,
  updateNodeParamValue,
  isReq,
}: ParamProps) {
  const { name, helperText, required } = param;
  const id = useId();
  const [credential, setCredential] = useState<Credential[]>([]);

  const fetchdata = async () => {
    try {
      const res = await FetchCredentialServer();
      if (res.status === 200) {
        setCredential(res.data||[]);
      } else {
        console.error("Failed to fetch credentials:", res);
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className={cn("space-y-1 p-1 w-full")}>
      <Label htmlFor={id} className="text-xs flex">
        {name}
        {required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select
        onValueChange={(val) => {
          updateNodeParamValue(val);
        }}
        value={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {credential?.length > 0 ? (
              credential.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.name}
                </SelectItem>
              ))
            ) : (
              <p className="text-muted-foreground px-2">No credentials available.</p>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {helperText && (
        <p className="text-muted-foreground px-2">{helperText}</p>
      )}
    </div>
  );
}
