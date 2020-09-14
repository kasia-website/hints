new Hints('#demo-simple', {
    hints:  ['ä', 'ö', 'ü', 'ß']
});

new Hints('#demo-triggers', {
    behavior: 'replace',
    hints: {
        'B': ['Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen'],
        'H': ['Hamburg', 'Hessen'],
        'M': ['Mecklenburg-Vorpommern'],
        'N': ['Niedersachsen', 'Nordrhein-Westfalen'],
        'R': ['Rheinland-Pfalz'],
        'S': ['Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein'],
        'T': ['Thüringen']
    }
});

new Hints('#demo-inline-autocomplete', {
    behavior: 'replace',
    hints: {
        'B': ['Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen'],
        'H': ['Hamburg', 'Hessen'],
        'M': ['Mecklenburg-Vorpommern'],
        'N': ['Niedersachsen', 'Nordrhein-Westfalen'],
        'R': ['Rheinland-Pfalz'],
        'S': ['Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein'],
        'T': ['Thüringen']
    },
    inlineAutocomplete: true,
});

counter = 0;
addRemoveInput = document.getElementById('demo-add-remove');
let addRemove = new Hints(addRemoveInput, {
    trigger: 'I'
});

let status = document.createElement('div');
status.setAttribute('role', 'status');

let add = document.createElement('button');
add.innerText = 'Add hint';
add.addEventListener('click', function(event) {
   addRemove.add('Item ' + ++counter);

    let text = 'Appended new item: Item ' + counter + '.\n Available hints: ';
        text += addRemove.hints.join();
        text += '.';

    status.innerText = text;
    addRemoveInput.focus();
});

let remove = document.createElement('button');
remove.innerText = 'Remove hint';
remove.addEventListener('click', function(event) {
    addRemove.remove('Item ' + counter);

    let text = 'Removed item: Item ' + counter-- + '.\n Available hints: ';
        text += addRemove.hints.join();
        text += '.';

    status.innerText = text;
    addRemoveInput.focus();
})

addRemoveInput.parentElement.insertAdjacentElement('afterend', add);
add.insertAdjacentElement('afterend', remove);
remove.insertAdjacentElement('afterend', status);


