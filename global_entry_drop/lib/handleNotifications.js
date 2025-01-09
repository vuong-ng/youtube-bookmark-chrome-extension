
export const createNotification = (openSlot, numberOfSlots, prefs) => {
    const { tzData } = prefs;
    let message = "";
    if (numberOfSlots > 1) {
        message = `Found an open interview at ${openSlot.timestamp} (${tzData} time zone) and ${numberOfSlots - 1} additional slots`;
    } else {
        message = `Found an open interview at ${openSlot.timestamp} (${tzData} time zone)`
    }
    chrome.notifications.create({
        title: "Global Entry Drops",
        message: message,
        iconUrl: "../images/icon.png",
        type: "basic"
    },
);
}

chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({url: "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true&returnUrl=ttp-external&service=up"})
})


