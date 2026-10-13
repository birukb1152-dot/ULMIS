# Contributing Guide

Thank you for your interest in contributing to the Urban Land & Infrastructure Management System! This guide will help you get started with contributing to the project.

## 🤝 How to Contribute

There are many ways to contribute to this project:

- **Bug Reports**: Report bugs and issues
- **Feature Requests**: Suggest new features
- **Code Contributions**: Submit bug fixes and new features
- **Documentation**: Improve documentation
- **Testing**: Help with testing and quality assurance
- **Design**: Contribute to UI/UX improvements

## 🚀 Getting Started

### 1. Fork the Repository

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/urban-land-project.git
   cd urban-land-project
   ```

### 2. Set Up Development Environment

Follow the [Installation Guide](INSTALLATION.md) to set up your local development environment.

### 3. Create a Branch

Create a new branch for your contribution:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/documentation-update
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

## 📝 Development Guidelines

### Code Style

#### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Use TypeScript-style JSDoc comments

```javascript
/**
 * Button component with multiple variants
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  // Component implementation
};
```

#### Backend (Node.js/Express)
- Use ES6+ features
- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Implement proper error handling
- Add JSDoc comments for functions

```javascript
/**
 * Get land requests with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getLandRequests = async (req, res) => {
  try {
    // Implementation
  } catch (error) {
    // Error handling
  }
};
```

### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   └── layout/         # Layout components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── citizen/        # Citizen-specific pages
│   └── officer/        # Officer-specific pages
├── context/            # React Context providers
├── api/                # API configuration
└── assets/             # Static assets
```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```bash
feat(auth): add password reset functionality
fix(dashboard): resolve chart rendering issue
docs(api): update authentication endpoints
style(ui): improve button component styling
refactor(utils): simplify date formatting functions
```

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Run all tests
npm run test:all
```

### Writing Tests

#### Frontend Tests (Jest + React Testing Library)
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Backend Tests (Jest + Supertest)
```javascript
const request = require('supertest');
const app = require('../src/server');

describe('Auth Endpoints', () => {
  test('POST /api/auth/login should authenticate user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

## 📋 Pull Request Process

### 1. Before Submitting

- [ ] Ensure your code follows the style guidelines
- [ ] Add or update tests for your changes
- [ ] Update documentation if necessary
- [ ] Run all tests and ensure they pass
- [ ] Check that your changes don't break existing functionality

### 2. Pull Request Template

When creating a pull request, use this template:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### 3. Review Process

1. **Automated Checks**: CI/CD pipeline will run tests and checks
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any feedback or requested changes
4. **Approval**: Once approved, your PR will be merged

## 🐛 Bug Reports

When reporting bugs, please include:

### Bug Report Template
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- Browser: [e.g. Chrome 95, Firefox 94, Safari 15]
- Node.js version: [e.g. 18.12.0]
- MongoDB version: [e.g. 5.0.9]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation suggestions**
If you have ideas about how this could be implemented, please share them.
```

## 🎨 UI/UX Contributions

### Design Guidelines

- Follow the existing design system
- Use consistent spacing and typography
- Ensure accessibility (WCAG 2.1 AA compliance)
- Test on different screen sizes
- Consider dark mode compatibility

### Design Assets

- Use Figma for design mockups
- Export assets in appropriate formats (SVG for icons, PNG for images)
- Follow naming conventions for assets
- Optimize images for web use

## 📚 Documentation Contributions

### Documentation Standards

- Use clear, concise language
- Include code examples where appropriate
- Keep documentation up-to-date with code changes
- Use proper markdown formatting
- Include screenshots for UI-related documentation

### Types of Documentation

- **API Documentation**: Update when adding/changing endpoints
- **User Guides**: Help users understand how to use features
- **Developer Guides**: Help other developers contribute
- **Deployment Guides**: Instructions for deploying the application

## 🔒 Security

### Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** create a public issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

### Security Best Practices

- Never commit sensitive information (passwords, API keys, etc.)
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Keep dependencies up to date

## 🏷️ Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Create release notes
- [ ] Tag the release
- [ ] Deploy to production
- [ ] Announce the release

## 👥 Community

### Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

### Communication

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and discussions
- **Pull Requests**: For code contributions

### Getting Help

If you need help:

1. Check the documentation
2. Search existing issues
3. Create a new issue with the "question" label
4. Join our community discussions

## 🎯 Good First Issues

New contributors should look for issues labeled:
- `good first issue`: Easy issues for newcomers
- `help wanted`: Issues where we need help
- `documentation`: Documentation improvements
- `bug`: Bug fixes

## 📈 Project Roadmap

Check our [project roadmap](https://github.com/your-repo/projects) to see:
- Planned features
- Current priorities
- Long-term goals
- How you can help

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Annual contributor highlights

## 📞 Contact

For questions about contributing:
- Create an issue with the "question" label
- Start a discussion in GitHub Discussions
- Contact the maintainers directly

---

**Thank you for contributing to the Urban Land & Infrastructure Management System! 🎉**