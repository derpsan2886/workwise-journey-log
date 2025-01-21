import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  assignee: string;
}

interface WorkItemProps {
  item: WorkItem;
  onStatusChange: (id: string, status: WorkItem['status']) => void;
}

const statusColors = {
  'not-started': 'bg-gray-200 text-gray-700',
  'in-progress': 'bg-yellow-200 text-yellow-700',
  'completed': 'bg-green-200 text-green-700'
};

const statusIcons = {
  'not-started': AlertCircle,
  'in-progress': Clock,
  'completed': CheckCircle2
};

export const WorkItemComponent: React.FC<WorkItemProps> = ({ item, onStatusChange }) => {
  const StatusIcon = statusIcons[item.status];
  
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <Badge className={statusColors[item.status]}>
          <StatusIcon className="w-4 h-4 mr-1" />
          {item.status.replace('-', ' ')}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{item.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{item.progress}%</span>
          </div>
          <Progress value={item.progress} className="w-full" />
        </div>
        <p className="text-sm mt-4">
          <span className="text-gray-500">Assignee: </span>
          {item.assignee}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {item.status !== 'completed' && (
          <Button 
            variant="outline"
            onClick={() => onStatusChange(item.id, 'completed')}
          >
            Mark Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};