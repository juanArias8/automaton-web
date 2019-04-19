import itertools
import queue

from resources.automaton import Automaton
from resources.automaton_examples import odd_ones
from resources.dfa import DFA
from resources.exception import AutomatonException


class NFA(Automaton):

    def __init__(self, symbols: set, states: set, initial_state: str,
                 acceptation_states: set, transitions: dict):

        super().__init__(symbols, states, initial_state, acceptation_states,
                         transitions)

        self.validate_nfa()

    def validate_nfa(self) -> None:
        self.check_initial_state()
        self.check_acceptation_states()
        self.check_transitions()

    def check_initial_state(self) -> None:
        if self.initial_state not in self.states:
            raise AutomatonException(f'{self.initial_state}: estado inicial')

    def check_acceptation_states(self) -> None:
        for state in self.acceptation_states:
            if state not in self.states:
                raise AutomatonException(f'{state}: estado aceptación')

    def check_transitions(self) -> None:
        for state in self.transitions.items():
            self.check_transition_symbols(state[1])
            self.check_transition_target_states(state[1])

    def check_transition_symbols(self, state: dict) -> None:
        for symbol in state.keys():
            if symbol not in self.symbols:
                raise AutomatonException(f'{symbol}: símbolo transición')

    def check_transition_target_states(self, state: dict) -> None:
        for target_state in state.values():
            if ',' in target_state:
                target_state = target_state.replace(' ', '').split(',')

            for one_state in target_state:
                if one_state not in self.states:
                    raise AutomatonException(f'{state}: estado transición')

    def convert_nfa_in_dfa(self) -> DFA:
        """
        - Create variables
        - Get initial
        - Queue the initial state
        - While not empty queue:
        -   Queue out the first element
        -   if state in nfa states
        -       transition = get transition by state from transitions
        -       for symbol and target state from transition
        -           if target state is nfa state
        -               create name for new state
        -               get transitions for the new state by symbols
        -               add the state transition in temporal transitions
        -               add the symbol and the target state in the transition
        -               if target not in checked states
        -                   Queue the target state
        -            else if target state is dfa
        -               add the symbol and the target state in the transition
        -               if target not in checked states
        -                   Queue the target state
        -       add transition to dfa transitions
        -   else if state in temporal transitions
        -       dfa_transition = get the transition from temporal transitions
        -       add the transition to dfa transitions
        - get states from dfa transitions keys
        - get acceptation states
        :return:
        """
        dfa_states = set()
        dfa_acceptation_state = set()
        dfa_transitions = dict()
        states_to_check = queue.Queue()
        states_checked = set()

        states_to_check.put(self.initial_state)
        while not states_to_check.empty():
            state_review = states_to_check.get()
            state_review_info = self.transitions.get(state_review)
            transition = dict()
            for symbol, target_state in state_review_info.items():
                new_state_name = self.build_space_name(target_state)
                for state in new_state_name:
                    if state in self.acceptation_states:
                        dfa_acceptation_state.update({new_state_name})
                if new_state_name not in states_checked:
                    states_to_check.put(new_state_name)
                new_state_info = dict()
                for global_symbol in self.symbols:
                    target_state = ''
                    for state_name in new_state_name:
                        target_state += self.transitions[
                            state_name].get(global_symbol)
                    new_state_info.update({global_symbol: target_state})

                self.transitions.update({new_state_name: new_state_info})
                transition.update({symbol: new_state_name})
            dfa_transitions.update({state_review: transition})
            states_checked.update({state_review})

        dfa_states.update(dfa_transitions.keys())

        return DFA(self.symbols, dfa_states, self.initial_state,
                   dfa_acceptation_state, dfa_transitions)

    def get_new_transitions(self, new_state_name: str) -> dict:
        state_info = dict()
        for symbol in self.symbols:
            target_state = ''
            for state_name in new_state_name:
                target_state += self.transitions[state_name].get(symbol)
            target_state = self.build_space_name(target_state)
            state_info.update({symbol: target_state})
        return state_info

    @staticmethod
    def build_space_name(spaces_with_comma: str):
        """
        process:
            - Get list with valid states names
            - Sort the values and build string with it
            - Delete duplicate values
        :param spaces_with_comma:
        :return:
        """
        states = [i for i in spaces_with_comma if i is not ' ' and i is not ',']
        states_sorted = ''.join(sorted(states))
        return ''.join(char for char, _ in itertools.groupby(states_sorted))


if __name__ == '__main__':
    automaton = NFA(
        odd_ones.get('symbols'),
        odd_ones.get('states'),
        odd_ones.get('initial_state'),
        odd_ones.get('acceptation_state'),
        odd_ones.get('transitions')
    )

    automaton.convert_nfa_in_dfa()
    print(automaton.transitions)
