# Snoonu Creator Program

A two-sided marketplace connecting content creators with Snoonu restaurant partners for marketing collaborations. Built for the Snoonu Hackathon 2026.

## Features

### For Creators
- **Apply to the Program**: Multi-step application form with eligibility criteria (social handles, follower counts, portfolio)
- **Browse Marketing Gigs**: Discover campaigns from Qatar's top restaurants with filtering by content type, budget, and category
- **Apply to Gigs**: Submit personalized pitches to merchants
- **Dashboard**: Track applications, earnings, and discover new opportunities

### For Merchants
- **Create Campaigns**: Post marketing gigs with detailed briefs, deliverables, requirements, and compensation
- **Review Applications**: Accept or decline creator applications
- **Dashboard**: Manage all campaigns and track creator engagement

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom Snoonu brand theme
- **State Management**: React Context + LocalStorage for persistence
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Demo Mode

The app includes demo login buttons in the header for quick access:
- **Creator Demo**: Log in as an approved creator (Sara Al-Mahmoud) to browse and apply to gigs
- **Merchant Demo**: Log in as a restaurant (Al Shami Restaurant) to create gigs and review applications

## Project Structure

```
/app
  /page.tsx                 # Landing page
  /apply/page.tsx           # Creator application form
  /dashboard/page.tsx       # Creator dashboard
  /gigs/page.tsx            # Gig marketplace
  /gigs/[id]/page.tsx       # Gig detail page
  /merchant/page.tsx        # Merchant dashboard
  /merchant/create/page.tsx # Create new gig
/components
  /ui/                      # Shared UI components (Button, Card, Input, Badge)
  /layout/                  # Header, Footer
  /gigs/                    # GigCard, GigFilters
/lib
  /storage.ts               # LocalStorage helpers
  /data.ts                  # Mock data seed
  /types.ts                 # TypeScript interfaces
/context
  /AppContext.tsx           # Global state with LocalStorage sync
```

## Brand Colors

The app uses Snoonu's brand colors:
- **Primary**: Purple (#8B1874)
- **Accent**: Yellow (#FFD700)
- **Orange**: (#FF6B35)

## User Flows

### Creator Flow
1. Visit landing page → Learn about the program
2. Apply as Creator → Fill multi-step form with eligibility
3. Get approved → Access creator dashboard
4. Browse gigs → Filter by type, budget, category
5. View gig details → Read brief, requirements, compensation
6. Apply to gig → Submit personalized pitch
7. Track application → See status in dashboard

### Merchant Flow
1. Log in as merchant → Access merchant dashboard
2. Create new gig → Define campaign details, deliverables, requirements
3. Publish gig → Campaign goes live
4. Review applications → Accept or decline creators
5. Work with creator → Content creation and approval

## Data Models

- **Creator**: Profile, social handles, follower counts, portfolio, status
- **Merchant**: Business profile, location, rating
- **Gig**: Campaign details, deliverables, requirements, compensation, deadline
- **Application**: Creator's pitch, status, timestamps

## License

Built for the Snoonu Hackathon 2026. Made with 💜 in Qatar.
