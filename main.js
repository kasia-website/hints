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

new Hints('#demo-append', {
    behavior: 'replace',
    focusOnOpen: true,
    inlineAutocomplete: true,
    hints: {
        'a': ['align-content', 'align-items', 'align-self'],
        'b': ['background', 'border', 'bottom', 'box-shadow', 'box-sizing'],
        'c': ['color', 'content', 'cursor'],
        'd': ['display'],
        'f': ['font-size', 'font-family', 'font-weight']
    }
});