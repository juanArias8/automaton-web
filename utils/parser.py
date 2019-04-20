operator_precedence = {
    '|': 0,
    '.': 1,
    '+': 2,
    '*': 3
}


def insert_explicit_concat_operator(expression: str):
    output = ''

    for index, token in enumerate(expression):
        output += token

        if token is '(' or token is '|':
            continue

        if index < len(expression) - 1:
            lookahead = expression[index + 1]

            if lookahead is '*' or lookahead is '+' or lookahead is '|' or \
                    lookahead is ')':
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


if __name__ == '__main__':
    text = '(a|b)*c'

    print(insert_explicit_concat_operator(text))
    print(to_postfix(insert_explicit_concat_operator(text)))