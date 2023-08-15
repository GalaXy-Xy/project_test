# Contributing to Prize Pool DApp

Thank you for your interest in contributing to the Prize Pool DApp! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- Git
- MetaMask or compatible wallet
- Sepolia ETH for testing

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GalaXy-Xy/project_test.git
cd project_test
```

2. Install dependencies:
```bash
npm install
cd contracts && npm install
cd ../frontend && npm install
```

3. Set up environment variables:
```bash
cp contracts/env.example contracts/.env
# Edit contracts/.env with your values
```

4. Start development servers:
```bash
# Terminal 1: Start Hardhat node
cd contracts && npx hardhat node

# Terminal 2: Deploy contracts
cd contracts && npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start frontend
cd frontend && npm run dev
```

## Contributing Guidelines

### Types of Contributions

We welcome contributions in the following areas:

- **Bug fixes**: Fix issues in existing code
- **Features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize code performance
- **Security**: Improve security measures

### Before Contributing

1. Check existing issues and pull requests
2. Discuss major changes in an issue first
3. Ensure your changes align with the project goals
4. Follow the coding standards

## Pull Request Process

### Before Submitting

1. **Test your changes**: Run all tests and ensure they pass
2. **Update documentation**: Update relevant documentation
3. **Check code style**: Ensure code follows project standards
4. **Rebase**: Rebase your branch on the latest main branch

### Pull Request Template

When creating a pull request, please include:

- **Description**: Clear description of changes
- **Type**: Bug fix, feature, documentation, etc.
- **Testing**: How you tested the changes
- **Breaking changes**: Any breaking changes
- **Related issues**: Link to related issues

### Review Process

1. All pull requests require review
2. Address feedback promptly
3. Keep pull requests focused and atomic
4. Update documentation as needed

## Issue Reporting

### Before Creating an Issue

1. Search existing issues
2. Check if the issue is already reported
3. Ensure you're using the latest version

### Issue Template

When creating an issue, please include:

- **Description**: Clear description of the problem
- **Steps to reproduce**: Detailed steps to reproduce
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, browser, Node.js version, etc.
- **Screenshots**: If applicable

## Coding Standards

### Smart Contracts

- Use Solidity 0.8.19+
- Follow OpenZeppelin standards
- Include comprehensive comments
- Use meaningful variable names
- Implement proper error handling
- Add events for important actions

### Frontend

- Use TypeScript
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Use Tailwind CSS for styling
- Follow accessibility guidelines

### General

- Use meaningful commit messages
- Keep functions small and focused
- Add comments for complex logic
- Use consistent naming conventions
- Follow the existing code style

## Testing

### Smart Contract Testing

```bash
cd contracts
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### Test Coverage

- Maintain test coverage above 70%
- Add tests for new features
- Update tests when fixing bugs
- Test edge cases and error conditions

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Include usage examples
- Keep comments up to date

### API Documentation

- Update API documentation for changes
- Include parameter descriptions
- Add return value documentation
- Include error conditions

### User Documentation

- Update README for new features
- Add screenshots for UI changes
- Include setup instructions
- Document configuration options

## Release Process

### Version Numbering

We use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing done

## Security

### Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** create a public issue
2. Email security@galaxyteam.com
3. Include detailed information about the vulnerability
4. Allow time for the team to respond

### Security Guidelines

- Never commit secrets or private keys
- Use environment variables for sensitive data
- Validate all inputs
- Implement proper access controls
- Follow security best practices

## Community

### Getting Help

- Check the documentation first
- Search existing issues
- Join our Discord community
- Ask questions in discussions

### Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have any questions about contributing, please:

- Open a discussion
- Contact the maintainers
- Join our community Discord

Thank you for contributing to Prize Pool DApp! 🎉
