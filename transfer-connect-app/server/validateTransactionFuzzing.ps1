# Powershell for windows.
# How to run:
# open powershell script from this folder path
# set-ExecutionPolicy unrestricted
# .\validateTransactionFuzzing.ps1
# after you're done, write set-ExecutionPolicy default to not expose yourself to security risks

# to run validateTransactionFuzzing.test.js for 24 hours

# Defines the test file
$TEST_FILE = "validateTransactionFuzzing.test.js"

# Defines the test duration in seconds (24 hours)
$TEST_DURATION = 86400

# Defines the delay between test executions in seconds
$TEST_DELAY = 10

# Start time of the test
$START_TIME = Get-Date

# Loop until the test duration is reached, then stop
while ((Get-Date) - $START_TIME -lt [TimeSpan]::FromSeconds($TEST_DURATION)) {
  # Run the Jest test file
  & npm test $TEST_FILE

  # Delay before the next test execution
  Start-Sleep -Seconds $TEST_DELAY
}
