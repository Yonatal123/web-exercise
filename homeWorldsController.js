window.onload = onWindowLoad()
window.addEventListener('resize', handleResize)

function fetchGeneralData()
{
    fetch("https://swapi.dev/api/planets").then(res =>
        res.json().then(data => {generalData = data}).then(handleResize)
    )
}

function feedTable(currentIndex, numOfRows){
    let temp = "";
    document.getElementById('data').innerHTML = temp;
    for(let i = currentIndex; i < currentIndex + numOfRows; i++){
        let item = generalData.results[i];
        temp += "<tr>" ;
        temp += "<td>" + item.name + "</td>";
        temp += "<td>" + item.terrain + "</td>";
    }
    document.getElementById('data').innerHTML = temp;
    document.getElementById('dataTable').style.visibility = "visible";
    document.getElementById('previousNextBtns').style.visibility = "visible";
    document.getElementById('spaceship').style.visibility = 'hidden';
}