import React from 'react';
import { WorkItemComponent, type WorkItem } from '@/components/WorkItem';
import { AddWorkItemDialog } from '@/components/AddWorkItemDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { LayoutGrid, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

const Index = () => {
  const [workItems, setWorkItems] = React.useState<WorkItem[]>([]);
  const [filter, setFilter] = React.useState<WorkItem['status'] | 'all'>('all');
  const [view, setView] = React.useState<'grid' | 'calendar'>('grid');

  console.log('Current work items:', workItems);
  console.log('Current filter:', filter);
  console.log('Current view:', view);

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

  const getCalendarDates = () => {
    const dates: { date: Date; items: WorkItem[] }[] = [];
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      const itemsForDate = filteredItems.filter(item => {
        const itemStartDate = new Date(item.startDate);
        const itemEndDate = new Date(item.endDate);
        return currentDate >= itemStartDate && currentDate <= itemEndDate;
      });
      
      if (itemsForDate.length > 0) {
        dates.push({ date: new Date(d), items: itemsForDate });
      }
    }
    return dates;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Work Progress Tracker</h1>
        <div className="flex items-center space-x-4">
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
          <div className="flex space-x-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              onClick={() => setView('grid')}
              size="icon"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'calendar' ? 'default' : 'outline'}
              onClick={() => setView('calendar')}
              size="icon"
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <WorkItemComponent
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <Calendar
            mode="single"
            selected={new Date()}
            modifiers={{
              hasItems: getCalendarDates().map(d => d.date),
            }}
            modifiersStyles={{
              hasItems: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fontWeight: '600',
              },
            }}
            components={{
              DayContent: ({ date }) => {
                const dateItems = getCalendarDates().find(
                  d => d.date.toDateString() === date.toDateString()
                );
                return (
                  <div className="relative w-full h-full">
                    <div>{date.getDate()}</div>
                    {dateItems && (
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="h-1 bg-blue-500 rounded-full" />
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
          <div className="mt-4">
            {getCalendarDates().map(({ date, items }) => (
              <div key={date.toISOString()} className="mb-4">
                <h3 className="font-semibold mb-2">{format(date, 'MMMM d, yyyy')}</h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="p-2 bg-gray-50 rounded">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.assignee}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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