$(document).ready(() => {
    let statesInput = $("#statesInput");
    let symbolsInput = $("#symbolsInput");
    let initialInput = $("#initialInput");
    let finalInput = $("#finalInput");

    let btnAddTransition = $("#btnAddTransition");
    let transitionStateInput = $("#transitionStateInput");
    let transitionSymbolInput = $("#transitionSymbolInput");
    let transitionTargetInput = $("#transitionTargetInput");
    let transitionsList = $("#transitionsList");
    let transitions = [];

    let btnCreateAutomaton = $("#btnCreateAutomaton");
    let btnClearAutomaton = $("#btnClearAutomaton");

    btnAddTransition.click((event) => {
        event.preventDefault();
        let state = transitionStateInput.val().toUpperCase();
        let symbol = transitionSymbolInput.val().toUpperCase();
        let target = transitionTargetInput.val().toUpperCase();
        let transitionsText = "";

        if (state !== "" && symbol !== "" && target !== "") {
            let transition = {"state": state, "symbol": symbol, "target": target};

            transitions.unshift(transition);
            transitions.forEach(value => {
                transitionsText += `<tr>
                                        <td>${value["state"]}</td>
                                        <td>${value["symbol"]}</td>
                                        <td>${value["target"]}</td>
                                    </tr>`;
            });
        } else {
            failMessage("Todos los campos son requeridos");
        }

        transitionsList.html(transitionsText);
        transitionStateInput.val("");
        transitionSymbolInput.val("");
        transitionTargetInput.val("");
    });

    btnClearAutomaton.click((event) => {
        event.preventDefault();
        statesInput.val("");
        symbolsInput.val("");
        initialInput.val("");
        finalInput.val("");
        transitions = [];
        transitionStateInput.val("");
        transitionSymbolInput.val("");
        transitionTargetInput.val("");
        transitionsList.html(null);
    });

    btnCreateAutomaton.click((event) => {
        event.preventDefault();
        showAutomatonLoader();

        let states = statesInput.val().toUpperCase().split(',');
        let symbols = symbolsInput.val().toUpperCase().split(',');
        let initial = initialInput.val().toUpperCase();
        let final = finalInput.val().toUpperCase().split(',');

        if (states.length > 0 && symbols.length > 0 && initial !== "" && final.length > 0 && transitions.length > 0) {
            let automaton = {
                "states": states,
                "symbols": symbols,
                "initial": initial,
                "final": final,
                "transitions": transitions
            };

            let jsonAutomaton = JSON.stringify(automaton);

            $.ajax({
                type: "POST", url: "/automaton/create", data: jsonAutomaton,
                contentType: "application/json; charset=utf-8", dataType: "json",
            }).done(function (response) {
                if (response.success) {
                    showAutomatonSolutionResponse();
                    buildGraph(response.data);
                } else {
                    showAutomatonSolutionInfo();
                    failMessage(response.message);
                }
            }).fail(function () {
                showAutomatonSolutionInfo();
                failMessage("Ha ocurrido un error, por favor inténtalo más tarde");
            });
        } else {
            failMessage("Por favor verifica que hayas ingresado todos los campos");
        }
    });
});

function buildGraph(automatonJson) {
    console.log(automatonJson);
    let states = automatonJson.states;
    let transitions = automatonJson.transitions;

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

