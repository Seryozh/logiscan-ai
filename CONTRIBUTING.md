# Contributing to LogiScan AI

Thank you for your interest in contributing to LogiScan AI! This document provides guidelines for contributing to the project.

## 🎯 Project Vision

LogiScan AI is built to solve real-world logistics problems using AI automation. Contributions should align with the goals of:
- Reducing manual labor in package auditing
- Improving accuracy through intelligent automation
- Maintaining production-ready code quality
- Optimizing AI API costs and performance

## 🛠️ Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/logiscan-ai.git
   cd logiscan-ai
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your OpenAI and Supabase credentials
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## 📝 Contribution Guidelines

### Code Style

- Follow existing TypeScript patterns in the codebase
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused (single responsibility)
- Use TypeScript types instead of `any` when possible

### Commit Messages

Use clear, descriptive commit messages:

```
Good: "Add error handling for missing API keys"
Good: "Optimize image compression to reduce API costs"
Bad: "fix stuff"
Bad: "update"
```

### Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test thoroughly

3. Commit your changes:
   ```bash
   git commit -m "Add feature: description"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request with:
   - Clear description of changes
   - Screenshots if UI changes
   - Performance impact if relevant
   - Breaking changes if any

## 🧪 Testing

Before submitting a PR:
- Test all affected features manually
- Ensure the app builds without errors: `npm run build`
- Check for TypeScript errors: `npm run lint`
- Test on mobile devices (PWA functionality)

## 🎨 Areas for Contribution

### High Priority
- Add unit tests for core functions
- Improve error handling and user feedback
- Add analytics/telemetry for performance monitoring
- Optimize Vision API prompts for better accuracy

### Medium Priority
- Add support for multiple package formats
- Implement export functionality (CSV, PDF reports)
- Add user authentication for multi-tenant usage
- Create admin dashboard for analytics

### Nice to Have
- Dark mode support
- Multi-language support
- Barcode scanning fallback option
- Integration with shipping carrier APIs

## 🐛 Reporting Bugs

If you find a bug:

1. Check if it's already reported in [Issues](https://github.com/yourusername/logiscan-ai/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/device information

## 💡 Suggesting Features

Feature requests are welcome! Please:

1. Check existing issues for similar suggestions
2. Create a new issue with the "enhancement" label
3. Describe the problem the feature solves
4. Provide examples of how it would work
5. Consider implementation complexity and cost

## 🔐 Security

If you discover a security vulnerability:
- **DO NOT** open a public issue
- Email the maintainer directly (see README for contact)
- Provide detailed description of the vulnerability
- Allow time for a fix before public disclosure

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Questions?

Feel free to open an issue for questions or reach out to the maintainer directly.

---

**Thank you for helping make logistics operations more efficient!**
