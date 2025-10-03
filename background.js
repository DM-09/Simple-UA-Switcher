let ua_val = null

chrome.storage.local.get('ua-val', (data) => {
    if (data['ua-val']) {
        ua_val = data['ua-val']
    }
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes['ua-val'] && changes['ua-val'].newValue) {
        ua_val = changes['ua-val'].newValue
    }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        for (let i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                if (ua_val && ua_val !== '-') {
                    details.requestHeaders[i].value = ua_val
                } else {
                    ua_val = details.requestHeaders[i].value
                    chrome.storage.local.set({ 'ua-val': details.requestHeaders[i].value })
                }
            }
        }

        return { requestHeaders: details.requestHeaders }
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

function exe() {
    chrome.tabs.executeScript({
        code: `
            chrome.storage.local.get('ua-val', function(data) {
                var p = prompt('Enter the User-Agent', data['ua-val'] || '')
                if (p !== null) {
                    chrome.storage.local.set({ 'ua-val': p })
                }
            })
        `
    })
}

chrome.browserAction.onClicked.addListener(exe)
