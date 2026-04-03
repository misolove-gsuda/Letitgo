export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  isFree: boolean;
  registrationStatus: 'open' | 'closed' | 'upcoming';
  category: 'AI' | 'IT' | 'Development' | 'Conference' | 'Meetup';
  link: string;
  description: string;
  sourceUrl?: string;
}

export interface SearchResult {
  events: Event[];
  lastUpdated: string;
}
