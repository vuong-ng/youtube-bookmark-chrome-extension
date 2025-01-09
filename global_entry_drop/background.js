import fetchLocations from "./api/fetchLocations.js";
import fetchOpenSlots from "./api/fetchOpenSlots.js";
import { createNotification } from "./lib/handleNotifications.js";

chrome.runtime.onInstalled.addListener(details => {
    fetchLocations();
})

let cachedPrefs = {};
let firstApptTimestamp = null;

chrome.runtime.onMessage.addListener(data => {
    const { event, prefs } = data;
    switch (event) {
        case 'onStop':
            handleOnstop();
            break;
        case 'onStart':
            handleOnstart(prefs);
            break;
        default:
            break;
    }
})

const handleOnstop = () => {
    console.log("On stop in the background");
    stopAlarm();
    setRunning(false);
    cachedPrefs = {}; 

}

const handleOnstart = (prefs) => {
    console.log("On start in the background");
    cachedPrefs = prefs;
    console.log("prefs received:", prefs);
    chrome.storage.local.set(prefs);
    createAlarm();
    setRunning(true);
}

const setRunning = (isRunning) => {
    chrome.storage.local.set({isRunning});
}

const ALARM_JOB_NAME = "DROP_ALARM"
const createAlarm = () => {
    chrome.alarms.get(ALARM_JOB_NAME, existingAlarm => {
        if (!existingAlarm) {
            openSlotsJob()
            chrome.alarms.create(ALARM_JOB_NAME, {periodInMinutes:1.0})
        }
    })
    // chrome.alarms.create(ALARM_JOB_NAME, {periodInMinutes: 1.0})
}

const stopAlarm = () => {
    chrome.alarms.clearAll();
}

chrome.alarms.onAlarm.addListener(() => {
    console.log("onAlarm code is running...");
    openSlotsJob();
})

const openSlotsJob = () => {
    fetchOpenSlots(cachedPrefs)
        .then(data => handleOpenSlots(data))
}

const handleOpenSlots = (openSlots) => {
    if (openSlots && openSlots.length > 0 && openSlots[0].timestamp != firstApptTimestamp) {
        firstApptTimestamp = openSlots[0].timestamp;
        createNotification(openSlots[0], openSlots.length, cachedPrefs);
    }
}
