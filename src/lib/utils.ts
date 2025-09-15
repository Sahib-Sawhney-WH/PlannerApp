import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date utilities
export const formatDate = (date: string | Date, format = 'MMM D, YYYY') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('MMM D, YYYY h:mm A');
};

export const formatRelativeTime = (date: string | Date) => {
  return dayjs(date).fromNow();
};

export const isOverdue = (date: string | Date) => {
  return dayjs(date).isBefore(dayjs());
};

export const isDueSoon = (date: string | Date, hours = 24) => {
  return dayjs(date).isBefore(dayjs().add(hours, 'hours'));
};

// ICE Score calculation
export const calculateICEScore = (impact: number, confidence: number, effort: number): number => {
  if (effort === 0) return 0;
  return (impact * confidence) / effort;
};

// Eisenhower Matrix
export const getEisenhowerQuadrant = (urgent: boolean, important: boolean) => {
  if (urgent && important) return 'do';
  if (!urgent && important) return 'schedule';
  if (urgent && !important) return 'delegate';
  return 'eliminate';
};

// Color utilities
export const getStatusColor = (status: string) => {
  const colors = {
    'Inbox': 'bg-muted',
    'Todo': 'bg-todo',
    'Doing': 'bg-doing',
    'Blocked': 'bg-blocked',
    'Done': 'bg-done',
    'Planned': 'bg-muted',
    'In Progress': 'bg-doing',
    'At Risk': 'bg-blocked',
    'Open': 'bg-warn',
    'Monitoring': 'bg-doing',
    'Closed': 'bg-done',
    'Resolved': 'bg-success',
  };
  return colors[status as keyof typeof colors] || 'bg-muted';
};

export const getTagColor = (tag: string) => {
  const colors = {
    'Sales pursuit': 'tag-presales',
    'Pre-sales': 'tag-presales',
    'Signed': 'tag-signed',
    'Implementing': 'tag-impl',
    'Enterprise': 'tag-impl',
    'Startup': 'tag-presales',
    'Fortune 500': 'tag-signed',
  };
  return colors[tag as keyof typeof colors] || 'bg-ring/20 text-muted';
};

export const getPriorityColor = (priority: number) => {
  if (priority >= 4) return 'text-danger';
  if (priority >= 3) return 'text-warn';
  return 'text-muted';
};

// Text utilities
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T) => {
  return array.reduce((groups, item) => {
    const group = item[key] as string;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Validation utilities
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Local storage utilities
export const getStorageItem = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorageItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Keyboard shortcut utilities
export const formatShortcut = (shortcut: string) => {
  return shortcut
    .replace('Ctrl', '⌃')
    .replace('Cmd', '⌘')
    .replace('Alt', '⌥')
    .replace('Shift', '⇧')
    .replace('+', ' ');
};

// File utilities
export const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Export/Import utilities
export const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

