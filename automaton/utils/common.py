operator_precedence = {
    '|': 0,
    '.': 1,
    '+': 2,
    '*': 3
}


def insert_dot_operator(expression: str):
    output = ''

    for index, token in enumerate(expression):
        output += token

        if token is '(' or token is '|' or token is '.':
            continue

        if index < len(expression) - 1:
            lookahead = expression[index + 1]

            if lookahead is '*' or lookahead is '+' or lookahead is '|' or \
                    lookahead is ')' or lookahead is '.':
                continue

            output += '.'

    return output


def peek(stack: list):
    return stack[-1]


def to_postfix(expression: str):
    output = ''
    operator_stack = list()

    for token in expression:
        if token is '.' or token is '|' or token is '+' or token is '*':
            while operator_stack and peek(operator_stack) is not '(' and \
                    operator_precedence[peek(operator_stack)] >= \
                    operator_precedence[token]:
                output += operator_stack.pop()

            operator_stack.append(token)
        elif token is '(' or token is ')':
            if token is '(':
                operator_stack.append(token)
            else:
                while peek(operator_stack) is not '(':
                    output += operator_stack.pop()
                operator_stack.pop()
        else:
            output += token

    while operator_stack:
        output += operator_stack.pop()

    return output


def check_type(automaton: dict):
    for state, transition in automaton.get('transitions').items():
        for symbol, target in transition.items():
            if ',' in target:
                return 'nfa'
    return 'dfa'


def from_json_to_dict(automaton):
    transitions = dict()

    for transition in automaton['transitions']:
        state_transition = transitions.get(transition['state'])
        target_transition = {transition['symbol']: transition['target']}
        if state_transition:
            transitions.get(transition['state']).update(target_transition)
        else:
            transitions.update({transition['state']: target_transition})

    automaton = {
        'states': set(automaton['states']),
        'symbols': set(automaton['symbols']),
        'initial_state': automaton['initial'],
        'final_states': set(automaton['final']),
        'transitions': transitions
    }

    return automaton


def from_dict_to_json_format(automaton: dict):
    transitions = []
    for state, transition in automaton.get('transitions').items():
        for symbol, target in transition.items():
            transition_js = {'state': state, 'symbol': symbol, 'target': target}
            transitions.append(transition_js)

    automaton = {
        'states': list(automaton.get('states')),
        'symbols': list(automaton.get('symbols')),
        'initial': automaton.get('initial_state'),
        'final': list(automaton.get('final_states')),
        'transitions': transitions
    }

    return automaton


if __name__ == '__main__':
    text = '(a|b)*c'

    print(insert_dot_operator(text))
    print(to_postfix(insert_dot_operator(text)))
