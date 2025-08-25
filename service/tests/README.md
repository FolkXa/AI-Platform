# Test Suite Documentation

## Overview

This test suite provides comprehensive testing for the AI Platform Service, including unit tests, integration tests, and test fixtures.

## Test Structure

```
tests/
├── __init__.py
├── fixtures/
│   ├── __init__.py
│   └── sample_data.py          # Test data fixtures
├── unit/
│   ├── __init__.py
│   ├── test_entities.py        # Entity unit tests
│   ├── test_file_service.py    # File service unit tests
│   ├── test_chat_service.py    # Chat service unit tests
│   └── test_use_cases.py       # Use case unit tests
├── integration/
│   ├── __init__.py
│   ├── test_file_upload_integration.py  # File upload integration tests
│   └── test_chat_integration.py         # Chat integration tests
├── examples/                   # Example usage scripts
└── test_*.py                   # Legacy test files
```

## Test Categories

### Unit Tests (`tests/unit/`)

Unit tests focus on testing individual components in isolation using mocks and stubs.

**Coverage:**
- **Entities**: `FileAnalysis`, `ChatMessage`, `ChatSession`
- **Services**: `FileServiceImpl`, `ChatServiceImpl`
- **Use Cases**: `FileUploadUseCase`, `ChatUseCase`

**Key Features:**
- Mock AI services to avoid external dependencies
- Test error handling and edge cases
- Verify data validation and business logic
- Fast execution (no external API calls)

### Integration Tests (`tests/integration/`)

Integration tests verify that components work together correctly.

**Coverage:**
- File upload with different AI providers (Ollama, OpenRouter)
- Chat functionality with real AI services
- End-to-end workflows
- Cross-provider compatibility

**Key Features:**
- Use real AI services (requires configuration)
- Test complete workflows
- Verify data flow between components
- Test with different file types and data scenarios

### Test Fixtures (`tests/fixtures/`)

Reusable test data and utilities.

**Available Fixtures:**
- `create_sample_csv_data()`: Standard CSV test data
- `create_sample_excel_data()`: Excel test data
- `create_csv_with_missing_data()`: CSV with null values
- `create_csv_with_special_characters()`: CSV with Unicode characters
- `create_large_csv_data()`: Large dataset for performance testing
- `get_sample_messages()`: Sample chat messages
- `get_sample_dataframe()`: Sample pandas DataFrame

## Running Tests

### Prerequisites

1. Install test dependencies:
```bash
venv/bin/python3 -m pip install pytest pytest-asyncio pytest-cov
```

2. Configure environment variables (for integration tests):
```bash
# For Ollama tests
export OLLAMA_URL=http://localhost:11434
export OLLAMA_MODEL=llama3.1:8b

# For OpenRouter tests
export OPENROUTER_API_KEY=your_api_key_here
```

### Test Commands

#### Using the Test Runner Script
```bash
# Run all tests
python run_tests.py

# Run unit tests only
python run_tests.py --unit

# Run integration tests only
python run_tests.py --integration

# Run with coverage
python run_tests.py --coverage

# Verbose output
python run_tests.py --verbose
```

#### Using pytest directly
```bash
# Run all tests
venv/bin/python3 -m pytest tests/

# Run unit tests only
venv/bin/python3 -m pytest tests/unit/

# Run integration tests only
venv/bin/python3 -m pytest tests/integration/

# Run with coverage
venv/bin/python3 -m pytest tests/ --cov=src --cov-report=html

# Run specific test file
venv/bin/python3 -m pytest tests/unit/test_entities.py

# Run specific test function
venv/bin/python3 -m pytest tests/unit/test_entities.py::TestFileAnalysis::test_file_analysis_creation
```

### Test Markers

Tests are categorized using pytest markers:

```bash
# Run unit tests
venv/bin/python3 -m pytest -m unit

# Run integration tests
venv/bin/python3 -m pytest -m integration

# Run slow tests
venv/bin/python3 -m pytest -m slow

# Run AI service tests
venv/bin/python3 -m pytest -m ai_service
```

## Test Configuration

### pytest.ini
- Configures test discovery patterns
- Sets up asyncio support
- Defines test markers
- Configures default options

### Environment Setup
Integration tests require:
- Ollama server running (for Ollama tests)
- OpenRouter API key (for OpenRouter tests)
- Proper environment variables set

## Writing Tests

### Unit Test Guidelines

1. **Use descriptive test names**:
```python
def test_file_analysis_creation_with_all_fields(self):
    """Test creating FileAnalysis with all optional fields"""
```

2. **Mock external dependencies**:
```python
@pytest.fixture
def mock_ai_service(self):
    mock_service = Mock()
    mock_service.generate_insights = AsyncMock(return_value=["Insight 1"])
    return mock_service
```

3. **Test error conditions**:
```python
def test_file_service_error_handling(self, file_service):
    with pytest.raises(ValueError, match="Unsupported file format"):
        file_service.process_file(invalid_file, "test.txt")
```

4. **Use fixtures for common setup**:
```python
@pytest.fixture
def sample_csv_data(self):
    return create_sample_csv_data()
```

### Integration Test Guidelines

1. **Test real workflows**:
```python
@pytest.mark.asyncio
async def test_complete_file_upload_workflow(self):
    # Test the entire file upload process
    file_service = get_file_service(AIProvider.OLLAMA)
    use_case = FileUploadUseCase(file_service, get_ai_service(AIProvider.OLLAMA))
    # ... test implementation
```

2. **Test with different providers**:
```python
@pytest.mark.asyncio
async def test_ai_provider_comparison(self):
    # Test both Ollama and OpenRouter
    for provider in [AIProvider.OLLAMA, AIProvider.OPENROUTER]:
        # ... test implementation
```

3. **Handle external service failures gracefully**:
```python
@pytest.mark.asyncio
async def test_ai_service_fallback(self):
    # Test fallback behavior when AI service fails
    # ... test implementation
```

## Test Data Management

### Sample Data Fixtures

The `tests/fixtures/sample_data.py` module provides:

- **Standard datasets**: Common test scenarios
- **Edge cases**: Missing data, special characters
- **Performance data**: Large datasets for stress testing
- **Reusable utilities**: Helper functions for test setup

### Data Validation

Tests verify:
- File size calculation accuracy
- Data type handling
- Encoding support (UTF-8, special characters)
- Missing value handling
- Large file processing

## Coverage Reports

Generate coverage reports to identify untested code:

```bash
# Generate HTML coverage report
venv/bin/python3 -m pytest tests/ --cov=src --cov-report=html

# View coverage in terminal
venv/bin/python3 -m pytest tests/ --cov=src --cov-report=term

# Generate coverage report with missing lines
venv/bin/python3 -m pytest tests/ --cov=src --cov-report=html --cov-report=term-missing
```

Coverage reports are generated in `htmlcov/` directory.

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      - name: Run unit tests
        run: |
          python -m pytest tests/unit/ -v
      - name: Run integration tests
        run: |
          python -m pytest tests/integration/ -v
        env:
          OLLAMA_URL: ${{ secrets.OLLAMA_URL }}
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
```

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure you're running from the project root
2. **AI service errors**: Check environment variables and service availability
3. **Async test failures**: Ensure `@pytest.mark.asyncio` decorator is used
4. **File encoding issues**: Use the provided fixtures for special character testing

### Debug Mode

Run tests with debug output:
```bash
venv/bin/python3 -m pytest tests/ -v -s --tb=long
```

### Test Isolation

Each test should be independent:
- Use unique session IDs
- Clean up test data
- Avoid shared state between tests

## Best Practices

1. **Test naming**: Use descriptive names that explain the test scenario
2. **Arrange-Act-Assert**: Structure tests with clear sections
3. **Mock external dependencies**: Avoid network calls in unit tests
4. **Test edge cases**: Include error conditions and boundary values
5. **Keep tests fast**: Unit tests should run quickly
6. **Use fixtures**: Reuse common test setup
7. **Document complex tests**: Add comments for non-obvious test logic
8. **Maintain test data**: Keep fixtures up to date with schema changes 