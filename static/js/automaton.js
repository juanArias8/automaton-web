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
        clearAutomatonFormInputs();
        transitions = [];
    });

    btnCreateAutomaton.click((event) => {
        event.preventDefault();
        showAutomatonLoader();

        // let states = statesInput.val().toUpperCase().split(',');
        // let symbols = symbolsInput.val().toUpperCase().split(',');
        // let initial = initialInput.val().toUpperCase();
        // let final = finalInput.val().toUpperCase().split(',');

        // let automaton = {
        //     "states": states,
        //     "symbols": symbols,
        //     "initial": initial,
        //     "final": final,
        //     "transitions": transitions
        // };
        let automaton = {
            "states": ["A", "B"],
            "symbols": ["0", "1"],
            "initial": "A",
            "final": ["B"],
            "transitions": [
                {"state": "A", "symbol": "0", "target": "A"},
                {"state": "A", "symbol": "1", "target": "B"},
                {"state": "B", "symbol": "0", "target": "B"},
                {"state": "B", "symbol": "1", "target": "A"}
            ]
        };

        let jsonAutomaton = JSON.stringify(automaton);

        $.ajax({
            type: "POST", url: "/automaton/create", data: jsonAutomaton,
            contentType: "application/json; charset=utf-8", dataType: "json",
        }).done(function (response) {
            if (response.success) {
                showAutomatonSolutionResponse();
                clearAutomatonFormInputs();
                transitions = [];
                buildGraph(response.data);
                buildJsonText(response.data);
            } else {
                showAutomatonSolutionInfo();
                failMessage(response.message);
            }
        }).fail(function () {
            showAutomatonSolutionInfo();
            failMessage("Ha ocurrido un error, por favor inténtalo más tarde");
        });

        // if (states.length > 0 && symbols.length > 0 && initial !== "" && final.length > 0 && transitions.length > 0) {
        //
        // } else {
        //     showAutomatonSolutionInfo();
        //     failMessage("Por favor verifica que hayas ingresado todos los campos");
        // }
    });
});

function buildGraph(automatonJson) {
    let container = document.getElementById("graphAutomatonContainer");
    let graphAutomatonContainer = $("#graphAutomatonContainer");
    let automatonSolutionResponse = $("#automatonSolutionResponse");

    let nodes = [];
    let edges = [];

    automatonJson.states.forEach(value => {
        nodes.push({id: value, label: value})
    });

    automatonJson.transitions.forEach(value => {
        edges.push({from: value["state"], to: value["target"], arrows: "to", label: value["symbol"]})
    });

    graphAutomatonContainer.height(automatonSolutionResponse.height() - 30);
    graphAutomatonContainer.width(automatonSolutionResponse.width() - 30);

    let network = new vis.Network(container, {nodes: nodes, edges: edges}, {});
}

function buildJsonText(automaton) {
    let transitions = '';

    automaton.transitions.forEach(value => {
        transitions += `<tr>
                            <td>${value.state}</td>
                            <td>${value.symbol}</td>
                            <td>${value.target}</td>
                        </tr>`
    });

    $("#detailAutomatonStates").html(`<b>Estados: </b> ${automaton.states.join(', ')}`);
    $("#detailAutomatonSymbols").html(`<b>Símbolos: </b> ${automaton.symbols.join(', ')}`);
    $("#detailAutomatonInitial").html(`<b>Inicial: </b> ${automaton.initial}`);
    $("#detailAutomatonFinal").html(`<b>Finales: </b> ${automaton.final.join(', ')}`);
    $("#detailAutomatonTransitions").html(transitions);
}

function buildPythonScript(automaton) {

}
