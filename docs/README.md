# Eretz Realty Admin System - Documentation

This directory contains the complete documentation for the Eretz Realty Admin System, built with [Docusaurus](https://docusaurus.io/).

## Documentation Structure

```
docs/
├── docs/                           # Documentation content
│   ├── user-documentation/         # End-user documentation
│   │   ├── index.md               # Introduction
│   │   ├── getting-started.md     # Getting started guide
│   │   ├── dashboard-cycle-manager.md
│   │   ├── managing-listings.md
│   │   ├── email-campaigns.md
│   │   ├── schedule-configuration.md
│   │   ├── email-recipients.md
│   │   ├── lookup-tables.md
│   │   └── user-management.md
│   └── technical-documentation/    # Developer documentation
│       └── index.md               # Technical docs placeholder
├── src/                           # Docusaurus customization
│   ├── components/                # React components
│   ├── css/                       # Custom styling
│   └── pages/                     # Custom pages
├── static/                        # Static assets
├── docusaurus.config.ts           # Docusaurus configuration
├── sidebars.ts                    # Sidebar structure
└── package.json                   # Dependencies
```

## User Documentation Sections

The user documentation is organized into the following sections:

### 📖 Introduction
- Overview of the Eretz Realty Admin System
- Key features and benefits
- System overview
- Three-cycle distribution explanation

### 🚀 Getting Started
- System requirements
- Accessing the system
- Logging in
- Understanding the interface
- Navigation guide
- User roles

### 📊 Core Features
1. **Dashboard & Cycle Manager**: Main workspace and cycle overview
2. **Managing Listings**: Creating, editing, and organizing properties
3. **Email Campaign Management**: Understanding and monitoring campaigns

### ⚙️ Configuration
1. **Schedule Configuration**: Setting up automated email schedules
2. **Email Recipients Management**: Managing subscriber lists
3. **Lookup Tables Management**: Customizing property attributes

### 👥 Administration
1. **User Management**: Admin-only user account management

## Technical Documentation

Technical documentation is currently in development and will include:

- System architecture
- Database schema
- API reference
- Development guide
- Component documentation
- Security and performance

## Getting Started with the Documentation

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

The documentation dependencies are already installed when you set up the main project. If needed, you can install them separately:

```bash
cd docs
npm install
```

### Local Development

Start the local development server:

```bash
cd docs
npm start
```

This command starts a local development server and opens up a browser window. The documentation will be available at `http://localhost:3000/`. Most changes are reflected live without having to restart the server.

### Building for Production

Build the static documentation site:

```bash
cd docs
npm run build
```

This command generates static content into the `build` directory that can be served using any static content hosting service.

### Serving Production Build Locally

After building, test the production build locally:

```bash
cd docs
npm run serve
```

## Customization

### Configuration

The main configuration file is `docusaurus.config.ts`. Key settings:

- **Site metadata**: Title, tagline, URL
- **Navigation**: Navbar and footer configuration
- **Theme**: Color mode, styling, and appearance
- **Plugins**: Docs and other plugin settings

### Sidebar Structure

The sidebar navigation is defined in `sidebars.ts`. The current structure:

- **userDocsSidebar**: User documentation with categories and sections
- **technicalDocsSidebar**: Technical documentation (auto-generated from directory)

To modify the sidebar:

1. Edit `sidebars.ts`
2. Add/remove/reorder items
3. Changes are reflected immediately in development mode

### Styling

Custom styles are in `src/css/custom.css`. You can:

- Override theme variables
- Add custom CSS classes
- Modify component styling

### Homepage

The homepage is a React component in `src/pages/index.tsx`. It features:

- Hero banner with title and call-to-action buttons
- Feature highlights
- Links to documentation sections

## Writing Documentation

### Markdown Files

Documentation is written in Markdown (`.md` files) with some Docusaurus-specific features:

#### Front Matter

Add metadata to the top of each page:

```markdown
---
id: unique-page-id
title: Page Title
sidebar_label: Sidebar Label
---
```

#### Admonitions

Use special callout boxes:

```markdown
:::tip
This is a helpful tip!
:::

:::warning
This is a warning!
:::

:::danger
This is dangerous!
:::

:::info
This is informational.
:::
```

#### Code Blocks

Include syntax-highlighted code:

````markdown
```javascript
console.log('Hello, world!');
```
````

#### Links

Internal links to other docs:

```markdown
[Link text](./other-page.md)
```

External links:

```markdown
[External link](https://example.com)
```

### Best Practices

1. **Use Clear Headers**: Organize content with H2 (`##`) and H3 (`###`) headers
2. **Add Context**: Provide examples and use cases
3. **Include Screenshots**: Visual aids help users understand (add to `static/img/`)
4. **Cross-Reference**: Link to related sections
5. **Keep Updated**: Update docs when features change
6. **Test Links**: Ensure all links work before publishing

## Deployment

### Vercel (Recommended)

1. Connect your Git repository to Vercel
2. Set build command: `cd docs && npm run build`
3. Set output directory: `docs/build`
4. Deploy

### Netlify

1. Connect your Git repository to Netlify
2. Set build command: `cd docs && npm run build`
3. Set publish directory: `docs/build`
4. Deploy

### GitHub Pages

```bash
cd docs
npm run deploy
```

Configure `docusaurus.config.ts` with your GitHub organization and repository name.

### Manual Deployment

Build the static site and upload the `build` directory to any static hosting service:

```bash
cd docs
npm run build
# Upload the contents of docs/build/ to your hosting provider
```

## Maintenance

### Adding New Documentation Pages

1. Create a new `.md` file in the appropriate directory:
   - User docs: `docs/user-documentation/new-page.md`
   - Technical docs: `docs/technical-documentation/new-page.md`

2. Add front matter to the file

3. Update `sidebars.ts` to include the new page in navigation

4. Write content using Markdown

5. Test locally with `npm start`

### Updating Existing Documentation

1. Locate the relevant `.md` file
2. Make your changes
3. Preview in development mode
4. Commit and deploy

### Adding Images

1. Add images to `static/img/`
2. Reference in Markdown:
   ```markdown
   ![Alt text](/img/your-image.png)
   ```

## Troubleshooting

### Build Errors

**Issue**: Broken links

**Solution**: Check that all internal links use correct paths. Docusaurus will error on broken links.

**Issue**: Missing dependencies

**Solution**: Run `npm install` in the `docs` directory.

### Development Server Issues

**Issue**: Port 3000 already in use

**Solution**:
```bash
npm start -- --port 3001
```

**Issue**: Changes not reflecting

**Solution**: Hard refresh browser (Ctrl+F5) or restart dev server.

### Sidebar Not Updating

**Issue**: New pages not appearing in sidebar

**Solution**: Check `sidebars.ts` and ensure the page is properly referenced.

## Contributing to Documentation

1. **Identify Need**: Find areas needing documentation or updates
2. **Draft Content**: Write clear, concise documentation
3. **Follow Style**: Match existing documentation style and structure
4. **Add Examples**: Include practical examples and use cases
5. **Test Locally**: Preview using `npm start`
6. **Review**: Check for typos, broken links, and accuracy
7. **Commit**: Submit changes with clear commit message

## Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [Docusaurus Markdown Features](https://docusaurus.io/docs/markdown-features)

## Support

For questions or issues with the documentation:

1. Check this README
2. Review Docusaurus documentation
3. Contact the development team
4. Open an issue in the project repository

---

**Last Updated**: January 2026
**Docusaurus Version**: 3.9.2
**License**: Proprietary - Eretz Realty
