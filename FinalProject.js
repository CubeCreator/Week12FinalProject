//Classes Defined
class Weapons{
    static idCounter = 0

    constructor(weaponName, weaponSlot, damageType, clipType, specialType){
        this.weaponName = weaponName;
        this.weaponId = wEidCounter++;
        this.weaponSlot = weaponSlot;
        this.damageType = damageType;
        this.clipType = clipType;
        this.specialType = specialType;

    }
}

class Character {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.descriptionInfo = [];
        this.weaponInfo = [];
    }

    addWeaponsInfo(weaponName, weaponSlot, damageType, clipType, specialType) {
        this.info.push(new Weapons(weaponName, weaponSlot, damageType, clipType, specialType));
    }

    addDescriptionInfo(name, gender, race, nationality, occupation, age, personality, backstory) {
        this.info.push(new Description(name, gender, race, nationality, occupation, age, personality, backstory));
    }
}

class Description {
    idCounter = 0

    constructor(gender, race, nationality, occupation, age, personality, backstory){
        this.descriptionId = Description.idCounter++;
        this.gender = gender;
        this.race = race;
        this.nationality = nationality;
        this.occupation = occupation;
        this.age = age;
        this.personality = personality;
        this.backstory = backstory;
    }
}

class CharacterServices {
    static url = 'https://6405117feed195a99f7baa23.mockapi.io/CharaList/Webpage';

    static getAllCharacters() {
        return $.get(this.url);
    }

    static getCharacter(id) {
        return $.get(this.url + `/${id}`);
    }

    static createCharacter(character) {
        return $.post(this.url, character);
    }

    static updateCharacter(character) {
        return $.ajax({
            url: this.url + `/${character.id}`,
            dataType: 'json',
            data: JSON.stringify(character),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteCharacter(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static characters;
    //Get All Characters
    static getAllCharacters() {
        CharacterServices.getAllCharacters().then(characters => this.render(characters))
    }
    //Create Character
    static createCharacter(name) {
        CharacterServices.createCharacter(new Character(name))
            .then(() => {
                return CharacterServices.getAllCharacters();
            })
            .then((characters) => this.render(characters));
    }
    //Delete Character
    static deleteCharacter(id){
        CharacterServices.deleteCharacter(id)
            .then(() => {
                return CharacterServices.getAllCharacters();
            })
            .then((characters) => this.render(characters));
    }

    //Add Weapons to Info
    static addWeaponsInfo(id){
        for (let character of this.characters) {
            if(character.id == id) {
                console.log(character.weaponInfo)
                character.weaponInfo.push(new Weapons($(`#${character.id}-weapon-name`).val(), $(`#${character.id}-weapon-slot`).val(), $(`#${character.id}-weapon-type`).val(), $(`#${character.id}-clip-type`).val(), $(`#${character.id}-weapon-special`).val()));
                CharacterServices.updateCharacter(character)
                    .then(() => {
                        return CharacterServices.getAllCharacters();
                    })
                    .then((characters) => this.render(characters))
            }
        }
        console.log("Weapon Added")
    }

    //Add Description to Info
    static addDescriptionInfo(id){
        for (let character of this.characters) {
            if(character.id == id) {
                console.log(character.descriptionInfo)
                character.descriptionInfo.push(new Description($(`#${character.id}-gender`).val(), $(`#${character.id}-race`).val(), $(`#${character.id}-nationality`).val(), $(`#${character.id}-occupation`).val(), $(`#${character.id}-age`).val(), $(`#${character.id}-personality`).val(), $(`#${character.id}-backstory`).val()));
                CharacterServices.updateCharacter(character)
                    .then(() => {
                        return CharacterServices.getAllCharacters();
                    })
                    .then((characters) => this.render(characters))
            }
        }
        console.log("Description Added")
    }
    
    //Delete Weapon Info
    static deleteWeaponInfo(characterId, weaponId) {
        for(let character of this.characters) {
            if(character.id == characterId) {
                for (let info of character.weaponInfo) {
                    console.log(info.weaponId, weaponId)
                    if (info.weaponId == weaponId) {
                        character.weaponInfo.splice(character.weaponInfo.indexOf(info), 1);
                        CharacterServices.updateCharacter(character)
                            .then(() => {
                                return CharacterServices.getAllCharacters();
                            })
                            .then((characters) => this.render(characters));
                    }
                }
            }
        }
        console.log("Info Deleted")
    }

    //Delete Description Info
    static deleteDescriptionInfo(characterId, descriptionId) {
        for(let character of this.characters) {
            if(character.id == characterId) {
                for (let info of character.descriptionInfo) {
                    console.log(info.descriptionId, descriptionId)
                    if (info.descriptionId == descriptionId) {
                        character.descriptionInfo.splice(character.descriptionInfo.indexOf(info), 1);
                        CharacterServices.updateCharacter(character)
                            .then(() => {
                                return CharacterServices.getAllCharacters();
                            })
                            .then((characters) => this.render(characters));
                    }
                }
            }
        }
        console.log("Info Deleted")
    }

    static render(characters) {
        //Render Character
        this.characters = characters
        $('#app').empty();
        for (let character of characters) {
            $('#app').prepend(
                `<div id=${character.id} class="card">
                    <div class="card-header">
                        <h2>${character.name}</h2>
                        <button class= "btn btn-danger" onclick="DOMManager.deleteCharacter('${character.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <h2> Character Description </h2>
                                    <button class="btn btn-success" id="new-description-button" onclick="DOMManager.addDescriptionInfo('${character.id}')">Add</bitton>
                                </div>
                            <div class="row">
                                <div class="col-sm">
                                    <h4> Gender </h4>
                                    <select type="dropdown" id="${character.id}-gender" class="form control">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    </div>
                                <div class="col-sm">
                                    <h4> Race </h4>
                                    <select type="dropdown" id="${character.id}-race" class="form control">
                                        <option value="Asian">Asian</option>
                                        <option value="Black">Black</option>
                                        <option value="Hispanic">Hispanic</option>
                                        <option value="Mixed">Mixed</option>
                                        <option value="White">White</option>
                                    </select>
                                </div>
                                <div class="col-sm">
                                    <h4> Nationality </h4>
                                    <select type="dropdown" id="${character.id}-nationality" class="form control">
                                        <option value="Australia">Australia</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Belgium">Belgium</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="Cambodia">Cambodia</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Chile">Chile</option>
                                        <option value="China">China</option>
                                        <option value="Dominican Republic">Dominican Republic</option>
                                        <option value="Egypt">Egypt</option>
                                        <option value="France">France</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Greece">Greece</option>
                                        <option value="Gautemala">Guatemala</option>
                                        <option value="Haiti">Haiti</option>
                                        <option value="Hungary">Hungary</option>
                                        <option value="India">India</option>
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Iran">Iran</option>
                                        <option value="Ireland">Ireland</option>
                                        <option value="Italy">Italy</option>
                                        <option value="Jamaica">Jamaica</option>
                                        <option value="Japan">Japan</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Kuwait">Kuwait</option>
                                        <option value="Mexico">Mexico</option>
                                        <option value="Morocco">Morocco</option>
                                        <option value="New Zealand">New Zealand</option>
                                        <option value="Nicaragua">Nicaragua</option>
                                        <option value="North Korea">North Korea</option>
                                        <option value="Norway">Norway</option>
                                        <option value="Philippines">Philippines</option>
                                        <option value="Poland">Poland</option>
                                        <option value="Russia">Russia</option>
                                        <option value="Scotland">Scotland</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="South Korea">South Korea</option>
                                        <option value="Spain">Spain</option>
                                        <option value="Sweden">Sweden</option>
                                        <option value="Switzerland">Switzerland</option>
                                        <option value="Turkey">Turkey</option>
                                        <option value="United Kingdom>United Kingdom</option>
                                        <option value="United States">United States</option>
                                        <option value="Venezuela">Venezuela</option>
                                        <option value="Vietnam">Vietnam</option>
                                    </select>
                                </div>
                                <div class="col-sm">
                                    <h4> Occupation </h4>
                                    <select type="dropdown" id="${character.id}-occupation" class="form control">
                                        <option value="Accountant">Accountant</option>
                                        <option value="Actor">Actor</option>
                                        <option value="Animator">Animator</option>
                                        <option value="Architect">Architect</option>
                                        <option value="Artist">Artist</option>
                                        <option value="Athlete">Athlete</option>
                                        <option value="Astronaut">Astronaut</option>
                                        <option value="Attorney">Attorney</option>
                                        <option value="Barber">Barber</option>
                                        <option value="Bellhop">Bellhop</option>
                                        <option value="Biologist">Biologist</option>
                                        <option value="Blacksmith">Blacksmith</option>
                                        <option value="Butcher">Butcher</option>
                                        <option value="Butler">Butler</option>
                                        <option value="Businessman">Businessman</option>
                                        <option value="Carpenter">Carpenter</option>
                                        <option value="Cashier">Cashier</option>
                                        <option value="Chauffeur">Chauffeur</option>
                                        <option value="Chef">Chef</option>
                                        <option value="Chemist">Chemist</option>
                                        <option value="Composer">Composer</option>
                                        <option value="Criminal">Criminal</option>
                                        <option value="Custodian">Custodian</option>
                                        <option value="Dentist">Dentist</option>
                                        <option value="Designer">Designer</option>
                                        <option value="Detective">Detective</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Driver">Driver</option>
                                        <option value="Ecologist">Ecologist</option>
                                        <option value="Economist">Economist</option>
                                        <option value="Editor">Editor</option>
                                        <option value="Electrician">Electrician</option>
                                        <option value="Engineer">Engineer</option>
                                        <option value="Entertainer">Entertainer</option>
                                        <option value="Farmer">Farmer</option>
                                        <option value="Firefighter">Firefighter</option>
                                        <option value="Fisherman">Fisherman</option>
                                        <option value="Gardener">Gardener</option>
                                        <option value="Geologist">Geologist</option>
                                        <option value="Hunter">Hunter</option>
                                        <option value="Interpreter">Interpreter</option>
                                        <option value="Inventor">Inventor</option>
                                        <option value="Janitor">Janitor</option>
                                        <option value="Journalist">Journalist</option>
                                        <option value="Judge">Judge</option>
                                        <option value="Lumberjack">Lumberjack</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Marketer">Marketer</option>
                                        <option value="Mayor">Mayor</option>
                                        <option value="Miner">Miner</option>
                                        <option value="Musician">Musician</option>
                                        <option value="Nurse">Nurse</option>
                                        <option value="Operator">Operator</option>
                                        <option value="Optician">Optician</option>
                                        <option value="Park Ranger">Park Ranger</option>
                                        <option value="Pawnbroker">Pawnbroker</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="Pharmacist">Pharmacist</option>
                                        <option value="Philanthropist">Philanthropist</option>
                                        <option value="Philosopher">Philosopher</option>
                                        <option value="Physicist">Physicist</option>
                                        <option value="Pilot">Pilot</option>
                                        <option value="Plumber">Plumber</option>
                                        <option value="Police Officer">Police Officer</option>
                                        <option value="Politician">Politician</option>
                                        <option value="Programmer">Programmer</option>
                                        <option value="Rancher">Rancher</option>
                                        <option value="Referee">Referee</option>
                                        <option value="Reporter">Reporter</option>
                                        <option value="Researcher">Researcher</option>
                                        <option value="Sailor">Sailor</option>
                                        <option value="Scientist">Scientist</option>
                                        <option value="Security Guard">Security Guard</option>
                                        <option value="Soldier">Soldier</option>
                                        <option value="Stockbroker">Stockbroker</option>
                                        <option value="Surgeon">Surgeon</option>
                                        <option value="Tailor">Tailor</option>
                                        <option value="Teacher">Teacher</option>
                                        <option value="Translator">Translator</option>
                                        <option value="Writer">Writer</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <h4> Age </h4>
                                    <input type="number" id="${character.id}-age" class="form-control">
                                </div>
                                <div class="col-sm">
                                    <h4> Personality </h4>
                                    <input type="text" id="${character.id}-personality" class="form-control">
                                </div>
                                <div class="col-sm">
                                    <h4> Backstory </h4>
                                    <input type="text" id="${character.id}-backstory" class="form-control">
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                <div class="col-sm">
                                    <h2> Character Weapon </h2>
                                    <button class="btn btn-success" id="new-weapon-button" onclick="DOMManager.addWeaponsInfo('${character.id}')">Add</button>
                                </div>
                                <br>
                                <div class="row">
                                    <div class="col-sm">
                                        <h4> Weapon Name </h4>
                                        <input type="text" id="${character.id}-weapon-name" class="form-control" placeholder="Weapon Name">
                                    </div>
                                    <div class="col-sm">
                                        <h4> Weapon Slot </h4>
                                        <select type="dropdown" id="${character.id}-weapon-slot" class="form control" placeholder="Weapon Slot">
                                            <option value="Primary">Primary</option>
                                            <option value="Secondary">Secondary</option>
                                        </select>
                                    </div>
                                    <div class="col-sm">
                                        <h4> Damage Type </h4>
                                        <select type="dropdown" id="${character.id}-weapon-type" class="form control">
                                            <option value="Hitscan">Hitscan</option>
                                            <option value="Projectile">Projectile</option>
                                            <option value="Melee">Melee</option>
                                            <option value="Utility">Utility</option>
                                        </select>
                                    </div>
                                    <div class="col-sm">
                                        <h4> Clip Type </h4>
                                        <select type="dropdown" id="${character.id}-clip-type" class="form control">
                                            <option value="Standard Clips">Standard Clips</option>
                                            <option value="Continuous Clip">Continuous Clip</option>
                                            <option value="Single Shot">Single Shot</option>
                                            <option value="Unlimited Clips">Unlimited Clips</option>
                                            <option value="Energy Overheat">Energy Overheat</option>
                                        </select>
                                    </div>
                                    <div class="col-sm">
                                        <h4> Special Type </h4>
                                        <select type="dropdown" id="${character.id}-weapon-special" class="form control">
                                            <option value="Ammo Types">Ammo Types</option>
                                            <option value="Alternative Fire">Alternative Fire</option>
                                            <option value="Damage Boosted">Damage Boosted</option>
                                            <option value="Weapon Parts">Weapon Parts</option>
                                            <option value="Weapon Upgrades">Weapon Upgrades</option>
                                        </select>
                                    </div>
                                </div>
                            
                        </div>
                    </div>
                </div><br><br>
                `
            );
            for (let weapon of character.weaponInfo) {
                console.log("Info: ", weapon, " Character.weaponInfo:", character.weaponInfo)
                $(`#${character.id}`).find('.card-body').append(
                    `<p>
                        <span id="info-${weapon.id}"><strong>Weapon: </strong> ${character.weaponInfo}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteWeaponInfo('${character.id}', '${weapon.id}')">Delete Weapon</button>
                        </p>`
                )
            }
            for (let description of character.descriptionInfo) {
                console.log("Info: ", description, " Character.descriptionInfo:", character.descriptionInfo)
                $(`#${character.id}`).find('.card-body').append(
                    `<p>
                        <span id="info-${description.id}"><strong>Description: </strong> ${character.descriptionInfo}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteWeaponInfo('${character.id}', '${description.id}')">Delete Info</button>
                        </p>`
                )
            }
        }
    }
}

$("#create-new-character").click(() => {
    DOMManager.createCharacter($('#new-character-name').val(), )
    $('#new-character-name').val('');
});

//$("#new-description-button").click(() => {
//    DOMManager.addDescriptionInfo
//});

//$("#new-weapon-button").click(() => {
//    DOMManager.addWeaponsInfo
//});

DOMManager.getAllCharacters();