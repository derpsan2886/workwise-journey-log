import React from 'react';
import { WorkItemComponent, type WorkItem } from '@/components/WorkItem';
import { AddWorkItemDialog } from '@/components/AddWorkItemDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [workItems, setWorkItems] = React.useState<WorkItem[]>([]);
  const [filter, setFilter] = React.useState<WorkItem['status'] | 'all'>('all');

  console.log('Current work items:', workItems);
  console.log('Current filter:', filter);

  const handleAddWorkItem = (newItem: Omit<WorkItem, 'id' | 'progress'>) => {
    const item: WorkItem = {
      ...newItem,
      id: Date.now().toString(),
      progress: 0,
    };
    setWorkItems(prev => [...prev, item]);
    console.log('Added new work item:', item);
  };

  const handleStatusChange = (id: string, status: WorkItem['status']) => {
    setWorkItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          progress: status === 'completed' ? 100 : item.progress
        };
      }
      return item;
    }));
    console.log('Updated status for item:', id, status);
  };

  const filteredItems = workItems.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Work Progress Tracker</h1>
        <Select
          value={filter}
          onValueChange={(value: WorkItem['status'] | 'all') => setFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <WorkItemComponent
            key={item.id}
            item={item}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No work items found. Add some using the button below!</p>
        </div>
      )}

      <AddWorkItemDialog onAdd={handleAddWorkItem} />
    </div>
  );
};

export default Index;