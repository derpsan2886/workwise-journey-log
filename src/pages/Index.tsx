import React from 'react';
import { WorkItemComponent, type WorkItem } from '@/components/WorkItem';
import { AddWorkItemDialog } from '@/components/AddWorkItemDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { LayoutGrid, CalendarDays } from 'lucide-react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

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

  const statusColors = {
    'not-started': 'bg-gray-200',
    'in-progress': 'bg-yellow-200',
    'completed': 'bg-green-200'
  };

  const getCalendarDates = () => {
    if (workItems.length === 0) return [];
    
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return allDays.map(date => {
      const itemsForDate = filteredItems.filter(item => 
        isWithinInterval(date, { start: item.startDate, end: item.endDate })
      );
      return { date, items: itemsForDate };
    });
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
          <div className="space-y-4">
            {filteredItems.map(item => (
              <div key={item.id} className="relative h-12 flex items-center">
                <div className="w-1/4">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-sm text-gray-500 block">{item.assignee}</span>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 right-0">
                    <div 
                      className={`h-8 rounded ${statusColors[item.status]} relative`}
                      style={{
                        width: '100%',
                        marginLeft: `${(new Date(item.startDate).getDate() - 1) * (100/31)}%`,
                        width: `${((new Date(item.endDate).getDate() - new Date(item.startDate).getDate() + 1) * (100/31))}%`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-sm">
                        {`${format(new Date(item.startDate), 'MMM d')} - ${format(new Date(item.endDate), 'MMM d')}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-31 gap-0 mt-2 border-t pt-2">
              {Array.from({ length: 31 }, (_, i) => (
                <div key={i} className="text-center text-xs text-gray-500">
                  {i + 1}
                </div>
              ))}
            </div>
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