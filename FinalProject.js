class Character {
    constructor(name) {
        this.name = name;

    }
}

class Description {
    constructor(name, gender, race, nationality, occupation, age, personality, backstory){
        this.name = name;
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

    static render(characters) {
        this.characters = characters
        $('#app').empty();
        for (let character of characters) {
            $('#app').prepend(
                `<div id=${character._id} class="card">
                    <div class="card-header">
                        <h2>${character.name}</h2>
                        <button class= "btn btn-danger" onclick="DOMManager.deleteCharacter('${character._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <h2> Character Weapon </h2>
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${character._id}-weapon-name" class="form-control" placeholder="Weapon Name">
                                </div>
                                <div class="col-sm">
                                    <input type="dropdown" id="${character._id}-weapon-slot" class="form control">
                                </div>
                                <div class="col-sm">
                                    <input type="dropdown" id="${character._id}-weapon-type" class="form control">
                                </div>
                                <div class="col-sm">
                                    <input type="dropdown" id="${character._id}-weapon-special" class="form control">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <h2> Character Description </h2>
                                </div>
                                <div class="col-sm">
                                    <input>
                                </div>
                                <div class="col-sm">
                                    <input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><br>
                `
            );
            for (let information of character.info) {
                $(`#${character._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${character._id}"><strong>Name: </strong> ${character.name}</span>
                        <span id="info-${character._id}"><strong>Area: </strong> ${character.info},/span>
                        <button class="btn btn-danger> onclick="DOMManager.deleteInfo('${character._id}', '${info._id})`
                )
            }
        }
    }
}