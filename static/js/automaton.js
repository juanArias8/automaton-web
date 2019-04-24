$(document).ready(() => {
    let statesInput = $("#statesInput");
    let symbolsInput = $("#symbolsInput");
    let initialInput = $("#initialInput");
    let finalInput = $("#finalInput");
    let transitionStateInput = $("#transitionStateInput");
    let transitionSymbolInput = $("#transitionSymbolInput");
    let transitionTargetInput = $("#transitionTargetInput");
    let transitionsList = $("#transitionsList");
    let transitions = [];
    let btnAddTransition = $("#btnAddTransition");
    let btnCreateAutomaton = $("#btnCreateAutomaton");
    let btnClearAutomaton = $("#btnClearAutomaton");

    let regexInput = $("#regexInput");
    let btnGenerateAutomaton = $("#btnGenerateAutomaton");

    let stringInput = $("#stringInput");
    let btnMatchString = $("#btnMatchString");

    let btnDownloadScript = $("#btnDownloadScript");

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

        let states = statesInput.val().toUpperCase().split(',');
        let symbols = symbolsInput.val().toUpperCase().split(',');
        let initial = initialInput.val().toUpperCase();
        let final = finalInput.val().toUpperCase().split(',');

        let automaton = {
            "states": states,
            "symbols": symbols,
            "initial": initial,
            "final": final,
            "transitions": transitions
        };

        if (states.length > 0 && symbols.length > 0 && initial !== "" && final.length > 0 && transitions.length > 0) {
            $.ajax({
                type: "POST", url: "/automaton/create", data: JSON.stringify(automaton),
                contentType: "application/json; charset=utf-8", dataType: "json",
            }).done(function (response) {
                if (response.success) {
                    localStorage.setItem("automaton", JSON.stringify(response.data));
                    showAutomatonSolutionResponse();
                    clearAutomatonFormInputs();
                    buildGraph(response.data);
                    buildJsonText(response.automaton);
                    transitions = [];
                } else {
                    showAutomatonSolutionInfo();
                    failMessage(response.message);
                }
            }).fail(function () {
                showAutomatonSolutionInfo();
                failMessage("Ha ocurrido un error, por favor revisa tu configuración o inténtalo más tarde");
            });
        } else {
            showAutomatonSolutionInfo();
            failMessage("Por favor verifica que hayas ingresado todos los campos");
        }
    });

    btnGenerateAutomaton.click((event) => {
        event.preventDefault();
        let regex = regexInput.val();

        if (regex !== "") {
            let data = {"regex": regex};

            $.ajax({
                type: "POST", url: "/regex/generate", data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8", dataType: "json",
            }).done(function (response) {
                console.log(response);
                if (response.success) {
                    localStorage.setItem("automaton", JSON.stringify(response.data));
                    showAutomatonSolutionResponse();
                    clearRegexFormInputs();
                    buildGraph(response.data);
                    buildJsonText(response.data);
                    buildPythonScript(response.automaton);
                } else {
                    showAutomatonSolutionInfo();
                    failMessage(response.message);
                }
            }).fail(function () {
                showAutomatonSolutionInfo();
                failMessage("Ha ocurrido un error, por favor revisa tu configuración o inténtalo más tarde");
            });
        } else {
            showAutomatonSolutionInfo();
            failMessage("Por favor verifica que hayas ingresado todos los campos");
        }
    });

    btnMatchString.click((event) => {
        event.preventDefault();
        let string = stringInput.val();

        if (string !== "") {
            showMatchLoader();
            let automaton = JSON.parse(localStorage.getItem("automaton"));
            let data = {"string": string, "automaton": automaton};

            $.ajax({
                type: "POST", url: "/regex/match", data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8", dataType: "json",
            }).done(function (response) {
                hideMatchLoader();
                console.log(response);
                if (response.success) {
                    successMessage("La cadena coincide con el autómata");
                } else {
                    failMessage("La cadena no coincide con el autómata");
                }
            }).fail(function () {
                hideMatchLoader();
                showAutomatonSolutionInfo();
                failMessage("Ha ocurrido un error, por favor revisa tu configuración o inténtalo más tarde");
            });
        } else {
            showAutomatonSolutionInfo();
            failMessage("Por favor verifica que hayas ingresado todos los campos");
        }
    });

    btnDownloadScript.click((event) => {
        event.preventDefault();
        downloadScript();
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

    console.log({nodes: nodes, edges: edges});

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
    console.log(automaton);
    let pythonScript = generatePythonTemplate(automaton);
    localStorage.setItem("script", pythonScript);
    $("#codeAutomaton").html(`<code>${pythonScript}</code>`)
}

function downloadScript() {
    let script = localStorage.getItem("script");
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(script));
    element.setAttribute('download', 'script.py');

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}