# Define the test file
$TEST_FILE = "validateTransactionFuzzing.test.js"

# Define the test duration in seconds (24 hours)
$TEST_DURATION = 86400

# Define the delay between test executions in seconds
$TEST_DELAY = 10

# Start time of the test
$START_TIME = Get-Date

# Loop until the test duration is reached
while ((Get-Date) - $START_TIME -lt [TimeSpan]::FromSeconds($TEST_DURATION)) {
  # Run the Jest test file
  & npm test $TEST_FILE

  # Delay before the next test execution
  Start-Sleep -Seconds $TEST_DELAY
}
