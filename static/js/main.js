$(document).ready(() => {
    let automatonLink = $("#autoamatonLink");
    let aboutLink = $("#aboutLink");

    let automatonContainer = $("#automatonContainer");
    let aboutContainer = $("#aboutContainer");

    aboutContainer.hide(0);

    automatonLink.click(() => {
        automatonContainer.show(0);
        aboutContainer.hide(0);
    });

    aboutLink.click(() => {
        automatonContainer.hide(0);
        aboutContainer.show(0);
    });
});