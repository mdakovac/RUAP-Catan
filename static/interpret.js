var results = { "/regression": [], "/classification": []}


function interpret(){
	if(!results["/regression"].Results || !results["/classification"].Results)
		return;


	// polje koje sadržava rezultate predviđanja, prvo polje su floati koji 
	// označavaju produkciju redom: crveni, plavi, bijeli, smeđi
	// drugo polje označava vjerojatnost da je klasa 1 za isti poredak boja
	var returnedValues = [[],[]]
	for(var i=0; i<4; i++){
		returnedValues[0].push(results["/regression"].Results.output1.value.Values[i][0])
		returnedValues[1].push(results["/classification"].Results.output1.value.Values[i][1])
	}

	console.log(returnedValues)
	console.log(results)

	var maxProduction={player:0, production:0};
	var maxProbability={player:0, probability:0};

	var playerColors = ["red", "blue", "white", "brown"]

	// nađi najveću produkciju i najveću vjerojatnost, spremaju se u varijable
	// maxProduction i maxProbability
	for(i=0; i<2; i++){
		for(j=0; j<4; j++){
			if(returnedValues[0][j]>maxProduction.production){
				maxProduction.production=returnedValues[0][j]
				maxProduction.player = playerColors[j]
			}
			if(returnedValues[1][j]>maxProbability.probability){
				maxProbability.probability=returnedValues[1][j]
				maxProbability.player = playerColors[j]
			}  
		}
	}

console.log(maxProduction)
console.log(maxProbability)


// ----------------------------OVAJ DIO MIJENJAJ AKO ŽELIŠ DRUGAČIJI ISPIS-----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------
var html = 	"<p>Highest production according to regression algorithm: "+maxProduction.player+"</p><p>Highest chance of winning according to classification algorithm: "+maxProbability.player+"</p>"
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------


$("#printSpace").html(html);


}
