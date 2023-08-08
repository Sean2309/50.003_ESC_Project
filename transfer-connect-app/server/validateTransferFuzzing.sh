#!/bin/bash

# For POSIX-compliant OS
# To run, first go to this folder on a shell
# and chmod +x validateTransferFuzzing.sh to turn it into an executable
# and then ./validateTransferFuzzing.sh

# Defines the test file
TEST_FILE="validateTransactionFuzzing.test.js"

# Defines the test duration in seconds (24 hours)
TEST_DURATION=$((60 * 60 * 24))

# Defines the delay between test executions in seconds
TEST_DELAY=10

# Start time of the test
START_TIME=$(date +%s)

# Loop until the test duration is reached
while (( $(date +%s) - START_TIME < TEST_DURATION )); do
  # Run the Jest test file
  jest "$TEST_FILE"

  # Delay before the next test execution
  sleep $TEST_DELAY
done


