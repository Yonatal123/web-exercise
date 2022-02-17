let generalData = {};
let worldDict = {};
let currneLowestIndex = 0;
let numOfRowsToDisplay = 0;

window.onload = onWindowLoad()
window.addEventListener('resize', handleResize)

function onWindowLoad()
{
   document.getElementById('dataTable').style.visibility = "hidden";
   document.getElementById('nextBtn').disabled = true;
   document.getElementById('previousBtn').disabled = true;
   document.getElementById('previousNextBtns').style.visibility = "hidden";
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
    handleResize()
}

async function setDict(itemName, worldName){
    worldDict[itemName] = worldName
}

function handleResize(){
    let winHeight = window.innerHeight;
    let leftHeightSpace = winHeight - 210
    numOfRowsToDisplay = Math.round (leftHeightSpace / 200);
    if(numOfRowsToDisplay < generalData.results.length)
    {
        document.getElementById('nextBtn').disabled = false;
    }

    feedTable(currneLowestIndex, numOfRowsToDisplay);
}

function feedTable(currentIndex, numOfRows){
    let temp = "";
    document.getElementById('data').innerHTML = temp;
    for(let i = currentIndex; i < currentIndex + numOfRows; i++){
        let item = generalData.results[i];
        let itemName = item.name.replace(/\s/g, '_');
        temp += "<tr id='" + item.name + "'" + "onclick=onRowClick(" + "'" + itemName + "'" + ")>" ;
        temp += "<td>" + item.name + "</td>";
        temp += "<td>" + item.gender + "</td>";
        temp += "<td>" + worldDict[item.name] + "</td></tr>";
    }
    document.getElementById('data').innerHTML = temp;
    document.getElementById('dataTable').style.visibility = "visible";
    document.getElementById('previousNextBtns').style.visibility = "visible";
    document.getElementById('spaceship').style.visibility = 'hidden';
    registerTableRowClick();
}

function onRowClick(rowId)
{
    let characterName = rowId.replace(/_+/g, ' ');
    document.getElementById('modalText').innerHTML = characterName;
    document.getElementById('CharacterModal').style.display = "block";
}

document.getElementsByClassName("close")[0].onclick = function(){
    document.getElementById('CharacterModal').style.display = "none";
}

function onNextButtonClick(){
    currneLowestIndex += numOfRowsToDisplay;

    if(currneLowestIndex - numOfRowsToDisplay >= 0)
    {
        document.getElementById('previousBtn').disabled = false;
    }

    if(currneLowestIndex + numOfRowsToDisplay >= generalData.results.length)
    {
        feedTable(currneLowestIndex, generalData.results.length - currneLowestIndex);
        document.getElementById('nextBtn').disabled = true;
    }
    else{
        feedTable(currneLowestIndex, numOfRowsToDisplay);
    }
}

function onPreviousButtonClick(){
    currneLowestIndex -= numOfRowsToDisplay;
    
    if(currneLowestIndex + numOfRowsToDisplay <= generalData.results.length)
    {
        document.getElementById('nextBtn').disabled = false;
    }
    if(currneLowestIndex - numOfRowsToDisplay < 0)
    {
        document.getElementById('previousBtn').disabled = true;
    }

    feedTable(currneLowestIndex, numOfRowsToDisplay);
}