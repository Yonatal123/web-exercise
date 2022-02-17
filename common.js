window.onload = onWindowLoad()
window.addEventListener('resize', handleResize)

let generalData = {};
let results = [];
let planets = [];
let currneLowestIndex = 0;
let numOfRowsToDisplay = 0;

function onWindowLoad()
{
   document.getElementById('dataTable').style.visibility = "hidden";
   document.getElementById('nextBtn').disabled = true;
   document.getElementById('previousBtn').disabled = true;
   document.getElementById('previousNextBtns').style.visibility = "hidden";
   fetchGeneralData()
//    fetchGeneralWorldData();
}

function handleResize(){
    let winHeight = window.innerHeight;
    let leftHeightSpace = winHeight - 210
    numOfRowsToDisplay = Math.round (leftHeightSpace / 200);
    if(numOfRowsToDisplay < results.length)
    {
        document.getElementById('nextBtn').disabled = false;
    }

    feedTable(currneLowestIndex, numOfRowsToDisplay);
}

function onNextButtonClick(){
    currneLowestIndex += numOfRowsToDisplay;

    if(currneLowestIndex - numOfRowsToDisplay >= 0)
    {
        document.getElementById('previousBtn').disabled = false;
    }

    if(currneLowestIndex + numOfRowsToDisplay >= results.length)
    {
        feedTable(currneLowestIndex, results.length - currneLowestIndex);
        document.getElementById('nextBtn').disabled = true;
    }
    else{
        feedTable(currneLowestIndex, numOfRowsToDisplay);
    }
}

function onPreviousButtonClick(){
    currneLowestIndex -= numOfRowsToDisplay;
    
    if(currneLowestIndex + numOfRowsToDisplay <= results.length)
    {
        document.getElementById('nextBtn').disabled = false;
    }
    if(currneLowestIndex - numOfRowsToDisplay < 0)
    {
        document.getElementById('previousBtn').disabled = true;
    }

    feedTable(currneLowestIndex, numOfRowsToDisplay);
}