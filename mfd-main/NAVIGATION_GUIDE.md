# Navigation Guide

## Quick Access to Key Features

The MFD Advisor Platform now has easy navigation to all major features through the **Quick Access** dropdown menu in the header.

### Accessing Features from Advisor Dashboard

#### Quick Access Dropdown Menu (⚡ Icon)
Located in the header of the Advisor Dashboard, this dropdown provides instant access to:

1. **Advanced Fund Curation** (Iteration 3)
   - Route: `/advisor/curate-advanced/:clientId`
   - Icon: Blue bar chart
   - Description: AI-powered fund selection tool
   - Features:
     - Dual-panel fund explorer
     - Advanced filtering by category, risk, returns, expense ratio
     - Fund comparison matrix (up to 5 funds)
     - AI recommendations
     - Portfolio allocation visualization
     - Template library for advisor notes

2. **Client Proposal View** (Iteration 4)
   - Route: `/client/proposal`
   - Icon: Purple document
   - Description: Preview client experience
   - Features:
     - Hero section with advisor credentials
     - Interactive risk profile summary
     - Beginner-friendly fund cards
     - Sticky investment summary
     - Educational content (FAQ, glossary)
     - Chat widget integration

3. **Client Management Table** (Iteration 2)
   - Route: `/advisor/clients`
   - Icon: Gray users
   - Description: Advanced client list view
   - Features:
     - Multi-level filtering & search
     - Dynamic columns & sorting
     - Inline actions
     - Quick view panel
     - Bulk operations
     - Engagement scoring

### Navigation from Client Management Table

From the Client Management Table, you can:

1. **Curate Funds for a Client**
   - Click the "Curate" button in the actions column
   - Or click "Create Proposal" in the quick view panel
   - Both navigate to: `/advisor/curate-advanced/:clientId`

2. **View Client Details**
   - Click on any client row to open the quick view panel
   - Access client engagement metrics, tags, and notes

### All Available Routes

#### Advisor Routes
- `/advisor/dashboard` - Main control center
- `/advisor/clients` - Client management table (Iteration 2)
- `/advisor/onboarding-link` - Share onboarding link
- `/advisor/curate/:clientId` - Legacy fund curation
- `/advisor/curate-advanced/:clientId` - Advanced fund curation (Iteration 3)

#### Client Routes
- `/client/onboard` - Client onboarding flow
- `/client/funds` - Legacy fund recommendation
- `/client/proposal` - Client proposal view (Iteration 4)

### Quick Navigation Tips

1. **Keyboard Shortcuts** (Coming Soon)
   - `Cmd/Ctrl + K` - Quick command palette
   - `Cmd/Ctrl + /` - Toggle quick access menu

2. **Hover to Open**
   - The Quick Access dropdown opens on hover
   - No need to click to see options

3. **Responsive Design**
   - On mobile, some buttons are hidden
   - Quick Access menu adapts to screen size

4. **Dark Mode Support**
   - All navigation elements work in both light and dark modes
   - Smooth transitions when switching themes

### Feature Highlights

#### Iteration 3: Advanced Fund Curation
- **Demo Client ID**: `client_001` (Priya Sharma)
- **Access**: Quick Access → Advanced Fund Curation
- **Key Features**:
  - 20+ funds in database
  - Real-time filtering
  - Side-by-side comparison
  - AI recommendations based on risk profile

#### Iteration 4: Client Proposal View
- **Access**: Quick Access → Client Proposal View
- **Key Features**:
  - Conversion-optimized design
  - Magazine-style fund cards
  - Interactive elements
  - Real-time chat support
  - Status tracking

#### Iteration 2: Client Management Table
- **Access**: Quick Access → Client Management Table
- **Key Features**:
  - 8 demo clients with engagement data
  - Advanced filtering (stage, score, tags)
  - Bulk operations
  - Export capabilities (coming soon)

### Browser Support

The navigation system works best on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility

All navigation elements include:
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure

### Troubleshooting

**Quick Access menu not appearing?**
- Ensure you're on the Advisor Dashboard
- Try refreshing the page
- Check browser console for errors

**Navigation not working?**
- Verify the dev server is running
- Check the browser URL bar
- Clear browser cache and reload

**Dark mode issues with navigation?**
- Toggle theme to see if it resolves
- Check if system dark mode is interfering

### Next Steps

Explore each feature:
1. Start with Client Management Table to see all clients
2. Select a client and curate funds using Advanced Fund Curation
3. Preview the client experience with Client Proposal View
4. Toggle between light and dark modes to see the full design
