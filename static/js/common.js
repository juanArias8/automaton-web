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

function generatePythonTemplate(automaton){
    return 'automaton_test = {\n' +
        '    \'symbols\': {\'0\', \'1\'},\n' +
        '    \'states\': {\'CPUP\', \'CIUP\', \'CPUI\', \'CIUI\'},\n' +
        '    \'initial_state\': \'CPUP\',\n' +
        '    \'final_states\': {\'CIUP\'},\n' +
        '    \'transitions\': {\n' +
        '        \'CPUP\': {\'0\': \'CIUP\', \'1\': \'CIUI\'},\n' +
        '        \'CIUP\': {\'0\': \'CPUP\', \'1\': \'CIUI\'},\n' +
        '        \'CPUI\': {\'0\': \'CIUI\', \'1\': \'CPUP\'},\n' +
        '        \'CIUI\': {\'0\': \'CPUI\', \'1\': \'CIUP\'}\n' +
        '    }\n' +
        '}\n' +
        '\n' +
        '\n' +
        'def check_expression(automaton, expression: str) -> bool:\n' +
        '    state = automaton.get(\'initial_state\')\n' +
        '    for item in expression:\n' +
        '        transition = automaton.get(\'transitions\').get(state)\n' +
        '        state = transition.get(item)\n' +
        '    return state in automaton.get(\'final_states\')\n' +
        '\n' +
        '\n' +
        'if __name__ == \'__main__\':\n' +
        '    print(check_expression(automaton_test, \'00011\'))\n'
}