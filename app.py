from flask import Flask, jsonify, render_template
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    df = pd.read_csv('data.csv')
    df.columns = [column.strip() for column in df.columns]
    df['problem_type'] = df['problem_type'].str.strip()
    data = df.to_dict(orient='records')
        
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
