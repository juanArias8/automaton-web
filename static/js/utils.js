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

function generatePythonTemplate(automaton) {
    return `${automaton}` +
        '\n\n' +
        'def check_expression(automaton, expression: str) -> bool:\n' +
        '    state = automaton.get(\'initial_state\')\n' +
        '    for item in expression.upper():\n' +
        '        if item not in automaton.get(\'symbols\'):\n' +
        '            return False\n' +
        '        transition = automaton.get(\'transitions\').get(state)\n' +
        '        state = transition.get(item)\n' +
        '    return state in automaton.get(\'final_states\')\n' +
        '\n\n' +
        'string = input(\'Ingrese la cadena >> \')\n' +
        'print(check_expression(automaton_test, string))'
}