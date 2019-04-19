class Automaton(object):
    def __init__(self, symbols: set, states: set, initial_state: str,
                 acceptation_states: set, transitions: dict):

        self.symbols = symbols
        self.states = states
        self.initial_state = initial_state
        self.acceptation_states = acceptation_states
        self.transitions = transitions

    @staticmethod
    def check_type(transitions: dict):
        for transition in transitions.items():
            for symbol in transition[1]:
                if ',' in symbol:
                    return 'nfa'
