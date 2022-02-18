window.onload = onWindowLoad()
window.addEventListener('resize', handleResize)

let tableItems = [];
let generalDataCount = 0;
let currneLowestIndex = 0;
let numOfRowsToDisplay = 0;

function onWindowLoad()
{
   document.getElementById('dataTable').style.visibility = "hidden";
   document.getElementById('nextBtn').disabled = true;
   document.getElementById('previousBtn').disabled = true;
   document.getElementById('previousNextBtns').style.visibility = "hidden";
   fetchGeneralData()
}

async function feedInitialResults(){
    const count = generalDataCount > 10 ? 10 : generalDataCount;
    await feedResults(1, count);
    handleResize();
    if(generalDataCount > 10)
        feedResults(11, generalDataCount);
}

function handleResize(){
    let winHeight = window.innerHeight;
    let leftHeightSpace = winHeight - 210
    numOfRowsToDisplay = Math.round (leftHeightSpace / 200);
    if(numOfRowsToDisplay < generalDataCount)
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

    if(currneLowestIndex + numOfRowsToDisplay >= generalDataCount)
    {
        feedTable(currneLowestIndex, generalDataCount - currneLowestIndex);
        document.getElementById('nextBtn').disabled = true;
    }
    else{
        feedTable(currneLowestIndex, numOfRowsToDisplay);
    }
}

function onPreviousButtonClick(){
    currneLowestIndex -= numOfRowsToDisplay;
    
    if(currneLowestIndex + numOfRowsToDisplay <= generalDataCount)
    {
        document.getElementById('nextBtn').disabled = false;
    }
    if(currneLowestIndex - numOfRowsToDisplay < 0)
    {
        document.getElementById('previousBtn').disabled = true;
    }

    feedTable(currneLowestIndex, numOfRowsToDisplay);
}