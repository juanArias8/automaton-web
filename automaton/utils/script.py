automaton_test = {
    'symbols': {'0', '1'},
    'states': {'CPUP', 'CIUP', 'CPUI', 'CIUI'},
    'initial_state': 'CPUP',
    'final_states': {'CIUP'},
    'transitions': {
        'CPUP': {'0': 'CIUP', '1': 'CIUI'},
        'CIUP': {'0': 'CPUP', '1': 'CIUI'},
        'CPUI': {'0': 'CIUI', '1': 'CPUP'},
        'CIUI': {'0': 'CPUI', '1': 'CIUP'}
    }
}


def generate_dict_string(automaton: dict):
    states = ', '.join([f'"{state}"' for state in automaton.get('states')])
    symbols = ', '.join([f'"{symbol}"' for symbol in automaton.get('symbols')])
    initial = f'"{automaton.get("initial_state")}"'
    final = ', '.join([f'"{final}"' for final in automaton.get('final_states')])

    transitions = ''
    for state, transition in automaton.get('transitions').items():
        transitions += f'\t\t"{state}":' + '{'
        for symbol, target in transition.items():
            transitions += f'"{symbol}": "{target}", '
        transitions = transitions[: -2]
        transitions += '}, \n'

    automaton_string = 'automaton_test = {\n'
    automaton_string += '\t"states": {' + states + '}, \n'
    automaton_string += '\t"symbols": {' + symbols + '}, \n'
    automaton_string += '\t"initial_state": ' + initial + ', \n'
    automaton_string += '\t"final_states": {' + final + '}, \n'
    automaton_string += '\t"transitions": {\n' + transitions[:-3] + '\n\t}'
    automaton_string += '\n}'

    return automaton_string


def check_expression(automaton, expression: str) -> bool:
    state = automaton.get('initial_state')
    for item in expression:
        if item not in automaton.get('symbols'):
            return False
        transition = automaton.get('transitions').get(state)
        state = transition.get(item)
    return state in automaton.get('final_states')


if __name__ == '__main__':
    print(check_expression(automaton_test, '00011'))
    generate_dict_string(automaton_test)
