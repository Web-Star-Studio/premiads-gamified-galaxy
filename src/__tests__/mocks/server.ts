
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Define handlers for your API endpoints
const handlers = [
  // Example API route handler for documentation
  rest.get('/api/v1/:section', (req, res, ctx) => {
    const section = req.params.section;
    
    return res(
      ctx.status(200),
      ctx.json({
        title: `${section} Documentation`,
        content: `This is the content for ${section} documentation`,
        lastUpdated: '2025-04-17T12:00:00Z'
      })
    );
  }),
];

// Setup MSW server with the handlers
export const server = setupServer(...handlers);
