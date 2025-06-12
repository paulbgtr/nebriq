# 🤝 Contributing to Nebriq

Thank you for your interest in contributing to Nebriq! We're building the future of AI-powered note-taking, and we'd love your help making it even better.

## 🌟 Ways to Contribute

### 🐛 Bug Reports
Found a bug? Help us squash it!
- Check [existing issues](https://github.com/paulbgtr/nebriq/issues) first
- Use our bug report template
- Include steps to reproduce, expected vs actual behavior
- Screenshots/videos are super helpful

### 💡 Feature Requests
Have an idea for a new feature?
- Check if it's already been suggested
- Use our feature request template
- Explain the problem you're trying to solve
- Describe your proposed solution

### 🔧 Code Contributions
Ready to dive into the code?
- Fork the repository
- Create a feature branch (`git checkout -b feature/amazing-feature`)
- Make your changes
- Write tests if applicable
- Submit a pull request

### 📚 Documentation
Help improve our docs!
- Fix typos or unclear explanations
- Add examples or tutorials
- Improve code comments
- Update the README or guides

### 🎨 Design & UX
Design-minded? We'd love your input!
- UI/UX improvements
- Design system enhancements
- Accessibility improvements
- Mobile experience optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and Bun
- PostgreSQL database (or Supabase account)
- Pinecone account for vector search
- OpenAI API key

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/paulbgtr/nebriq.git
   cd nebriq
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in your environment variables
   ```

4. **Set up the database**
   ```bash
   # If using Supabase, run the migrations in the supabase/ folder
   # If using local PostgreSQL, set up your database schema
   ```

5. **Start the development server**
   ```bash
   bun dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Variables
Check `.env.example` for all required environment variables. Key ones include:
- Database connection (Supabase or PostgreSQL)
- Pinecone API key and environment
- OpenAI API key
- NextAuth secret and configuration

## 📋 Development Guidelines

### Code Style
- We use TypeScript exclusively
- Follow the existing code style (ESLint + Prettier configured)
- Use meaningful variable and function names
- Write self-documenting code with comments where needed

### Git Workflow
1. **Fork** the repository
2. **Create a branch** from `main`
3. **Make your changes** in logical, atomic commits
4. **Write clear commit messages** (see commit convention below)
5. **Push** to your fork
6. **Open a Pull Request** with a clear description

### Commit Convention
We use conventional commits for clear, semantic commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
- `feat(editor): add real-time note discovery`
- `fix(auth): resolve login redirect issue`
- `docs(readme): update installation instructions`

### Testing
- Write tests for new features and bug fixes
- Run the test suite before submitting PRs
- Ensure all tests pass in CI

### Pull Request Guidelines
- **Title**: Clear, descriptive title
- **Description**: 
  - What changes were made and why
  - Screenshots/videos for UI changes
  - Breaking changes (if any)
  - Related issues
- **Size**: Keep PRs focused and reasonably sized
- **Reviews**: Be responsive to feedback and suggestions

## 🏗️ Project Structure

```
nebriq/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── modules/             # Feature modules
│   │   ├── chat/           # AI chat functionality
│   │   ├── write/          # Editor and writing features
│   │   ├── landing-page/   # Landing page components
│   │   └── ...
│   ├── shared/             # Shared components and utilities
│   ├── store/              # Global state management
│   └── types/              # TypeScript type definitions
├── supabase/               # Database schema and migrations
├── public/                 # Static assets
└── ...
```

### Key Modules
- **`/modules/write`**: Rich text editor with AI-powered note discovery
- **`/modules/chat`**: AI chat interface for querying notes
- **`/shared/components`**: Reusable UI components
- **`/shared/hooks`**: Custom React hooks
- **`/app/actions`**: Server actions for AI and database operations

## 🤖 AI & Machine Learning

Nebriq heavily uses AI for:
- Semantic search and note discovery
- Natural language chat with notes
- Automatic note connections
- Content analysis and insights

When working with AI features:
- Be mindful of API costs and rate limits
- Test with various input types and edge cases
- Consider offline/fallback scenarios
- Ensure user privacy and data security

## 🔒 Security & Privacy

We take security and privacy seriously:
- Never log sensitive user data
- Use environment variables for secrets
- Follow OWASP security guidelines
- Report security issues privately via email

## 📈 Performance

Keep performance in mind:
- Optimize bundle size (use dynamic imports)
- Minimize API calls and database queries
- Use React best practices (memoization, etc.)
- Test on various devices and network conditions

## 🌍 Accessibility

We strive for inclusive design:
- Follow WCAG guidelines
- Use semantic HTML
- Ensure keyboard navigation
- Test with screen readers
- Maintain good color contrast

## 🎯 Focus Areas

We're particularly interested in contributions for:
- **Real-time note discovery improvements**
- **AI chat experience enhancements**  
- **Mobile-first design improvements**
- **Performance optimizations**
- **Accessibility improvements**
- **Self-hosting documentation**
- **Local-first/offline capabilities**

## ❓ Questions?

- **GitHub Discussions**: For general questions and ideas
- **Issues**: For bug reports and feature requests
- **Discord**: [Join our community](https://discord.gg/nebriq) (coming soon)
- **Email**: [hello@nebriq.com](mailto:hello@nebriq.com)

## 🙏 Recognition

All contributors will be:
- Listed in our README
- Mentioned in release notes
- Given credit in the app (for significant contributions)
- Invited to our contributors' Discord channel

## 📜 Code of Conduct

We're committed to providing a welcoming and inclusive environment. Please:
- Be respectful and considerate
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

Unacceptable behavior includes harassment, discrimination, or any form of abuse. Report issues to [hello@nebriq.com](mailto:hello@nebriq.com).

---

**Ready to contribute?** 🚀

Check out our [good first issues](https://github.com/paulbgtr/nebriq/labels/good%20first%20issue) or dive into any area that interests you. Every contribution, no matter how small, makes Nebriq better for everyone.

Let's build the future of thinking together! 🧠✨