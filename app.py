from flask import Flask
from flask import jsonify
from flask import render_template
from flask import request

from automaton.dfa import DFA
from automaton.enfa import ENFA
from automaton.nfa import NFA
from automaton.utils.common import check_type
from automaton.utils.common import from_dict_to_json_format
from automaton.utils.common import from_json_to_dict

# from automaton import enfa

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/automaton/create', methods=['POST'])
def create_automaton():
    json = request.get_json()
    print(f'json ==> {json}')
    try:
        automaton = from_json_to_dict(json)
        print(f'dict ==> {automaton}')
        if check_type(automaton) is 'nfa':
            nfa_automaton = NFA(automaton.get('symbols'),
                                automaton.get('states'),
                                automaton.get('initial_state'),
                                automaton.get('acceptation_states'),
                                automaton.get('transitions'))

            dfa_automaton = nfa_automaton.nfa_to_dfa()
        else:
            dfa_automaton = DFA(automaton.get('symbols'),
                                automaton.get('states'),
                                automaton.get('initial_state'),
                                automaton.get('final_states'),
                                automaton.get('transitions'))

        dfa_automaton.minify()
        data = from_dict_to_json_format(dfa_automaton.__dict__)
        print(f'response ==> {data}')

        success = True
        message = 'Automata creado con éxito'
    except Exception as error:
        print(error)
        success = False
        message = error
        data = {}
    response = jsonify({
        'success': success,
        'data': data,
        'message': message
    })
    print(response)

    return response


@app.route('/regex/generate', methods=['POST'])
def generate_automaton():
    json = request.get_json()
    print(f'json ==> {json}')
    try:
        dfa_automaton = ENFA.regex_to_dfa(json['regex'])
        dfa_automaton.minify()
        print(f'AUTOMATON {dfa_automaton.__dict__}')
        data = from_dict_to_json_format(dfa_automaton.__dict__)
        print(f'response ==> {data}')

        success = True
        message = 'Automata creado con éxito'
    except Exception as error:
        print(error)
        success = False
        message = error
        data = {}
    response = jsonify({
        'success': success,
        'data': data,
        'message': message
    })
    print(response)

    return response


if __name__ == '__main__':
    app.run(debug=True)
