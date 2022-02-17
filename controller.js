let generalData = {};
let worldDict = {};

window.onload = fetchData()

function fetchData()
{
   document.getElementById('dataTable').style.visibility = "hidden";
   fetchGeneralData()
}

function fetchGeneralData()
{
    fetch("https://swapi.dev/api/people").then(res =>
        res.json().then(data => {generalData = data}).then(fetchWorldData)
    )
}


async function fetchWorldData()
{
    await Promise.all(
        generalData.results.map(async item => {
            const res = await fetch(item.homeworld);
            const resJson = await res.json();
            await setDict(item.name, resJson.name);
        })
    )

    feedTable()
}

async function setDict(itemName, worldName){
    worldDict[itemName] = worldName
}

function feedTable(){
    let temp = "";
    generalData.results.forEach(item =>{
        temp += "<tr>";
        temp += "<td>" + item.name + "</td>";
        temp += "<td>" + item.gender + "</td>";
        temp += "<td>" + worldDict[item.name] + "</td></tr>";
    })
    document.getElementById('data').innerHTML = temp;
    document.getElementById('dataTable').style.visibility = "visible";
}