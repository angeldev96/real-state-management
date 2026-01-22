# Technical Documentation

Welcome to the Eretz Realty Admin System Technical Documentation. This comprehensive guide is designed for developers, system architects, and technical staff who need to understand, maintain, or extend the system.

## Technology Stack

The Eretz Realty Admin System is a modern full-stack web application:

- **Frontend**: React 19, Next.js 16, Tailwind CSS 4, Radix UI
- **Backend**: Next.js API Routes, Server Components & Server Actions
- **Database**: SQLite with Drizzle ORM (Turso-compatible)
- **Email**: Resend.io API for transactional emails
- **Authentication**: JWT-based with HTTP-only cookies
- **Testing**: Vitest (unit), Playwright (E2E), Testing Library

## Documentation Sections

### Core System

#### [System Architecture](./architecture.md)
Complete architectural overview including:
- Full-stack monolith architecture
- Next.js App Router patterns
- Server Components vs Client Components
- Data flow and request lifecycle
- Authentication flow diagrams
- Email distribution system
- File structure and organization
- Technology stack details

#### [Database Schema](./database-schema.md)
Comprehensive database documentation:
- Complete entity-relationship diagrams
- All table schemas with column details
- Relationships and foreign keys
- Indexes and constraints
- Migration strategy
- Seed data
- Backup and restore procedures
- Performance considerations

#### [API Reference](./api-reference.md)
Complete API documentation:
- REST API endpoints (authentication, users, cycle rotation)
- Server Actions (listings, email, configuration)
- Database query functions
- Request/response formats
- Error handling
- Authentication requirements
- Example requests and responses

### Authentication & Security

#### [Authentication & Authorization](./authentication.md)
In-depth authentication guide:
- JWT token generation and verification
- Password hashing with bcrypt
- Refresh token management
- HTTP-only cookie security
- Role-based access control (RBAC)
- Session management
- Route protection patterns
- Security best practices
- Testing authentication

### Development & Deployment

#### [Development Setup](./development-setup.md)
Complete development environment guide:
- Prerequisites and installation
- Environment configuration
- Database setup and migrations
- Development workflow
- Hot reload and debugging
- Common development tasks
- Troubleshooting guide
- Code quality tools

#### [Deployment Guide](./deployment-guide.md)
Production deployment documentation:
- Vercel deployment (recommended)
- Alternative platforms (Railway, Docker)
- Environment variables reference
- Database migration strategy
- Cron job configuration
- Performance optimization
- Monitoring and logging
- Backup strategy
- Rollback procedures

### Email System

#### [Email System Architecture](./email-system.md)
Email distribution system documentation:
- Three-cycle rotation mechanism
- Email template generation
- Resend.io integration
- HTML template structure
- Batch sending strategies
- Cron endpoint implementation
- Domain verification
- Deliverability best practices
- Testing and monitoring

## Quick Start for Developers

### First-Time Setup

```bash
# Clone repository
git clone <repository-url>
cd real-state-management

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your keys

# Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Apply migrations
npm run db:seed          # Seed database
npm run db:studio        # Open database GUI

# Testing
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Coverage report

# Code Quality
npm run type-check       # TypeScript checks
npm run lint             # ESLint
```

## Architecture Highlights

### Server Components First
- Default server-side rendering
- Direct database access in components
- Minimal JavaScript sent to client
- Automatic code splitting

### Server Actions for Mutations
- Type-safe form submissions
- Automatic revalidation
- Built-in CSRF protection
- Progressive enhancement

### Three-Cycle Distribution
- Automated weekly rotation
- 3 groups of properties
- Prevents subscriber fatigue
- Consistent engagement

### JWT + Refresh Tokens
- Secure authentication
- HTTP-only cookies
- 7-day access tokens
- Session management

## Common Development Scenarios

### Adding a New Feature

1. **Plan**: Define requirements and design
2. **Database**: Update schema if needed (`lib/db/schema.ts`)
3. **Migrate**: Generate and apply migration
4. **API**: Create Server Action or API route
5. **UI**: Build React components
6. **Test**: Write unit and E2E tests
7. **Deploy**: Push to repository

### Modifying Email Template

1. Edit `lib/email/index.ts`
2. Update HTML generation functions
3. Test with `sendSamplePropertiesEmailAction()`
4. Verify in multiple email clients
5. Deploy changes

### Adding a New API Endpoint

1. Create route handler in `app/api/your-endpoint/route.ts`
2. Implement authentication checks
3. Add business logic
4. Document in API Reference
5. Write tests

## Best Practices

### Code Organization
- Server Components for pages
- Client Components for interactivity
- Server Actions for mutations
- Centralized database queries
- Reusable UI components

### Security
- Never expose secrets in code
- Always validate user input
- Use parameterized queries
- Implement proper authorization
- Keep dependencies updated

### Performance
- Use Server Components by default
- Minimize client-side JavaScript
- Implement proper caching
- Optimize database queries
- Use pagination for large datasets

### Testing
- Write tests for critical paths
- Test authentication flows
- Test database migrations
- E2E tests for user journeys
- Mock external services

## Troubleshooting

**Common Issues:**

- **Build Errors**: Check TypeScript errors, missing dependencies
- **Database Locked**: Close other connections, restart server
- **Authentication Fails**: Verify JWT_SECRET matches
- **Email Not Sending**: Check RESEND_API_KEY and domain verification
- **Cron Not Triggering**: Verify schedule and authentication headers

See individual guides for detailed troubleshooting.

## Contributing

When contributing to the technical documentation:

1. Follow existing structure and style
2. Include code examples
3. Update diagrams if needed
4. Test all code snippets
5. Cross-reference related sections

## Additional Resources

- **Source Code**: Review inline comments for implementation details
- **TypeScript Types**: `lib/types.ts` for type definitions
- **Database Schema**: `lib/db/schema.ts` for table structure
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Drizzle ORM**: [orm.drizzle.team](https://orm.drizzle.team)
- **Resend API**: [resend.com/docs](https://resend.com/docs)

## Getting Help

- Review relevant documentation section
- Check troubleshooting guides
- Search GitHub issues
- Contact development team
- Consult Stack Overflow for framework-specific questions

---

**Documentation Version**: 1.0
**Last Updated**: January 2026
**System Version**: 1.0.0
