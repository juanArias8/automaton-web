/**
 * show toast message when something goes bad
 * @param message
 */
function failMessage(message) {
    M.toast({html: message, classes: "fail-message"});
}

/**
 * show toast message when something goes fine
 * @param message
 */
function successMessage(message) {
    M.toast({html: message, classes: "success-message"});
}
