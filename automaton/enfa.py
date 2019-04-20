from utils import parser


class ENFA:
    def __init__(self, symbols: set, states: set, initial_state: str,
                 final_state: str, transitions: dict):
        self.symbols = symbols
        self.states = states
        self.initial_state = initial_state
        self.final_state = final_state
        self.transitions = transitions

    @staticmethod
    def regular_expression_to_enfa(regular_expression: str):
        regular_expression = parser.insert_dot_operator(regular_expression)
        postfix = parser.to_postfix(regular_expression)

        return ENFA.postfix_to_nfa(postfix)

    @staticmethod
    def postfix_to_nfa(postfix: str):
        if postfix is '':
            return ENFA.basic_epsilon('0')

        stack = []
        for token in postfix:
            if token is '*':
                automaton = stack.pop()
                automaton = ENFA.build_star_closure(automaton)
                stack.append(automaton)

                print('* ==> ', automaton.__dict__)
            elif token is '+':
                automaton = stack.pop()
                automaton = ENFA.build_plus_closure(automaton)
                stack.append(automaton)

                print('+ ==> ', automaton.__dict__)
            elif token is '|':
                right = stack.pop()
                left = stack.pop()
                automaton = ENFA.build_union(left, right)
                stack.append(automaton)

                print('| ==> ', automaton.__dict__)
            elif token is '.':
                right = stack.pop()
                left = stack.pop()
                automaton = ENFA.build_union(left, right)
                stack.append(automaton)

                print('. ==> ', automaton.__dict__)
            else:
                state = ENFA.get_max_state(stack[-1].states) if stack else '0'
                automaton = ENFA.basic_symbol(state, token)
                stack.append(automaton)

        print('final ==> ', stack[-1].__dict__)
        return stack.pop()

    @staticmethod
    def basic_epsilon(max_state: str):
        initial_state, final_state = ENFA.get_initial_final_states(max_state)

        symbols = {'e'}
        states = {initial_state, final_state}
        transitions = {initial_state: {'e': final_state}}

        return ENFA(symbols, states, initial_state, final_state, transitions)

    @staticmethod
    def basic_symbol(max_state: str, symbol: str):
        initial_state, final_state = ENFA.get_initial_final_states(max_state)

        symbols = {symbol}
        states = {initial_state, final_state}
        transitions = {initial_state: {symbol: final_state}}

        return ENFA(symbols, states, initial_state, final_state, transitions)

    @staticmethod
    def build_concatenation(first_enfa, second_enfa):
        symbols = first_enfa.symbols.union(second_enfa.symbols)
        states = first_enfa.states.union(second_enfa.states)
        initial_state = first_enfa.initial_state
        final_state = second_enfa.final_state

        transitions = dict()
        transitions.update(first_enfa.transitions)
        transitions.update(second_enfa.transitions)
        transitions.update({first_enfa.final_state: {
            'e': second_enfa.initial_state
        }})

        return ENFA(symbols, states, initial_state, final_state, transitions)

    @staticmethod
    def build_union(first_enfa, second_enfa):
        max_state = ENFA.get_max_state(first_enfa.states, second_enfa.states)
        initial_state, final_state = ENFA.get_initial_final_states(max_state)

        symbols = {'e'}.union(first_enfa.symbols.union(second_enfa.symbols))
        states = {initial_state, final_state}.union(
            first_enfa.states.union(second_enfa.states))

        transitions = dict()
        transitions.update({initial_state: {
            'e': f'{first_enfa.initial_state},{second_enfa.initial_state}'
        }})
        transitions.update({first_enfa.final_state: {'e': final_state}})
        transitions.update({second_enfa.final_state: {'e': final_state}})
        transitions.update(first_enfa.transitions)
        transitions.update(second_enfa.transitions)

        return ENFA(symbols, states, initial_state, final_state, transitions)

    @staticmethod
    def build_star_closure(enfa):
        max_state = ENFA.get_max_state(enfa.states)
        initial_state, final_state = ENFA.get_initial_final_states(max_state)

        symbols = {'e'}.union(enfa.states)
        states = {initial_state, final_state}.union(enfa.states)

        transitions = dict()
        transitions.update(enfa.transitions)
        transitions.update({initial_state: {
            'e': f'{enfa.initial_state},{final_state}'
        }})
        transitions.update({enfa.final_state: {
            'e': f'{enfa.initial_state},{final_state}'
        }})

        return ENFA(symbols, states, initial_state, final_state, transitions)

    @staticmethod
    def build_plus_closure(enfa):
        max_state = ENFA.get_max_state(enfa.states)
        initial_state, final_state = ENFA.get_initial_final_states(max_state)

        symbols = {'e'}.union(enfa.states)
        states = {initial_state, final_state}.union(enfa.states)

        transitions = dict()
        transitions.update(enfa.transitions)
        transitions.update({enfa.final_state: {
            'e': {f'{enfa.initial_state},{final_state}'}
        }})

        return ENFA(symbols, states, initial_state, final_state, transitions)

    @staticmethod
    def get_max_state(first_enfa_states: set, second_enfa_states=None):
        if second_enfa_states is not None:
            states = first_enfa_states.union(second_enfa_states)
        else:
            states = first_enfa_states
        return max(states)

    @staticmethod
    def get_initial_final_states(max_state: str):
        initial_state = f'{int(max_state) + 1}'
        final_state = f'{int(max_state) + 2}'

        return initial_state, final_state


if __name__ == '__main__':
    text = '(a|b)*'
    ENFA.regular_expression_to_enfa(text)
