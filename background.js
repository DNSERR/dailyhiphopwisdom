// Function to fetch a random quote
async function fetchRandomQuote() {
  try {
    const response = await fetch(chrome.runtime.getURL('quotes.json'));
    if (!response.ok) {
      throw new Error('Failed to fetch quotes');
    }
    const data = await response.json();
    const quotes = data.quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  } catch (error) {
    console.error('Error fetching quote:', error);
    return { text: "Error fetching quote", author: "Unknown", song: "Unknown" };
  }
}

// Function to show notification
function showNotification(quote) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/hiphop_inspo2.png',
    title: 'Daily Hip Hop Wisdom',
    message: `"${quote.text}" - ${quote.author}, ${quote.song}`
  });
}

// Function to schedule daily notification
function scheduleDailyNotification() {
  chrome.alarms.create('dailyQuote', {
    periodInMinutes: 1440 // 24 hours
  });
}

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyQuote') {
    fetchRandomQuote().then(showNotification);
  }
});

// Listen for installation or update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    scheduleDailyNotification();
    fetchRandomQuote().then(showNotification);
  }
});

// Listen for messages from popup or settings
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getQuote') {
    fetchRandomQuote().then(quote => sendResponse(quote));
    return true; // Indicates async response
  }
});

