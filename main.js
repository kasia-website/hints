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