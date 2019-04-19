def create_state(is_end_state):
    return {
        'is_end': is_end_state,
        'transition': dict(),
        'epsilon_transitions': list()
    }


def add_epsilon_transition(source, target):
    source['epsilon_transitions'].append(target)


def add_transition(source, target, symbol):
    source['transition'].update({symbol: target})


def from_epsilon():
    start = create_state(False)
    end = create_state(True)
    add_epsilon_transition(start, end)

    return {'start': start, 'end': end}


def from_symbol(symbol):
    start = create_state(False)
    end = create_state(True)
    add_transition(start, end, symbol)

    return {'start': start, 'end': end}


def concat(first, second):
    add_epsilon_transition(first['end'], second['start'])
    first['end']['is_end'] = False

    return {'start': first['start'], 'end': second['end']}


def union(first, second):
    start = create_state(False)
    add_epsilon_transition(start, first['start'])
    add_epsilon_transition(start, second['start'])

    end = create_state(True)
    add_epsilon_transition(first['end'], end)
    add_epsilon_transition(second['end'], end)

    first['end']['is_end'] = False
    second['end']['is_end'] = False

    return {'start': start, 'end': end}


def closure(nfa):
    start = create_state(False)
    end = create_state(True)

    add_epsilon_transition(start, end)
    add_epsilon_transition(start, nfa['start'])
    add_epsilon_transition(nfa['end'], end)
    add_epsilon_transition(nfa['end'], nfa['start'])

    nfa['end']['is_end'] = False

    return {'start': start, 'end': end}


def expression_to_nfa(expression: str):
    if expression is '':
        return from_epsilon()

    stack = list()

    for token in expression:
        if token is '*':
            stack.append(closure(stack.pop()))
        elif token is '|':
            right = stack.pop()
            left = stack.pop()
            stack.append(union(left, right))
        elif token is '.':
            right = stack.pop()
            left = stack.pop()
            stack.append(concat(left, right))
        else:
            stack.append(from_symbol(token))

    return stack.pop()


if __name__ == '__main__':
    from automaton.parser import to_postfix

    text = to_postfix('(ab*|ab)ab*')
    print(text)
    automaton = expression_to_nfa(text)

    print(automaton['start'])
    print(automaton['end'])
