// ELEMENTS
const locationIdElement = document.getElementById("locationId");
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")

// Button elements
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

// Spans
const runningSpan = document.getElementById("runningSpan");
const stoppedSpan = document.getElementById("stoppedSpan");

// Errors
const locationIdError = document.getElementById("locationIdError");
const endDateError = document.getElementById("endDateError");
const startDateError = document.getElementById("startDateError");

startButton.addEventListener("click", function () {
    const allFieldsValidations = performOnStartValidations();
    if (allFieldsValidations) {
        handleOnStartState();
    const prefs = {
        locationId: locationIdElement.value,
        startDate: startDateElement.value,
        endDate: endDateElement.value,
        tzData: locationIdElement.options[locationIdElement.selectedIndex].getAttribute('data-tz')
    }
    chrome.runtime.sendMessage({event:'onStart', prefs});
    }
})

stopButton.addEventListener("click", function () {
    handleOnStopState();
    chrome.runtime.sendMessage({event:'onStop'});
})

chrome.storage.local.get(['locationId', 'startDate', 'endDate','locations', 'isRunning'], (result) => {
    const { locationId, startDate, endDate, locations, isRunning } = result;
    setLocations(locations);
    if (locationId) {
        locationIdElement.value = locationId;
    }

    if (startDate) {
        startDateElement.value = startDate;
    }

    if (endDate) {
        endDateElement.value = endDate;
    }

    if (isRunning) {
        handleOnStartState();

    } else {
        handleOnStopState();
    }
    console.log("Running status:", isRunning);
})

const performOnStartValidations = () => {
    if (!locationIdElement.value) {
        showElement(locationIdError);
        // disableElement(startButton);
    }
    else {
        hideElement(locationIdError);
        // enableElement(startButton);
    }

    if (!endDateElement.value) {
        showElement(endDateError);
        // disableElement(startButton);
    } else {
        hideElement(endDateError);
        // enableElement(startButton);
    }

    if (!startDateElement.value) {
        showElement(startDateError);
        // disableElement(startButton);
    } else {
        hideElement(startDateError);
        // enableElement(startButton);
    }
    return locationIdElement.value && endDateElement.value && startDateElement.value;
}

const handleOnStartState = () => {
    // spans
    hideElement(stoppedSpan);
    showElement(runningSpan);

    // buttons
    enableElement(stopButton)
    disableElement(startButton);

    // inputs
    disableElement(locationIdElement);
    disableElement(endDateElement);
    disableElement(startDateElement);

}

const handleOnStopState = () => {
    // spans
    showElement(stoppedSpan);
    hideElement(runningSpan);

    // buttons
    disableElement(stopButton);
    enableElement(startButton);

    // inputs
    enableElement(locationIdElement);
    enableElement(endDateElement);
    enableElement(startDateElement);
}

const hideElement = (element) => {
    element.style.display = 'none';
}

const showElement = (element) => {
    element.style.display = '';
}

const disableElement = (element) => {
    element.disabled = true;
}

const enableElement = (element) => {
    element.disabled = false;
}

const setLocations = (locations) => {
    locations.forEach(location => {
        let locationOption = document.createElement('option');
        locationOption.value = location.id;
        locationOption.innerHTML = location.name;
        locationIdElement.appendChild(locationOption);
        locationOption.setAttribute('data-tz', location.tzData);
    });
}