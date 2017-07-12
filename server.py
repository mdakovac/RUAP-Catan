from flask import Flask, request, render_template
import urllib as urllib
import urllib.request as urll
from urllib.error import HTTPError
import json 

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
	return render_template("catan.html")

@app.route("/classification", methods=["POST"])
def classification():
	acq = request.get_json()
	#print(acq)
	data =  {

		"Inputs": {

				"input1":
				{
					"ColumnNames": ["player", "win", "settlement1", "Column 16", "Column 17", "Column 18", "Column 19", "Column 20", "settlement2", "Column 22", "Column 23", "Column 24", "Column 25", "Column 26"],
					"Values": [ acq["red"], acq["blue"], acq["white"], acq["brown"]]
				},        
		},
			
		"GlobalParameters": {}
		
	}

	#print(data)

	body = str.encode(json.dumps(data))

	url = 'https://ussouthcentral.services.azureml.net/workspaces/6daf7e7d85da4f84aa887058a1951c4e/services/969aaf10d3f948afa5d4ed3696a06912/execute?api-version=2.0&details=true'
	api_key = 'yabZVUZ4QxXEhm7nW1X65A+93ggPHnlrWLljIrCLDdtZ51PLhFCYZhx5w7reqomeGut924VlpVBi5KB6S5Bgog=='
	headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}

	req = urll.Request(url, body, headers) 
	try:
		response = urll.urlopen(req)

		result = response.read()
		#print(result) 
		return result 
	except HTTPError as e:
		print(e)
  

@app.route("/regression", methods=["POST"])
def regression():
	acq = request.get_json()
	data =  {

		"Inputs":
		{

				"input1":
				{
					"ColumnNames": ["production", "weight", "C", "L", "O", "S", "W"],
					"Values": [ acq["red"], acq["blue"], acq["white"], acq["brown"] ]
				},        
		},
		
		"GlobalParameters": {}

	}

	#print(data)

	body = str.encode(json.dumps(data))

	url = 'https://ussouthcentral.services.azureml.net/workspaces/6daf7e7d85da4f84aa887058a1951c4e/services/af683cb1e89448c480d868764377a72e/execute?api-version=2.0&details=true'
	api_key = 'kILUTKEAr2XqdrC17z3RiqdtXeb+oCoLK6E260Q5Bdx65DDfTgke1arCKdTP4CBEshmBF0pFht4nFsHIWDf8hw==' # Replace this with the API key for the web service
	headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}

	req = urll.Request(url, body, headers) 

	response = urll.urlopen(req)

	result = response.read()
	#print(result)
	return result

if __name__ == "__main__":
	app.run()