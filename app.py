from flask import Flask
from flask import render_template
from flask import request

from automaton.utils.parser import check_type

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/automaton/create', methods=['POST'])
def create_automaton():
    json = request.get_json()
    automaton_type = check_type(json)
    print(automaton_type)
    return None


if __name__ == '__main__':
    app.run(debug=True)
