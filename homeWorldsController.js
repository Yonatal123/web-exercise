window.onload = onWindowLoad()
window.addEventListener('resize', handleResize)

function fetchGeneralData()
{
    fetch("https://swapi.dev/api/planets").then(res =>
        res.json().then(data => {generalDataCount = data.count}).then(feedInitialResults)
    )
}

async function feedResults(firstIndex, lastIndex){
    for(let i = firstIndex; i <= lastIndex; i++){
        try{
         const res = await fetch("https://swapi.dev/api/planets/" + i);
         console.log('fetched planet' + i);
         const resJson = await res.json();
         await setTableItem(resJson.name, resJson.terrain);
        }
        catch{
            console.log("Failed to fetch " + i);
            generalDataCount -= 1;
        }
    }
 }

 async function setTableItem(name, terrain){
    tableItems.push([name, terrain]);
}

function feedTable(currentIndex, numOfRows){
    let temp = "";
    document.getElementById('data').innerHTML = temp;
    for(let i = currentIndex; i < currentIndex + numOfRows; i++){
        temp += "<tr>" ;
        temp += "<td>" + tableItems[i][0] + "</td>";
        temp += "<td>" + tableItems[i][1] + "</td>";
    }
    document.getElementById('data').innerHTML = temp;
    document.getElementById('dataTable').style.visibility = "visible";
    document.getElementById('previousNextBtns').style.visibility = "visible";
    document.getElementById('spaceship').style.visibility = 'hidden';
}