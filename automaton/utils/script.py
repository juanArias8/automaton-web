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
    state = '"states: {"'
    for state in automaton.get('states'):
        state += f'"{state}", '


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
