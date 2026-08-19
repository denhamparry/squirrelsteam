# Contributing

Thank you for considering contributing to this project! This document outlines the process and guidelines for contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:

- Check the existing issues to avoid duplicates
- Collect relevant information (OS, version, steps to reproduce)

When creating a bug report, use the bug report template and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Any relevant logs or screenshots

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use the feature request template
- Provide a clear description of the problem and proposed solution
- Explain why this enhancement would be useful
- Include examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes**:
   - Follow the project's code style
   - Update documentation as needed
3. **Run project validation**:
   - `npm run check`
   - `npm run build`
   - `npm audit --omit=dev`
4. **Run pre-commit hooks**: `pre-commit run --all-files`
5. **Commit your changes** using conventional commit format:
   - `feat: add new feature`
   - `fix: resolve bug in component`
   - `docs: update README`
   - `chore: update dependencies`
   - `refactor: improve code structure`
6. **Push to your fork** and submit a pull request
7. **Fill out the PR template** completely
8. **Wait for review** and address any feedback

## Development Setup

### Prerequisites

- Node.js 22 or newer (including npm)
- Git
- [pre-commit](https://pre-commit.com/) installed

### Installation

After cloning your fork, install the project dependencies and hooks from the
repository directory:

```bash
npm install
pre-commit install
```

### Validation

```bash
npm run check
npm run build
npm audit --omit=dev
pre-commit run --all-files
```

### Running Locally

```bash
npm run dev
```

## Validation Requirements

- `npm run check` must validate the Astro project without errors
- `npm run build` must produce the static site successfully
- `npm audit --omit=dev` must report no production vulnerabilities
- `pre-commit run --all-files` must pass before committing
- Include additional validation appropriate to the behavior you changed

## Code Style Guidelines

- Follow the existing code style in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Run linters before committing

## Git Commit Messages

- Use conventional commit format: `type: description`
- Keep the first line under 72 characters
- Use present tense ("add feature" not "added feature")
- Reference issues and PRs where applicable

## Review Process

1. A maintainer will review your PR
2. Changes may be requested
3. Once approved, your PR will be merged
4. Your contribution will be included in the next release

## Questions?

- Open a GitHub issue with your question
- Email `contact@squirrels.team`
- Check existing documentation
- Review closed issues for similar questions

## Recognition

Contributors are recognized in the project. Thank you for your contributions!
