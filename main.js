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
vegetablesInput = document.getElementById('demo-add-remove');
let vegetables = new Hints(vegetablesInput, {
    behavior: 'replace',
    hints: {
        'C': ['Cabbage', 'Carrot', 'Cucumber'],
        'O': ['Onion'],
        'P': ['Potato'],
        'T': ['Tomato'],
    }
});

let status = document.createElement('div');
status.setAttribute('role', 'status');

let add = document.createElement('button');
add.innerText = 'Add hint';
add.addEventListener('click', function(event) {
   vegetables.add({'I': ['Item ' + counter++]});
   status.innerText = 'Appended new item: Item ' + (+counter - 1) + '.'
   vegetablesInput.focus();
});

let remove = document.createElement('button');
remove.innerText = 'Remove hint';
remove.addEventListener('click', function(event) {
    vegetables.remove({'I': ['Item ' + counter--]});
    status.innerText = 'Removed item: Item ' + (+counter + 1) + '.'
    vegetablesInput.focus();
})

vegetablesInput.insertAdjacentElement('afterend', add);
add.insertAdjacentElement('afterend', remove);
remove.insertAdjacentElement('afterend', status);


