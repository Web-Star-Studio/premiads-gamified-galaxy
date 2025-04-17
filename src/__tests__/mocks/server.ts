
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Define handlers for your API endpoints
const handlers = [
  // Example API route handler for documentation
  http.get('/api/v1/:section', ({ params }) => {
    const section = params.section;
    
    return HttpResponse.json({
      title: `${section} Documentation`,
      content: `This is the content for ${section} documentation`,
      lastUpdated: '2025-04-17T12:00:00Z'
    });
  }),
];

// Setup MSW server with the handlers
export const server = setupServer(...handlers);
