
function injectedScript(){
    alert("The ime is up!")
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

chrome.alarms.onAlarm.addListener(() => {
   getCurrentTab()
   .then((result) => {console.log(result, result.id)
        chrome.scripting.executeScript({
            target: {tabId: result.id },
            func: injectedScript
        }) 
    })
})