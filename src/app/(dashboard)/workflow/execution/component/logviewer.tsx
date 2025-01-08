import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExecutionLog } from "@prisma/client";



const LogTable = ({ logs }: { logs: ExecutionLog[] }) => {
  const getLogLevelClass = (logLevel: string) => {
    switch (logLevel.toLowerCase()) {
      case "error":
        return "text-red-500"; 
      case "warning":
        return "text-yellow-500"; 
      case "info":
        return "text-blue-500"; 
      case "success":
        return "text-green-500"; 
      default:
        return "text-gray-500"; 
    }
  };
console.log("log",logs)
  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Log Level</TableHead>
            <TableHead className="text-left">Message</TableHead>
            <TableHead className="text-left">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className={`font-medium ${getLogLevelClass(log.logLevel)}`}>
                {log.logLevel}
              </TableCell>
              <TableCell>{log.message}</TableCell>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogTable;
