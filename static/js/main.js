$(document).ready(() => {
    let automatonLink = $("#autoamatonLink");
    let regexLink = $("#regexLink");
    let aboutLink = $("#aboutLink");

    let automatonContainer = $("#automatonContainer");
    let regexContainer = $("#regexContainer");
    let aboutContainer = $("#aboutContainer");

    regexContainer.hide(0);
    aboutContainer.hide(0);

    automatonLink.click(() => {
        automatonContainer.show(0);
        regexContainer.hide(0);
        aboutContainer.hide(0);
    });

    regexLink.click(() => {
        automatonContainer.hide(0);
        regexContainer.show(0);
        aboutContainer.hide(0);
    });

    aboutLink.click(() => {
        automatonContainer.hide(0);
        regexContainer.hide(0);
        aboutContainer.show(0);
    });
});