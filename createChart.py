import json
import matplotlib.pyplot as plt
import numpy as np

# Path to the JSON files
json_file_path1 = 'db/dayScoreLog.json'
json_file_path2 = 'db/practiceLog.json'

# Read JSON data from file 1 (dayScoreLog.json)
with open(json_file_path1, 'r') as file:
    data1 = json.load(file)

# Read JSON data from file 2 (practiceLog.json)
with open(json_file_path2, 'r') as file:
    data2 = json.load(file)

# Extract data from file 1
dates = [entry["Date"] for entry in data1]
correct = [entry["correct"] for entry in data1]
incorrect = [entry["incorrect"] for entry in data1]

# Create bar chart for file 1
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))

bar_width = 0.35
index = np.arange(len(dates))

# Bars for correct and incorrect in file 1
bar1 = ax1.bar(index, correct, bar_width, color='blue', label='Correct')
bar2 = ax1.bar(index + bar_width, incorrect, bar_width, color='red', label='Incorrect')

# Labels and title for file 1
ax1.set_xlabel('Date')
ax1.set_ylabel('Count')
ax1.set_title('Correct and Incorrect Answers by Date')
ax1.set_xticks(index + bar_width / 2)
ax1.set_xticklabels(dates)
ax1.legend()

# Calculate incorrect rate for file 2 and sort
data2_sorted = sorted(data2, key=lambda x: x["incorrectPractice_count"] / x["totalPractice_count"], reverse=True)
words = [entry["word"] for entry in data2_sorted]
incorrect_rates = [(entry["incorrectPractice_count"] / entry["totalPractice_count"]) for entry in data2_sorted]

# Create bar chart for file 2 (sorted by incorrect rate)
bar3 = ax2.bar(words, incorrect_rates, color='purple', label='Incorrect Rate')

# Labels and title for file 2
ax2.set_xlabel('Words')
ax2.set_ylabel('Incorrect Rate')
ax2.set_title('Practice Log (Sorted by Incorrect Rate)')
ax2.legend()

# Adjust layout and display
plt.xticks(rotation=45, ha='right')  # Rotate x-axis labels for better visibility
plt.tight_layout()
plt.show()
