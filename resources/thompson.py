import queue

from resources.nfa import NFA


class Thompson(object):
    def __init__(self, regular_expresion: str):
        self.regular_expression = regular_expresion
        self.operators = ('(', ')', '*', '+', '|', '.')
        self.alphabet = self.get_automaton_alphabet()

    def build_null_construction(self):
        return NFA({'lambda'}, {'A', 'B'}, 'A', {'B'}, {'A': {'lambda': 'B'}})

    def build_symbol_construction(self, symbol: str):
        return NFA({symbol}, {'A', 'B'}, 'A', {'B'}, {'A': {symbol: 'B'}})

    def build_dot_construction(self, symbol1: str, symbol2: str):
        return NFA({symbol1, symbol2}, {'A', 'B', 'C', 'D'}, 'A', {'D'},
                   {
                       'A': {symbol1: 'B'},
                       'B': {'lambda': 'C'},
                       'C': {symbol2: 'D'}
                   })

    def build_union_construction(self, symbol1: str, symbol2: str):
        return NFA({symbol1, symbol2}, {'A', 'B', 'C', 'D', 'E', 'F', 'G'}, 'A',
                   {'G'}, {
                       'A': {'lambda': 'B', 'lambda': 'C'},
                       'B': {'lambda': 'C'},
                       'C': {symbol2: 'D'}
                   })

    def get_automaton_alphabet(self):
        re_alphabet = set()
        for char in self.regular_expression:
            if char not in self.operators:
                re_alphabet.update(char)

        return re_alphabet

    def build_regular_expression_stack(self):
        nfa_queue = queue.Queue()
        for index, char in enumerate(self.regular_expression):
            print(index, char)
            if char in self.operators:
                if char is '(':
                    pass
                elif char is ')':
                    pass
                elif char is '*':
                    pass
                elif char is '+':
                    pass
                elif char is '|':
                    pass
                elif char is '.':
                    pass
            elif char in self.alphabet:
                pass
            else:
                print('error')

    if __name__ == '__main__':
        thompson = Thompson('(a.b*|ab)*.a.b')
        alphabet = thompson.get_automaton_alphabet()

        print(alphabet)

        thompson.build_regular_expression_stack()
