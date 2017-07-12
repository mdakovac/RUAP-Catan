function collectData(){
    var ar = []

    for(var i=0; i<54; i++){
        if(d3.select("#pos"+i).attr("data-cityColor")){
            var thisPosition = d3.select("#pos"+i)

            var x = thisPosition.attr("cx")
            var y = thisPosition.attr("cy")
            var color = thisPosition.attr("data-cityColor")

            var adjacentHexes = findAdjacentHexes(x,y)

            var resources = []
            for(var j=0; j<3; j++){
                if(adjacentHexes[j]){
                    if(d3.select(adjacentHexes[j]).attr("data-type") === "port"){
                        resources.push({type:"port", 
                                        resource:d3.select(adjacentHexes[j]).attr("data-portType")
                        })
                    }
                    else if(d3.select(adjacentHexes[j]).attr("data-type") === "hex"){
                        resources.push({type:"hex", 
                                        resource:d3.select(adjacentHexes[j]).attr("data-terrain"),
                                        numberChit:d3.select(adjacentHexes[j]).attr("data-chit")
                        })
                    }
                }else{
                    resources.push({type:"0", 
                                    resource:"0",
                                    numberChit:"0"
                    })
                }
                
            }

            ar.push({
                color:color,
                resources: resources
            })
        }

    }
    postClassification(ar)
    postRegression(ar)

}
function postRegression(data){
    var regData = {

        //indices => weight = 1, clay = 2, lumber = 3, ore = 4, sheep = 5, wheat = 6
        red: ["0", 0, 0, 0, 0, 0, 0],
        blue: ["0", 0, 0, 0, 0, 0, 0],
        white: ["0", 0, 0, 0, 0, 0, 0],
        brown: ["0", 0, 0, 0, 0, 0, 0]
    }

    var weight = {"2": 1, "12": 1, "3":2 , "11": 2, "4": 3, "10":3 , "5":4 , "9":4 , "6":5 , "8":5}
        
    for(var i=0; i<data.length; i++){
        for(var j=0; j<data[i].resources.length; j++){

            var r = data[i].resources[j].resource

            if(r == "ore" || r == "o"){
                regData[data[i].color][4]++;
            }
            else if(r == "wood" || r == "l"){
                regData[data[i].color][3]++;
            }
            else if(r == "brick" || r == "c"){
                regData[data[i].color][2]++;
            }
            else if(r == "sheep" || r == "s"){
                regData[data[i].color][5]++;
            }
            else if(r == "wheat" || r == "w"){
                regData[data[i].color][6]++;
            }else{
                continue;
            }

            if(data[i].resources[j].numberChit){
                regData[data[i].color][1] += weight[String(data[i].resources[j].numberChit)]
            }
        }
    }

    for(var j=1; j<7; j++){
        regData["red"][j] = String(regData["red"][j])
        regData["blue"][j] = String(regData["blue"][j])
        regData["white"][j] = String(regData["white"][j])
        regData["brown"][j] = String(regData["brown"][j])
    }

    //console.log(regData)
    post(regData, "/regression")
  
}

function postClassification(data){
    var regData = {
        red: ["0", "0",   "0","0", "0","0", "0","0", "0","0", "0","0", "0","0"],
        blue: ["1", "0",   "0","0", "0","0", "0","0", "0","0", "0","0", "0","0"],
        white: ["2", "0",   "0","0", "0","0", "0","0", "0","0", "0","0", "0","0"],
        brown: ["3", "0",   "0","0", "0","0", "0","0", "0","0", "0","0", "0","0"]
    }

    var redC = 2, blueC = 2, whiteC = 2, brownC = 2;

    for(var i=0; i<data.length; i++){
        for(var j=0; j<data[i].resources.length; j++){
            var r = data[i].resources[j].resource

            if(r == "ore" || r == "o"){
                if(data[i].resources[j].numberChit)
                    appendData(data[i].color, "O", data[i].resources[j].numberChit);
                else
                    appendData(data[i].color, "O", "0");
            }
            else if(r == "wood" || r == "l"){
                if(data[i].resources[j].numberChit)
                    appendData(data[i].color, "L", data[i].resources[j].numberChit);
                else
                    appendData(data[i].color, "L", "0");
            }
            else if(r == "brick" || r == "c"){
                if(data[i].resources[j].numberChit)
                    appendData(data[i].color, "C", data[i].resources[j].numberChit);
                else
                    appendData(data[i].color, "C", "0");
            }
            else if(r == "sheep" || r == "s"){
                if(data[i].resources[j].numberChit)
                    appendData(data[i].color, "S", data[i].resources[j].numberChit);
                else
                    appendData(data[i].color, "S", "0");
            }
            else if(r == "wheat" || r == "w"){
                if(data[i].resources[j].numberChit)
                    appendData(data[i].color, "W", data[i].resources[j].numberChit);
                else
                    appendData(data[i].color, "W", "0");
            }else{
                appendData(data[i].color, 0,0, true);
            }
        }
    }

    function appendData(color, resource, chit, skip=false){
        if(skip && color == "red"){
            redC+=2
        }else if(skip && color == "blue"){
            blueC+=2
        }else if(skip && color == "white"){
            whiteC+=2
        }else if(skip && color == "brown"){
            brownC+=2
        }else{
            if(color=="red"){
                regData[color][redC+1] = resource;
                regData[color][redC] = chit;
                redC+=2;
            }else if(color=="blue"){
                regData[color][blueC+1] = resource;
                regData[color][blueC] = chit;
                blueC+=2;
            }
            else if(color=="white"){
                regData[color][whiteC+1] = resource;
                regData[color][whiteC] = chit;
                whiteC+=2;
            }
            else if(color=="brown"){
                regData[color][brownC+1] = resource;
                regData[color][brownC] = chit;
                brownC+=2;
            }   
        }
        
    }

    post(regData, "/classification")
}



function post(dataToSend, url){
    $.ajax({
        type: "POST",
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(dataToSend),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){results[url] = data; interpret()},
        failure: function(errMsg) {
            alert(errMsg);
        }
    });
}
