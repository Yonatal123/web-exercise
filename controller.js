let worldDict = {};
let generalDataCount = 0;
let worldDataCount = 0;

function fetchGeneralData(){
    fetch("https://swapi.dev/api/people/").then(res =>
        res.json().then(data => {generalDataCount = data.count}).then(feedInitialResults)
    )
}

// function fetchGeneralWorldData(){
//     fetch("https://swapi.dev/api/planets/").then(res =>
//         res.json().then(data => {worldDataCount = data.count}).then(fetchWorldData)
//     )
// }

async function feedInitialResults(){
   const count = generalDataCount > 10 ? 10 : generalDataCount
   for(let i = 1; i <= 10; i++){
       const res = await fetch("https://swapi.dev/api/people/" + i);
       console.log('fetched' + i);
       const resJson = await res.json();
       await results.push(resJson);
   }
   fetchWorldData();
}

async function fetchWorldData(){
    await Promise.all(
        results.map(async item => {
            const res = await fetch(item.homeworld);
            console.log('fetached ' + item.homeworld);
            const resJson = await res.json();
            await setDict(item.name, resJson.name);
        })
    )
    handleResize();
    feedRestOfResults();
}

async function setDict(itemName, worldName){
    worldDict[itemName] = worldName
}

async function feedRestOfResults(){
    for(let i = 11; i <= generalDataCount; i++){
        const res = await fetch("https://swapi.dev/api/people/" + i);
        console.log('fetched' + i);
        const resJson = await res.json();
        await results.push(resJson);
    }
    fetchRemainingWorldData();
}

async function fetchRemainingWorldData(){
    for(let i = 11; i <= generalDataCount; i++){
        try{
            const res = await fetch(results[i].homeworld);
            console.log('fetached ' + results[i].homeworld);
            const resJson = await res.json();
            await setDict(results[i].name, resJson.name);
        }
        catch(err){}
        }
    }

function feedTable(currentIndex, numOfRows){
    let temp = "";
    document.getElementById('data').innerHTML = temp;
    for(let i = currentIndex; i < currentIndex + numOfRows; i++){
        let item = results[i];
        let itemName = item.name;
        if(typeof itemName !=+ 'undefined')
        {
            try{
                itemName = item.name.replace(/\s/g, '_');
            }
            catch{}
            temp += "<tr" + " onclick=onRowClick(" + "'" + itemName + "'" + ")>" ;
            temp += "<td>" + item.name + "</td>";
            temp += "<td>" + item.gender + "</td>";
            temp += "<td>" + worldDict[item.name] + "</td></tr>";
        }
    }
    document.getElementById('data').innerHTML = temp;
    document.getElementById('dataTable').style.visibility = "visible";
    document.getElementById('previousNextBtns').style.visibility = "visible";
    document.getElementById('spaceship').style.visibility = 'hidden';
}

function onRowClick(rowId){
    const characterName = removeUnderscore(rowId);
    let character = {};
    results.forEach(item => {
        if(item.name === characterName) character = item;
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

