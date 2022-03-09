#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Flask, jsonify, abort, render_template,url_for,request,session, redirect, send_from_directory, Response, Blueprint
from flask_cors import CORS, cross_origin
import pandas as pd
import requests
import json

class ReverseProxied(object):
    #Class to dynamically adapt Flask converted url of static files (/sttaic/js...) + templates html href links according to the url app path after the hostname (set in cnfig.py)
    def __init__(self, app, script_name=None, scheme=None, server=None):
        self.app = app
        self.script_name = script_name
        self.scheme = scheme
        self.server = server

    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME', '') or self.script_name
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]
        scheme = environ.get('HTTP_X_SCHEME', '') or self.scheme
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        server = environ.get('HTTP_X_FORWARDED_SERVER', '') or self.server
        if server:
            environ['HTTP_HOST'] = server
        return self.app(environ, start_response)

app = Flask(__name__)
CORS(app)

app.config.from_object('config')
port = app.config['PORT']
host = app.config['HOST']

app.wsgi_app = ReverseProxied(app.wsgi_app)

@app.route('/')
def home():
    return render_template('index.html',range="1000-7000")  

@app.route('/api/nodes', methods=['GET'])   
def get_nodes():
    #nb_publis arg structure is from-to
    df = pd.read_csv('static/data/nodes/nodes.csv', sep = ',', encoding='utf-8',dtype={"id": str})
    if request.args:
        nb_publis = request.args['nbPublis']
        nb = nb_publis.split("-")
        df = df[(df["nb_publis"] >= int(nb[0])) & (df["nb_publis"] <= int(nb[1])) & (df["country_s"] == "fr")]
    return df.to_json(orient='records')

@app.route('/api/edges')   
def get_edges():
    df = pd.read_csv('static/data/edges/edges.csv', sep = ',', encoding='utf-8',dtype={"source": str, "target": str})
    if request.args:
        nb_publis = request.args['nbPublis']
        print(url_for('get_nodes', nbPublis=nb_publis, _external=True))
        resp = requests.get(url_for('get_nodes', nbPublis=nb_publis, _external=True)).text
        data = json.loads(resp)
        #filter_nodes_string = request.args['filterNodes']
        #filter_nodes_list = list(filter_nodes_string.split(","))
        #df = df[(df["source"].isin(filter_nodes_list) | (df["target"].isin(filter_nodes_list)))]
        filter_nodes_list = [i["id"] for i in data]
        df = df[(df["source"].isin(filter_nodes_list) & (df["target"].isin(filter_nodes_list)))]
    return df.to_json(orient='records')      

if __name__ == '__main__':
    app.run(debug=True,host=host,port=port)
