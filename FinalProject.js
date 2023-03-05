class Character {
    constructor(name) {
        this.name = name;

    }
}



class CharacterServices {
    static url = '';

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
                                    
                                </div>
                                <div class="col-sm">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            );
        }
    }
}