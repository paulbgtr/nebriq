# Nebriq Changelog

## [0.5.0-beta.1] - 2025-03-11

### Added ✨

- Integrate Pinecone vector database for improved semantic search
- Add client-side note synchronization with Pinecone
- Add Pinecone sync status indicator in editor
- Implement daily cleanup route for unused vector records
- Add admin client for service role access
- Add Vercel Speed Insights for performance tracking
- Add user authentication check for semantic search

### Changed 🔄

- Migrate from previous search system to Pinecone vector search
- Optimize notes sync with deduplication and selective updates
- Adjust Pinecone sync cron schedule to daily run
- Update OpenAI model import and response handling

### Fixed 🐛

- Fix Pinecone synchronization issues

## [0.4.3-beta.1] - 2025-03-07

### Added ✨

- Add model categorization by open source status
- Implement core AI model type definitions
- Update LangChain integrations
- Integrate new AI providers: Mistral AI and Grok
- Separate open source models from proprietary ones

### Changed 🔄

- Abstract LLM provider logic for improved maintainability
- Update AI model list with latest providers
- Remove summary generation action
- Improve D3 type safety and visualization components

## [0.4.2-beta.1] - 2025-03-07

### Added ✨

- Add visualization components for feature showcase on landing page
- Implement optimized neural network visualization with D3

### Changed 🔄

- Comprehensive landing page UI/UX redesign with enhanced visual components
- Complete editor redesign for improved user experience
- Optimize visualization components with performance improvements
- Improve type safety in D3 visualizations

### Fixed 🐛

- Fix editor focus issues
- Various linter fixes

## [0.4.1-beta.1] - 2025-03-06

### Added ✨

- Add smart view feature to library for improved content organization

### Changed 🔄

- Improve library design and user experience
- Enhance header actions design
- Improve filter bar design
- Remove star from smart view
- Enhance category design

## [0.4.0-beta.1] - 2025-03-06

### Added ✨

- Add note discovery feature for improved content exploration
- Implement semantic highlighting in editor
- Add TipTap highlight extension for better text editing

### Changed 🔄

- Enhance landing page with semantic highlighting
- Improve note highlight styles for better readability

## [0.3.4-beta.1] - 2025-03-05

### Fixed 🐛

- Fix race conditions in editor to improve stability
- Fix sync issues in note connections
- Improve landing page design consistency

### Changed 🔄

- Various linter fixes in editor components

## [0.3.3-beta.1] - 2025-03-05

### Fixed 🐛

- Fix chat markdown formatting for improved content rendering
- Fix issue where deleting current chat doesn't close it automatically (PAU-184)
- Fix new chat creation on first message
- Improve chat component behavior and user experience

## [0.3.2-beta.1] - 2025-03-05

### Added ✨

- Significant landing page update with improved UI

### Fixed 🐛

- Implement proper chat scroll functionality
- Fix library grid view layout bug
- Improve note list and note component rendering

### Changed 🔄

- Improve color scheme throughout the application

## [0.3.1-beta.1] - 2025-03-04

### Added ✨

- Implement chat history persistence
- Add sidebar navigation for chat history

### Fixed 🐛

- Fix editor hooks paths
- Fix linter issues throughout the codebase
- Improve chat component styling and functionality

### Changed 🔄

- Remove typewriter effect (temporarily due to bugs)
- Reorganize write module hooks for better maintainability
- Improve chat input focus behavior on new chat creation

## [0.3.0-beta.1] - 2025-03-04

- Completely redesign the app and polish the idea: integrate chat into search
- Update Landing page
- Redesign Library: actual library instead of search history
- Layout update: sidebar instead of navbar

## [0.2.0-beta.1] - 2025-03-02

### Added ✨

- Redesign chat
- Add note attachments
- Implement AI search in chat

Overall the chat is more useful and feature rich now.

## [0.1.0-beta.3] - 2025-02-24

- New landing page
- Make library more useful with filtering and better UI
- Redesing graph UI
- Update feedback form UI
- Update favicon and app's icon
- Deepen AI integration: add sources mentioned, improve collecting relevant notes
- Improve chat UI: make it more smooth and minimalist
- Implement parsing mathematical expressions in chat

## [0.1.0-beta.2] - 2025-02-24

### Added ✨

- Feedback email template
- Feedback popover

### Fixed 🐛

- Empty waitlist email

### Changed 🔄

- Auth page image

## [0.1.0-beta.1] - 2025-02-21

### Added ✨

- Initial beta release
- Note writing without folders
- AI-powered search
- Smart connections between notes
