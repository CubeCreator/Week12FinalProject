class Weapons{
    constructor(weaponName, weaponSlot, damageType, specialType, weaponTags){
        this.weaponName = weaponName;
        this.weaponSlot = weaponSlot;
        this.damageType = damageType;
        this.specialType = specialType;
        this.weaponTags = weaponTags;

    }
}

class Character {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.info = [];
    }

    addWeaponsInfo(weaponName, weaponSlot, damageType, specialType, weaponTags) {
        this.info.push(new Weapons(weaponName, weaponSlot, damageType, specialType, weaponTags))
    }

    addDescriptionInfo(name, gender, race, nationality, occupation, age, personality, backstory) {
        this.info.push(new Description(name, gender, race, nationality, occupation, age, personality, backstory));
    }
}

class Description {
    constructor(gender, race, nationality, occupation, age, personality, backstory){
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
            url: this.url + `/${character._id}`,
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

    static getAllCharacters() {
        CharacterServices.getAllCharacters().then(characters => this.render(characters))
    }

    static createCharacter(name) {
        CharacterServices.createCharacter(new Character(name))
            .then(() => {
                return CharacterServices.getAllCharacters();
            })
            .then((characters) => this.render(characters));
    }

    static deleteCharacter(id){
        CharacterServices.deleteCharacter(id)
            .then(() => {
                return CharacterServices.getAllCharacters();
            })
            .then((characters) => this.render(characters));
    }

    static addWeaponsInfo(id){
        for (let character of this.characters) {
            if(character._id == id) {
                character.info.push(new Weapons($(`#${character._id}-weapon-name`).val(), $(`#${character._id}-weapon-slot`).val(), $(`#${character._id}-weapon-type`).val(), $(`#${character._id}-weapon-special`).val()));
                CharacterServices.updateCharacter(character)
                    .then(() => {
                        return CharacterServices.getAllCharacters();
                    })
                    .then((characters) => this.render(characters))
            }
        }
    }

    static addDescriptionInfo(id){
        for (let character of this.characters) {
            if(character._id == id) {
                character.info.push(new Description())
                Character.updateCharacter(character)
                    .then(() => {
                        return CharacterServices.getAllCharacters();
                    })
                    .then((characters) => this.render(characters))
            }
        }
    }

    static deleteInfo(characterId, infoId) {
        for(let character of this.characters) {
            if(character._id == characterId) {
                for (let information of character.info) {
                    if (info._id == infoId) {
                        character.info.splice(character.info.indexOf(information), 1);
                        CharacterServices.updateCharacter(character)
                            .then(() => {
                                return CharacterServices.getAllCharacters();
                            })
                            .then((characters) => this.render(characters));
                    }
                }
            }
        }
    }

    static render(characters) {
        this.characters = characters
        $('#app').empty();
        for (let character of characters) {
            $('#app').prepend(
                `<div id=${character._id} class="card">
                    <div class="card-header">
                        <h2>${character.name}</h2>
                        <button class= "btn btn-danger" onclick="DOMManager.deleteCharacter('${character.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <h2> Character Description </h2>
                                    <button class="btn btn-success" onclick="DOMManager.addDescriptionInfo('${character.id}')">Add</bitton>
                                </div>
                                
                                <div class="row">
                                    <div class="col-sm">
                                        <select type="dropdown" id="${character._id}-gender" class="form control">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div class="col-sm">

                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                <div class="col-sm">
                                    <h2> Character Weapon </h2>
                                    <button class="btn btn-success" onclick="DOMManager.addWeaponsInfo('${character.id}')">Add</button>
                                </div>
                                <br>
                                <div class="row">
                                    <div class="col-sm">
                                        <input type="text" id="${character._id}-weapon-name" class="form-control" placeholder="Weapon Name">
                                    </div>
                                    <div class="col-sm">
                                        <select type="dropdown" id="${character._id}-weapon-slot" class="form control" placeholder="Weapon Slot">
                                            <option value="Primary">Primary</option>
                                            <option value="Secondary">Secondary</option>
                                        </select>
                                    </div>
                                    <div class="col-sm">
                                        <select type="dropdown" id="${character._id}-weapon-type" class="form control" placeholder="Damage Type">
                                            <option value="Hitscan">Hitscan</option>
                                            <option value="Projectile">Projectile</option>
                                            <option value="Melee">Melee</option>
                                            <option value="Utility">Utility</option>
                                        </select>
                                    </div>
                                    <div class="col-sm">
                                        <select type="dropdown" id="${character._id}-weapon-special" class="form control" placeholder="Special Type">
                                            <option value="Ammo Types">Ammo Types</option>
                                            <option value="Alternative Fire">Alternative Fire</option>
                                            <option value="Damage Boosted">Damage Boosted</option>
                                            <option value="Weapon Upgrades">Weapon Upgrades</option>
                                        </select>
                                    </div>
                                </div>
                            
                        </div>
                    </div>
                </div><br><br>
                `
            );
            for (let information of character.info) {
                $(`#${character._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${information._id}"><strong>Name: </strong> ${information.name}</span>
                        <span id="info-${information._id}"><strong>Info: </strong> ${information.info},/span>
                        <button class="btn btn-danger> onclick="DOMManager.deleteInfo('${character._id}', '${information._id}')">Delete Info</button>
                        </p>`
                )
            }
        }
    }
}

$("#create-new-character").click(() => {
    DOMManager.createCharacter($('#new-character-name').val())
    $('#new-character-name').val('');
});


DOMManager.getAllCharacters();