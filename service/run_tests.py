#!/usr/bin/env python3
"""
Test runner script for the AI Platform Service
"""
import sys
import subprocess
import argparse
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(command)}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print("✅ SUCCESS")
        if result.stdout:
            print("Output:")
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print("❌ FAILED")
        print(f"Exit code: {e.returncode}")
        if e.stdout:
            print("Stdout:")
            print(e.stdout)
        if e.stderr:
            print("Stderr:")
            print(e.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Run tests for AI Platform Service")
    parser.add_argument("--unit", action="store_true", help="Run unit tests only")
    parser.add_argument("--integration", action="store_true", help="Run integration tests only")
    parser.add_argument("--all", action="store_true", help="Run all tests")
    parser.add_argument("--coverage", action="store_true", help="Run tests with coverage")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    # Default to running all tests if no specific type is specified
    if not any([args.unit, args.integration, args.all]):
        args.all = True
    
    # Check if we're in the right directory
    if not Path("src").exists():
        print("❌ Error: Please run this script from the project root directory")
        sys.exit(1)
    
    # Build pytest command
    pytest_cmd = ["venv/bin/python3", "-m", "pytest"]
    
    if args.verbose:
        pytest_cmd.append("-v")
    
    if args.coverage:
        pytest_cmd.extend(["--cov=src", "--cov-report=html", "--cov-report=term"])
    
    # Run tests based on arguments
    success = True
    
    if args.unit or args.all:
        unit_cmd = pytest_cmd + ["tests/unit/", "-m", "unit"]
        success &= run_command(unit_cmd, "Unit Tests")
    
    if args.integration or args.all:
        integration_cmd = pytest_cmd + ["tests/integration/", "-m", "integration"]
        success &= run_command(integration_cmd, "Integration Tests")
    
    # Summary
    print(f"\n{'='*60}")
    if success:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print("💥 Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 