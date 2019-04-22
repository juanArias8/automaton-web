$(document).ready(() => {
    let example = {
        "states": ["A", "B", "C"],
        "symbols": ["0", "1"],
        "finalStates": ["B", "C"],
        "initialState": "A",
        "transitions": [
            {"state": "A", "symbol": "0", "target": "B"},
            {"state": "A", "symbol": "1", "target": "c"},
            {"state": "B", "symbol": "0", "target": "A"},
            {"state": "B", "symbol": "1", "target": "B"},
            {"state": "C", "symbol": "0", "target": "C"},
            {"state": "C", "symbol": "1", "target": "A"}
        ]
    };

    let automatonLink = $("#autoamatonLink");
    let regexLink = $("#regexLink");

    let brandText = $("#brandText");

    let automatonForm = $("#automatonForm");
    let regexForm = $("#regexForm");

    let graphAutomatonLink = $("#graphAutomatonLink");
    let jsonAutomatonLink = $("#jsonAutomatonLink");
    let codeAutomatonLink = $("#codeAutomatonLink");

    let graphAutomatonContainer = $("#graphAutomatonContainer");
    let jsonAutomatonContainer = $("#jsonAutomatonContainer");
    let codeAutomatonContainer = $("#codeAutomatonContainer");

    let automatonJsonInput = $("#automatonJsonInput");
    let loaderCreateAutomaton = $("#loaderCreateAutomaton");
    let btnCreateAutomaton = $("#btnCreateAutomaton");

    loaderCreateAutomaton.hide(0);
    jsonAutomatonContainer.hide(0);
    codeAutomatonContainer.hide(0);
    regexForm.hide(0);

    automatonLink.click(() => {
        brandText.text("AUTÓMATAS");
        automatonForm.show(0);
        regexForm.hide(0);
    });

    regexLink.click(() => {
        brandText.text("REGEX");
        automatonForm.hide(0);
        regexForm.show(0);
    });

    buildGraph("hola");

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

    btnCreateAutomaton.click(() => {
        console.log(automatonJsonInput.text());
        let jsonAutomaton = JSON.parse(automatonJsonInput.text());
        console.log(jsonAutomaton);

        $.ajax({
            type: "POST", url: "/automaton/create", data: jsonAutomaton,
            contentType: "application/json; charset=utf-8", dataType: "json",
            beforeSend: function () {
                loaderCreateAutomaton.show("slow");
            }
        }).done(function (data) {
            loaderCreateAutomaton.hide("slow");

            if (data.success) {
                toastSuccess(data.message);
            } else {
                toastFail(data.message);
            }
        }).fail(function () {
            loaderCreateAutomaton.hide("slow");
            toastFail("Ha ocurrido un error, por favor inténtalo más tarde");
        });
    });
});

function buildGraph(example) {
    let states = ["A", "B", "C"];
    let symbols = ["0", "1"];
    let transitions = [
        {"state": "A", "target": "B", "symbol": "0"},
        {"state": "A", "target": "C", "symbol": "1"},
        {"state": "B", "target": "A", "symbol": "0"},
        {"state": "B", "target": "C", "symbol": "1"},
        {"state": "C", "target": "C", "symbol": "0"},
        {"state": "C", "target": "A", "symbol": "1"}
    ];

    let nodes = [];
    let edges = [];

    states.forEach(value => {
        nodes.push({id: value, label: value})
    });

    transitions.forEach(value => {
        edges.push({from: value["state"], to: value["target"], arrows: "to", label: value["symbol"]})
    });

    console.log(states);
    console.log(edges);

    // create a network
    let container = document.getElementById("graphAutomatonContainer");
    let data = {
        nodes: nodes,
        edges: edges
    };

    let network = new vis.Network(container, data, {});
}

/**
 * show toast message when something goes bad
 * @param message
 */
function toastFail(message) {
    M.toast({html: message, classes: "rounded red black-text"});
}

/**
 * show toast message when something goes fine
 * @param message
 */
function toastSuccess(message) {
    M.toast({html: message, classes: "rounded green black-text"});
}
