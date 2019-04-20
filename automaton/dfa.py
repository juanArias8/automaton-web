import queue

from examples.automaton_examples import strange_states
from exceptions.exception import AutomatonException


class DFA(object):
    def __init__(self, symbols: set, states: set, initial_state: str,
                 acceptation_states: set, transitions: dict):

        self.symbols = symbols
        self.states = states
        self.initial_state = initial_state
        self.final_states = acceptation_states
        self.transitions = transitions

        self.validate_dfa()
        self.minify()

    def validate_dfa(self) -> None:
        self.check_initial_state()
        self.check_acceptation_states()
        self.check_transitions()

    def check_initial_state(self) -> bool:
        return self.initial_state in self.states

    def check_acceptation_states(self) -> bool:
        for state in self.final_states:
            if state not in self.states:
                raise AutomatonException(f'{state} es un estado inválido')
        return True

    def check_transitions(self) -> bool:
        for state in self.transitions.items():
            self.check_transition_symbols(state[1])
            self.check_transition_target_states(state[1])
        return True

    def check_transition_symbols(self, state: dict) -> None:
        for symbol in state.keys():
            if symbol not in self.symbols:
                raise AutomatonException(f'{symbol} es un símbolo inválido')

    def check_transition_target_states(self, state: dict) -> None:
        for target_state in state.values():
            if target_state not in self.states:
                raise AutomatonException(
                    f'{target_state} es un estado inválido')

    def minify(self) -> None:
        self.delete_strange_states()

    def delete_strange_states(self) -> None:
        valid_states = set()
        states_to_check = queue.Queue()
        states_checked = set()

        states_to_check.put(self.initial_state)
        while not states_to_check.empty():
            state = states_to_check.get()
            transition = self.transitions[state]

            for symbol, target_state in transition.items():
                if target_state not in states_checked:
                    states_to_check.put(target_state)

            states_checked.add(state)
            valid_states.add(state)

        self.states = valid_states
        original_states = list(self.transitions.keys())

        for state in original_states:
            if state not in self.states:
                del self.transitions[state]

    def make_transition(self, state: str, symbol: str) -> str:
        transition = self.transitions.get(state)
        return transition.get(symbol)

    def check_expression(self, expression: str):
        state = self.initial_state
        for item in expression:
            state = self.make_transition(state, item)
            print(state, " ==> ", item)
        return self.check_match(state)

    def check_match(self, state: str) -> bool:
        return state in self.final_states


if __name__ == '__main__':
    automaton = DFA(
        strange_states.get('symbols'),
        strange_states.get('states'),
        strange_states.get('initial_state'),
        strange_states.get('acceptation_state'),
        strange_states.get('transitions')
    )

    automaton.minify()
    print(automaton.transitions)

# if __name__ == '__main__':
#     utils = NFA(
#         odd_ones.get('symbols'),
#         odd_ones.get('states'),
#         odd_ones.get('initial_state'),
#         odd_ones.get('acceptation_state'),
#         odd_ones.get('transitions')
#     )
