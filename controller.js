let generalData = {};

function fetchGeneralData(){
    fetch("https://www.swapi.tech/api/people/").then(res =>
        res.json().then(data => {
            generalData = data;
            generalDataCount = data.total_records;
        }).then(feedInitialResults)
    )
}

async function feedResults(firstIndex, lastIndex){
   for(let i = firstIndex; i <= lastIndex; i++){
       try{
        const res = await fetch("https://www.swapi.tech/api/people/" + i);
        console.log('fetched' + i);
        const resJson = await res.json();
        await setTableItem(resJson.result.properties.name, resJson.result.properties.gender, resJson.result.properties.homeworld);
       }
       catch{
           console.log("Failed to fetch " + i);
           generalDataCount -= 1;
       }

       const percentege = (i/lastIndex) * 100;
       if (!isLoadingAdditionalData){
           document.getElementById("loadingInitialText").innerHTML = Math.round(percentege) + "%";
        }
        else{
            document.getElementById("loadingAdditionalPercentage").innerHTML = Math.round(percentege) + "%";
        }
   }
    document.getElementById('horizontalSpaceship').style.visibility = "hidden";
    document.getElementById('loadingAdditionalIndication').style.visibility = "hidden";
    document.getElementById('nextBtn').disabled = false;
}

async function setTableItem(name, gender, worldPath){
    let worldNameExists = false;
    let worldName = "";
    for(let i = 0; i < tableItems.length; i++){
        if(worldPath === tableItems[i][3]){
            worldNameExists = true;
            worldName = tableItems[i][2];
            break;
        }
    }
    if(!worldNameExists){
        const res = await fetch(worldPath)
        const resJson = await res.json();
        worldName = resJson.result.properties.name;
    }

    tableItems.push([name, gender, worldName, worldPath]);
}

function feedTable(currentIndex, numOfRows){
    let temp = "";
    document.getElementById('data').innerHTML = temp;
    for(let i = currentIndex; i < currentIndex + numOfRows; i++){
        let itemName = tableItems[i][0].replace(/\s/g, '_');
        temp += "<tr" + " onclick=onRowClick(" + "'" + itemName + "'" + ")>" ;
        temp += "<td>" + tableItems[i][0] + "</td>";
        temp += "<td>" + tableItems[i][1] + "</td>";
        temp += "<td>" + tableItems[i][2] + "</td></tr>";
    }
    document.getElementById('data').innerHTML = temp;
    document.getElementById('dataTable').style.visibility = "visible";
    document.getElementById('previousNextBtns').style.visibility = "visible";
    document.getElementById('spaceship').remove();
    document.getElementById('loadingInitialText').remove();
}

function onRowClick(rowId){
    const characterName = removeUnderscore(rowId);
    let character = {};
    generalData.results.forEach(item => {
        if(item.name === characterName)
                 character = item;
    })

    document.getElementById('modalText').innerHTML = characterName;
    document.getElementById('characterHeight').innerHTML = "Height: " + character.height;
    document.getElementById('characterMass').innerHTML = "Mass: " + character.mass;
    document.getElementById('characterHairColor').innerHTML = "Hair Color: " + character.hair_color;
    document.getElementById('characterSkinColor').innerHTML = "Skin Color: " + character.skin_color;
    document.getElementById('characterEyeColor').innerHTML = "Eye Color: " + character.eye_color;
    document.getElementById('characterBirthYear').innerHTML = "Birth Year: " + character.birth_year;
    document.getElementById('characterGender').innerHTML = "Gender: " + character.gender;
    document.getElementById('CharacterModal').style.display = "block";
}

function onWorldColumnClick(){
    window.location.replace("HomeWorlds.html")
}

function removeUnderscore(string){
    return string.replace(/_+/g, ' ');
}

document.getElementsByClassName("close")[0].onclick = function(){
    document.getElementById('CharacterModal').style.display = "none";
}

