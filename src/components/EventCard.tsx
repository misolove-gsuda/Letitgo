import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ExternalLink, CheckCircle2, XCircle, Clock, Tag } from 'lucide-react';
import { Event } from '../types';
import { cn } from '../lib/utils';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const statusColors = {
    open: 'bg-green-100 text-green-700 border-green-200',
    closed: 'bg-red-100 text-red-700 border-red-200',
    upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const statusIcons = {
    open: <CheckCircle2 className="w-4 h-4" />,
    closed: <XCircle className="w-4 h-4" />,
    upcoming: <Clock className="w-4 h-4" />,
  };

  const statusLabels = {
    open: '신청 가능',
    closed: '마감',
    upcoming: '예정',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5",
            statusColors[event.registrationStatus]
          )}>
            {statusIcons[event.registrationStatus]}
            {statusLabels[event.registrationStatus]}
          </span>
          {event.isFree && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
              무료
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            {event.category}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
        {event.title}
      </h3>

      <div className="space-y-2.5 mb-6 flex-grow">
        <div className="flex items-center text-slate-500 text-sm gap-2">
          <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-slate-500 text-sm gap-2">
          <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        <div className="flex items-center text-slate-500 text-sm gap-2">
          <span className="font-medium text-slate-700 shrink-0">주최:</span>
          <span className="line-clamp-1">{event.organizer}</span>
        </div>
        <p className="text-slate-600 text-sm mt-4 line-clamp-3 leading-relaxed">
          {event.description}
        </p>
      </div>

      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all duration-300 active:scale-95"
      >
        상세 보기 및 신청
        <ExternalLink className="w-4 h-4" />
      </a>
    </motion.div>
  );
};
