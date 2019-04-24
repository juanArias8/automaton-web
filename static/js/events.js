$(document).ready(() => {
    let automatonLink = $("#autoamatonLink");
    let aboutLink = $("#aboutLink");
    let regexLink = $("#regexLink");

    let brandText = $("#brandText");

    let automatonContainer = $("#automatonContainer");
    let aboutContainer = $("#aboutContainer");

    let automatonForm = $("#automatonForm");
    let regexForm = $("#regexForm");

    let btnMatcherOpener = $("#btnMatcherOpener");
    let btnMatcherCloser = $("#btnMatcherCloser");
    let matcherContainer = $("#matcherContainer");

    let loader = $("#loader");
    let automatonSolutionResponse = $("#automatonSolutionResponse");

    let graphAutomatonLink = $("#graphAutomatonLink");
    let jsonAutomatonLink = $("#jsonAutomatonLink");
    let codeAutomatonLink = $("#codeAutomatonLink");

    let graphAutomatonContainer = $("#graphAutomatonContainer");
    let jsonAutomatonContainer = $("#jsonAutomatonContainer");
    let codeAutomatonContainer = $("#codeAutomatonContainer");

    aboutContainer.hide(0);
    regexForm.hide(0);
    automatonSolutionResponse.hide(0);
    loader.hide(0);
    jsonAutomatonContainer.hide(0);
    codeAutomatonContainer.hide(0);
    matcherContainer.hide(0);

    automatonLink.click(() => {
        automatonContainer.show(0);
        aboutContainer.hide(0);
    });

    aboutLink.click(() => {
        automatonContainer.hide(0);
        aboutContainer.show(0);
    });

    automatonLink.click(() => {
        brandText.text("AUTÓMATAS");
        automatonForm.show(0);
        regexForm.hide(0);
    });

    regexLink.click(() => {
        brandText.text("REGEX");
        automatonContainer.show(0);
        automatonForm.hide(0);
        regexForm.show(0);
    });

    graphAutomatonLink.click(() => {
        graphAutomatonContainer.show(0);
        jsonAutomatonContainer.hide(0);
        codeAutomatonContainer.hide(0);
    });

    jsonAutomatonLink.click(() => {
        graphAutomatonContainer.hide(0);
        jsonAutomatonContainer.show(0);
        codeAutomatonContainer.hide(0);
    });

    codeAutomatonLink.click(() => {
        graphAutomatonContainer.hide(0);
        jsonAutomatonContainer.hide(0);
        codeAutomatonContainer.show(0);
    });

    btnMatcherOpener.click(() => {
        btnMatcherOpener.hide("slow");
        matcherContainer.show("slow");
    });

    btnMatcherCloser.click(() => {
        btnMatcherOpener.show("slow");
        matcherContainer.hide("slow");
    });
});