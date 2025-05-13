document.addEventListener('DOMContentLoaded', () => {
  const quoteElement = document.getElementById('quote');
  const artistSongElement = document.getElementById('artist-song');
  const newQuoteButton = document.getElementById('new-quote');
  const journalEntryElement = document.getElementById('journal-entry');
  const saveJournalButton = document.getElementById('save-journal');
  const printJournalButton = document.getElementById('print-journal');
  const shareButton = document.getElementById('share-quote');
  const copyButton = document.getElementById('copy-quote');
  const donateButton = document.getElementById('donate');

  // Stripe donation URL - replace with your actual Stripe checkout URL
  const stripeDonationUrl = 'https://buy.stripe.com/00g2bc97NebB59e146';

  // Function to fetch quotes from quotes.json
  async function fetchQuotes() {
      try {
          const response = await fetch(chrome.runtime.getURL('quotes.json'));
          if (!response.ok) {
              throw new Error('Failed to fetch quotes');
          }
          const data = await response.json();
          return data.quotes;
      } catch (error) {
          console.error('Error fetching quotes:', error);
          return [];
      }
  }

  // Function to select a random quote
  function getRandomQuote(quotes) {
      if (quotes.length === 0) {
          return { text: "No quotes available.", author: "Unknown", song: "Unknown" };
      }
      const index = Math.floor(Math.random() * quotes.length);
      return quotes[index];
  }

  // Function to display the quote in the popup
  function displayQuote(quote) {
      quoteElement.textContent = `"${quote.text}"`;
      artistSongElement.textContent = `Artist and Song of The Day: ${quote.author} - ${quote.song}`;
  }

  // Function to load a new random quote
  async function loadQuote() {
      const quotes = await fetchQuotes();
      const randomQuote = getRandomQuote(quotes);
      displayQuote(randomQuote);
  }

  // Set up the event listener for the "New Quote" button
  newQuoteButton.addEventListener('click', loadQuote);

  // Save the journal entry for the day with the current date
  saveJournalButton.addEventListener('click', () => {
      const today = new Date().toDateString();
      const entry = journalEntryElement.value;
      if (entry.trim() === "") {
          alert("Please write something before saving!");
          return;
      }
      chrome.storage.local.get(['journalEntries'], (result) => {
          const journalEntries = result.journalEntries || {};
          journalEntries[today] = entry;
          chrome.storage.local.set({ journalEntries });
          alert('Gratitude Journal entry saved!');
      });
  });

  // Print journal entries for the last 3 months or 1 year with dates
  printJournalButton.addEventListener('click', () => {
      const timeRange = prompt('Enter "3" to print the last 3 months or "12" to print the last 1 year of journal entries:');
      if (timeRange !== "3" && timeRange !== "12") {
          alert("Please enter either 3 or 12.");
          return;
      }
      chrome.storage.local.get(['journalEntries'], (result) => {
          const journalEntries = result.journalEntries || {};
          const today = new Date();
          let printContent = "";
          for (const [date, entry] of Object.entries(journalEntries)) {
              const entryDate = new Date(date);
              const rangeInMonths = timeRange === "3" ? 3 : 12;
              const pastDate = new Date();
              pastDate.setMonth(today.getMonth() - rangeInMonths);
              if (entryDate >= pastDate) {
                  printContent += `${date}: ${entry}\n\n`;
              }
          }
          if (printContent === "") {
              alert(`No journal entries in the last ${timeRange} months to print.`);
              return;
          }
          const printWindow = window.open('', '', 'height=400,width=600');
          printWindow.document.write('<pre>' + printContent + '</pre>');
          printWindow.document.close();
          printWindow.print();
      });
  });

  // Copy quote to clipboard
  copyButton.addEventListener('click', () => {
      const textToCopy = `${quoteElement.textContent} ${artistSongElement.textContent}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
          alert("Quote copied to clipboard!");
      });
  });

  // Share quote via email
  shareButton.addEventListener('click', () => {
      const quote = quoteElement.textContent;
      const artistSong = artistSongElement.textContent;
      const emailBody = `Hey, I wanted to share this quote with you:\n\n${quote}\n${artistSong}`;
      window.location.href = `mailto:?subject=Check out this hip hop wisdom&body=${encodeURIComponent(emailBody)}`;
  });

  // Donate button - opens Stripe checkout
  donateButton.addEventListener('click', () => {
      window.open(stripeDonationUrl, '_blank');
  });

  // Initial load when popup is opened
  loadQuote();
});










  