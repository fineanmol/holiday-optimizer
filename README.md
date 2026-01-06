# Holiday Optimizer 🏖️

Optimize your vacation days using Dynamic Programming! Maximize your total days off by strategically placing breaks around weekends and public holidays.

**Live Demo:** [Try it here](https://fineanmol.github.io/holiday-optimizer/)

## What It Does

This tool helps you plan your vacations optimally. Given:

- Your total paid leave days
- Public holidays in your country
- Your preferences (minimum/maximum break length, spacing between breaks)

It finds the best schedule that maximizes your total days off by leveraging weekends and holidays.

## Features

- 🎯 **Dynamic Programming Algorithm** - Finds optimal vacation schedule
- 🌍 **Multi-Country Support** - Pre-configured holidays for Germany and India (easily extensible)
- ⚙️ **Customizable Constraints** - Set your own min/max break lengths and spacing
- 📊 **Detailed Reports** - See exactly which dates to take off and how many days you'll get
- 💻 **Zero Server Cost** - Runs entirely in the browser using GitHub Pages

## How It Works

The optimizer uses three key techniques:

1. **Dominance Pruning** - For each starting day, keeps only the most efficient break options
2. **Binary Search** - Efficiently finds next valid break that satisfies spacing constraints
3. **Dynamic Programming** - Optimizes for maximum total days off within your constraints

## Usage

1. Select your country from the dropdown
2. Set your preferences:
   - Year to optimize
   - Start date
   - Total paid leave days
   - Minimum break length (days)
   - Maximum break length (days)
   - Time between breaks (days)
3. Click "Calculate Optimal Schedule"
4. Review your optimized vacation plan!

## Example

With **19 paid leave days** and default settings:

- **Result:** ~52 total days off
- **Breaks:** ~12 breaks throughout the year
- **Distribution:** Approximately 1 break per month

## Adding New Countries

To add holidays for a new country, edit `country-presets.js`:

```javascript
newCountry: {
  name: "Country Name",
  year: 2026,
  defaultPTO: 10,
  holidays: [
    { date: "2026-01-01", name: "New Year's Day" },
    // ... more holidays
  ]
}
```

The country will automatically appear in the dropdown!

## Algorithm Details

- **Time Complexity:** O(n × m × P) where n = candidates, m = max break length, P = PTO days
- **Space Complexity:** O(n × P) for DP table
- **Optimization Goal:** Maximize total days off (including weekends and holidays)

## Tech Stack

- Pure JavaScript (ES6 modules)
- No dependencies
- Works in all modern browsers
- GitHub Pages compatible

## Inspiration

Inspired by [Ankit's vacation optimizer](https://gist.github.com/ag5826000/478d3607df0eff50278d57429f2308e9) - converted from Python to JavaScript for browser deployment.

## License

MIT License - feel free to use and modify!

---

**Made with ❤️ to help you maximize your vacation time!**
