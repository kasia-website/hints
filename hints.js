function getTextBoundingRect(input, selectionStart, selectionEnd, debug) {
    // Basic parameter validation
    if(!input || !('value' in input)) return input;
    if(typeof selectionStart == "string") selectionStart = parseFloat(selectionStart);
    if(typeof selectionStart != "number" || isNaN(selectionStart)) {
        selectionStart = 0;
    }
    if(selectionStart < 0) selectionStart = 0;
    else selectionStart = Math.min(input.value.length, selectionStart);
    if(typeof selectionEnd == "string") selectionEnd = parseFloat(selectionEnd);
    if(typeof selectionEnd != "number" || isNaN(selectionEnd) || selectionEnd < selectionStart) {
        selectionEnd = selectionStart;
    }
    if (selectionEnd < 0) selectionEnd = 0;
    else selectionEnd = Math.min(input.value.length, selectionEnd);

    // If available (thus IE), use the createTextRange method
    if (typeof input.createTextRange == "function") {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveStart('character', selectionStart);
        range.moveEnd('character', selectionEnd - selectionStart);
        return range.getBoundingClientRect();
    }
    // createTextRange is not supported, create a fake text range
    var offset = getInputOffset(),
        topPos = offset.top,
        leftPos = offset.left,
        width = getInputCSS('width', true),
        height = getInputCSS('height', true);

    // Styles to simulate a node in an input field
    var cssDefaultStyles = "white-space:pre;padding:0;margin:0;",
        listOfModifiers = ['direction', 'font-family', 'font-size', 'font-size-adjust', 'font-variant', 'font-weight', 'font-style', 'letter-spacing', 'line-height', 'text-align', 'text-indent', 'text-transform', 'word-wrap', 'word-spacing'];

    topPos += getInputCSS('padding-top', true);
    topPos += getInputCSS('border-top-width', true);
    leftPos += getInputCSS('padding-left', true);
    leftPos += getInputCSS('border-left-width', true);
    leftPos += 1; //Seems to be necessary

    for (var i=0; i<listOfModifiers.length; i++) {
        var property = listOfModifiers[i];
        cssDefaultStyles += property + ':' + getInputCSS(property) +';';
    }
    // End of CSS variable checks

    var text = input.value,
        textLen = text.length,
        fakeClone = document.createElement("div");
    if(selectionStart > 0) appendPart(0, selectionStart);
    var fakeRange = appendPart(selectionStart, selectionEnd);
    if(textLen > selectionEnd) appendPart(selectionEnd, textLen);

    // Styles to inherit the font styles of the element
    fakeClone.style.cssText = cssDefaultStyles;

    // Styles to position the text node at the desired position
    fakeClone.style.position = "absolute";
    fakeClone.style.top = topPos + "px";
    fakeClone.style.left = leftPos + "px";
    fakeClone.style.width = width + "px";
    fakeClone.style.height = height + "px";
    document.body.appendChild(fakeClone);
    var returnValue = fakeRange.getBoundingClientRect(); //Get rect

    if (!debug) fakeClone.parentNode.removeChild(fakeClone); //Remove temp
    return returnValue;

    // Local functions for readability of the previous code
    function appendPart(start, end){
        var span = document.createElement("span");
        span.style.cssText = cssDefaultStyles; //Force styles to prevent unexpected results
        span.textContent = text.substring(start, end);
        fakeClone.appendChild(span);
        return span;
    }
    // Computing offset position
    function getInputOffset(){
        var body = document.body,
            win = document.defaultView,
            docElem = document.documentElement,
            box = document.createElement('div');
        box.style.paddingLeft = box.style.width = "1px";
        body.appendChild(box);
        var isBoxModel = box.offsetWidth == 2;
        body.removeChild(box);
        box = input.getBoundingClientRect();
        var clientTop  = docElem.clientTop  || body.clientTop  || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            scrollTop  = win.pageYOffset || isBoxModel && docElem.scrollTop  || body.scrollTop,
            scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;
        return {
            top : box.top  + scrollTop  - clientTop,
            left: box.left + scrollLeft - clientLeft};
    }
    function getInputCSS(prop, isnumber){
        var val = document.defaultView.getComputedStyle(input, null).getPropertyValue(prop);
        return isnumber ? parseFloat(val) : val;
    }
}

let Hints = (function() {
    function Hints(element, settings) {
        let _ = this;

        _.defaults = {
            anyPosition: false,
            automaticSelection: false,
            automaticSelectionConfirm: [' '],
            behavior: 'append',
            caseSensitive: true,
            emphasize: true,
            focusOnOpen: false,
            inlineAutocomplete: false,
            hints: ['aaaa', 'bac', 'baac', 'd'],
            trigger: '_',
            triggerLength: 1,
            version: '1.0'
        }

        if (!settings || !settings instanceof Object) {
            settings = {}
        }

        _.options = {
            ..._.defaults,
            ...settings
        };

        if (!!settings) {
            if (settings.hasOwnProperty('hints') && !Array.isArray(settings.hints)) {
                _.options.trigger = Object.getOwnPropertyNames(settings.hints).join('');
            }

            if (settings.hasOwnProperty('noTrigger')) {
                _.options.trigger = '';
                _.options.triggerLength = 0;
            }

            if (settings.hasOwnProperty('automaticSelection')) {
                _.options.focusOnOpen = true;
            }

            if (settings.hasOwnProperty('inlineAutocomplete')) {
                _.options.focusOnOpen = true;
                _.options.automaticSelectionConfirm = [39];
            }

            if (settings.hasOwnProperty('version')) {
                if (settings.version === '1.1') {
                    _.options.version = settings.version;
                }
            }
        }

        _.focusedHint   = false;
        _.hintContainer = null;
        _.hintList      = null;
        _.hints         = _.options.hints;
        _.hintsVisible  = false;
        _.matchLength   = 0;
        _.source        = element instanceof HTMLElement ? element : document.querySelector(element);

        _.init();
    }

    return Hints;
}());

Hints.prototype.add = function(hint) {
    let _ = this;

    //single hint
    if (typeof hint === 'string') {
        _.hints.push(hint);
    }

    //multiple hints
    if (hint instanceof Array) {
        _.hints = {
            ..._.hints,
            ...hint
        }
    }

    if (hint instanceof Object && _.hints instanceof Object) {
        for (let hintKey in hint) {
            if (_.hints.hasOwnProperty(hintKey)) {
                _.hints[hintKey] = {
                    ..._.hints[hintKey],
                    ...hint[hintKey]
                }
            } else {
                _.hints[hintKey] = hint[hintKey];
            }
        }
    }

}

Hints.prototype.buildHintContainer = function() {
    let _ = this, container;

    container = document.createElement('div');
    container.setAttribute('id', _.generateId());
    container.classList.add('hints-container');

    document.body.appendChild(container);
    _.hintContainer = container;

}

Hints.prototype.buildHintList = function() {
    let _ = this, list;

    if (!_.hintContainer) {
        return;
    }

    list = document.createElement('ul');
    list.setAttribute('role', 'listbox');
    _.hintContainer.appendChild(list);
    _.hintList = list;
}

Hints.prototype.buildHintListContent = function() {
    let _ = this, newHints;

    _.emptyHintList();
    newHints = _.getHints();

    for (let i = 0; i < newHints.length; i++) {
        let hint = document.createElement('li');
        hint.innerHTML = newHints[i];
        hint.setAttribute('id', _.generateId());
        hint.setAttribute('role', 'option');
        _.hintList.appendChild(hint);
    }

    return newHints.length;
}

Hints.prototype.emphasize = function(item, index, arr) {
    let _ = this;

    arr[index] = item.replace(_.getSuffix(), '<em>' + _.getSuffix() + '</em>');
}

Hints.prototype.emptyHintList = function() {
    let _ = this;

    if (!!_.hintList && _.hintList.childElementCount > 0) {
        while (_.hintList.firstChild) {
            _.hintList.removeChild(_.hintList.lastChild);
        }
    }
}

Hints.prototype.filter = function(hint) {
    let _ = this;

    if (_.options.anyPosition) {
        return hint.indexOf(_.getSuffix()) > -1;
    }

    return hint.indexOf(_.getSuffix()) === 0;
}

Hints.prototype.generateId = function() {
    let id               = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < 10; i++ ) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
}

Hints.prototype.getHints = function() {
    let _ = this, hints;

    hints = _.options.hints;

    if (_.options.hints instanceof Object) {
        if (_.options.hints.hasOwnProperty(_.lastCharacter())) {
            hints = _.options.hints[_.lastCharacter()]; //show for specific trigger
        } else {
            hints = [].concat.apply([], Object.values(_.options.hints)); //show all
        }
    }

    if (_.getSuffix().length > 0) {
        hints = hints.filter(_.filter, _);
    }

    if (_.getSuffix().length > 0 && _.options.emphasize) {
        hints.forEach(_.emphasize, _);
    }

    return hints;
}

Hints.prototype.getNextHintIndex = function() {
    let _ = this, index;

    index = Array.prototype.indexOf.call(_.hintList.children, _.focusedHint);
    return (index - 1 + _.hintList.childElementCount) % _.hintList.childElementCount;
}

Hints.prototype.getPreviousHintIndex = function() {
    let _ = this, index;

    index = Array.prototype.indexOf.call(_.hintList.children, _.focusedHint);
    return (index + 1 + _.hintList.childElementCount) % _.hintList.childElementCount;
}

Hints.prototype.getSuffix = function() {
    let _ = this, end, length;

    end = _.source.selectionEnd;
    length = _.matchLength;

    if (length === 0 && _.options.behavior === "replace") {
        _.matchLength = _.options.triggerLength;
    }

    return _.source.value.substr(
        end - length,
        _.length
    );
}

Hints.prototype.handleClick = function(event) {
    let _ = this;

    if (event.target.closest('li') && _.hintContainer.contains(event.target)) {
        _.focusedHint = event.target;
        _.insertHint();
    } else if (_.options.automaticSelection) {
        _.insertHint();
    }

    _.hideHints();
}

Hints.prototype.handleFocusOut = function(event) {
    let _ = this;

    if (_.options.automaticSelection) {
        _.insertHint();
    }

    _.resetMatchLength();
}

Hints.prototype.handleInput = function(event) {
    let _ = this;

    if (_.match()) {
        _.showHints();
    } else {
        _.resetMatchLength();
        _.hideHints();
    }
}

Hints.prototype.handleKeyDown = function(event) {
    let _ = this;

    const
        BACK  = 8,
        TAB   = 9,
        ENTER = 13,
        ESC   = 27,
        SPACE = 32,
        END   = 35,
        HOME  = 36,
        LEFT  = 37,
        UP    = 38,
        RIGHT = 39,
        DOWN  = 40,
        DEL   = 46;

    if (event.which === BACK) {
        if (_.source.selectionStart !== _.source.selectionEnd) {
            event.preventDefault();
            _.source.value = _.source.value.substring(0, _.source.selectionStart);
        } else if (_.matchLength > 0) {
            _.matchLength--;
        }
    }

    if (event.which === DEL && _.source.selectionStart !== _.source.selectionEnd) {
        _.source.value = _.source.substring(0, _.source.selectionStart) + _.source.substring(_.source.selectionEnd, _.source.value.length - 1);
    }

    //force show on Ctrl + Space
    if (event.ctrlKey && event.which === SPACE) {
        //TODO handle suffix on replace behavior
        _.resetMatchLength();
        _.showHints();
        return;
    }

    if (_.isPrintable(event.which)) {
        _.matchLength++;
    }

    if (!_.hintContainer || !_.hintsVisible) {
        return;
    }

    if (_.options.automaticSelectionConfirm.indexOf(event.which) > -1 ) {
        _.insertHint();
        _.hideHints();
        return;
    }

    switch (event.which) {
        case TAB:
            _.hideHints();
            break;
        case ENTER:
            event.preventDefault();
            _.insertHint();
            _.hideHints();
            break;
        case ESC:
            event.preventDefault();
            _.source.setSelectionRange(_.source.value.length, _.source.value.length);
            _.hideHints();
            break;
        case UP: //TODO force open
            event.preventDefault();
            if (_.focusedHint) {
                let index = _.getNextHintIndex();
                _.visuallyUnfocus(_.focusedHint);
                _.focusedHint = _.hintList.children.item(index);
            } else {
                _.focusedHint = _.hintList.lastElementChild;
            }
            _.visuallyFocus(_.focusedHint);
            break;
        case DOWN: //TODO force open
            event.preventDefault();
            if (_.focusedHint) {
                let index = _.getPreviousHintIndex();
                _.visuallyUnfocus(_.focusedHint);
                _.focusedHint = _.hintList.children.item(index);
            } else {
                _.focusedHint = _.hintList.firstElementChild;
            }
            _.visuallyFocus(_.focusedHint);
            break;
        default:
            break;
    }
}

Hints.prototype.handleScroll = function(event) {
    let _ = this, top;

    if  (!_.hintsVisible) {
        return;
    }

    top = _.hintContainer.style.getPropertyValue('--top');
    if (_.hintContainer.hasAttribute('data-y-offset')) {
        top -= window.pageYOffset - _.hintContainer.getAttribute('data-y-offset');
    }

    _.hintContainer.setAttribute('data-y-offset', window.pageYOffset);
    _.hintContainer.style.setProperty('--top', top);
}

Hints.prototype.hasHint = function(hint) {
    let _ = this;

    if (Array.isArray(_.hints)) {
        return _.hints.indexOf(hint) > -1;
    }

    if (_.hints instanceof Object) {
        let result = false;
        for(let hintKey in _.hints) {
            if (_.hints[hintKey].indexOf(hint) > -1) {
                return true;
            }
        }
    }

    return false;
}

Hints.prototype.hideHints = function() {
    let _ = this;

    if (!_.hintContainer) {
        return;
    }

    _.hintContainer.style.setProperty('display', 'none');
    _.source.setAttribute('aria-expanded', 'false');
    _.source.removeAttribute('aria-activedescendant');
    _.hintsVisible = false;
    if (!!_.focusedHint) {
        _.visuallyUnfocus(_.focusedHint);
    }
    _.focusedHint = false;

    _.source.dispatchEvent(new Event('hintshidden'));
}

Hints.prototype.init = function() {
    let _ = this;

    if (!_.source.classList.contains('hints-initialized')) {
        _.buildHintContainer();
        _.setupSourceElement();
        _.hideHints();
        _.buildHintList();
        _.resetMatchLength();
        _.initializeEvents();

        _.source.dispatchEvent(new Event('hintsinitialized'));
    }
}

Hints.prototype.initializeEvents = function() {
    let _ = this;

    _.source.addEventListener('focusout', _.handleFocusOut.bind(_));

    _.source.addEventListener('input', _.handleInput.bind(_));

    _.source.addEventListener('keydown', _.handleKeyDown.bind(_));

    document.addEventListener('click', _.handleClick.bind(_));

    window.addEventListener('scroll', _.handleScroll.bind(_));
}

Hints.prototype.insertHint = function() {
    let _ = this, end, value, insert;

    if (!_.focusedHint) {
        return;
    }

    end = _.source.selectionEnd;
    value = _.source.value;
    insert = _.focusedHint.textContent.substring(_.matchLength);

    if (_.options.inlineAutocomplete) {
        _.source.setSelectionRange(end, end, "forward");
    } else {
        _.source.value = value.substring(0, end) + insert + value.substring(end);
        _.source.selectionEnd = end + insert.length;
    }

    _.resetMatchLength();
}

Hints.prototype.isPrintable = function(keycode) {
    let valid =
        (keycode > 47 && keycode < 58)   || // number keys
        keycode === 32 || //keycode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
}

Hints.prototype.lastCharacter = function() {
    let _ = this, start;

    start = _.source.selectionEnd;

    if (_.matchLength > 0) {
        start -= _.matchLength;
    }

    if (_.matchLength === 0 || _.options.behavior === "append") {
        start -= _.options.triggerLength;
    }

    if (start < 0) {
        start = 0;
    }

    return _.source.value.substr(
        start,
        _.options.triggerLength
    );
}

Hints.prototype.match = function() {
    let _ = this, regex;

    if (_.options.trigger === '' || _.options.triggerLength === 0) {
        return true;
    }

    regex = new RegExp('[' + _.options.trigger + ']');
    return regex.test(_.lastCharacter());
}

Hints.prototype.positionHintBox = function() {
    let _ = this, rect, selection, top;

    if (!_.hintContainer) {
        return;
    }

    selection = _.source.selectionEnd;
    rect = getTextBoundingRect(_.source, selection);
    _.hintContainer.setAttribute('data-y-offset', window.pageYOffset);
    _.hintContainer.style.setProperty('--top', rect.top + 16);
    _.hintContainer.style.setProperty('left', +(rect.left) + 'px');

}

Hints.prototype.removeAll = function() {
    let _ = this;

    _.hints = [];
}

Hints.prototype.remove = function(hint) {
    let _ = this;

    if (typeof hint == 'string' && _.hints.indexOf(hint) > -1) {
        _.hints.splice(_.hints.indexOf(hint), 1);
    }

    if (Array.isArray(hint)) {
        hint.forEach(function(hint) {
            if (_.hints.indexOf(hint) > -1) {
                _.hints.splice(_.hints.indexOf(hint), 1);
            }
        });
    }

    if (hint instanceof Object) {
        for(let hintKey in hint) {
            if (_.hints.hasOwnProperty(hintKey)) {
                hint[hintKey].forEach(function(hint) {
                    if (_.hints[hintKey].indexOf(hint) > -1) {
                        _.hints[hintKey].splice(_.hints[hintKey].indexOf(hint), 1);
                    }
                });
            }
        }
    }

}

Hints.prototype.replaceHint = function(remove, insert) {
    let _ = this;

    if (!remove) {
        _.add(insert);
    }

    if (!insert) {
        _.remove(remove);
    }

    if (typeof remove == 'string' && _.hints.indexOf(remove) > -1) {
        if (typeof insert == 'string') {
            _.hints.splice(_.hints.indexOf(remove), 1, insert);
        }

        if (Array.isArray(insert)) {
            let index = _.hints.indexOf(remove);
            _.hints.splice(_.hints.indexOf(remove), 1);

            insert.forEach(function(item) {
                _.hints.splice(index, 0, item);
            });
        }
    }

}

Hints.prototype.resetMatchLength = function() {
    let _ = this;

    _.matchLength = 0;
}

Hints.prototype.setupSourceElement = function() {
    let _ = this;

    _.source.classList.add('hints-initialized');
    _.source.setAttribute('role', 'combobox');
    _.source.setAttribute('aria-haspopup', 'listbox');
    _.source.setAttribute('aria-expanded', 'false');
    _.source.setAttribute('aria-autocomplete', 'list');
    _.source.setAttribute('aria-owns', _.hintContainer.getAttribute('id'));
    _.source.setAttribute('autocomplete', 'off');
}

Hints.prototype.showHints = function() {
    let _ = this, count;

    if (!_.hintContainer) {
        return;
    }

    count = _.buildHintListContent();

    if (count === 0) {
        _.hideHints();
        return;
    }

    _.hintContainer.style.removeProperty('display');
    _.positionHintBox();

    if (_.options.focusOnOpen) {
        _.focusedHint = _.hintList.firstElementChild;
        _.visuallyFocus(_.focusedHint);
    }

    _.hintsVisible = true;

    _.source.dispatchEvent(new Event('hintsvisible'));
}

Hints.prototype.visuallyFocus = function(element) {
    let _ = this, start, end;

    element.classList.add('focus');
    element.setAttribute('aria-selected', 'true');
    _.source.setAttribute('aria-activedescendant', element.getAttribute('id'));

    if (_.options.inlineAutocomplete) {
        if (_.source.selectionStart !== _.source.selectionEnd) {
            _.source.value = _.source.value.substring(0, _.source.selectionStart);
        }

        start = _.source.selectionStart;
        end = start + _.focusedHint.innerText.length - _.matchLength;

        _.source.value += _.focusedHint.innerText.substring(_.matchLength);
        _.source.setSelectionRange(start, end, "forward");

    }

    _.source.dispatchEvent(new Event('hintsfocus'));
}

Hints.prototype.visuallyUnfocus = function(element) {
    let _ = this;

    element.classList.remove('focus');
    element.removeAttribute('aria-selected');
    _.source.removeAttribute('aria-activedescendant');

    _.source.dispatchEvent(new Event('hintsunfocus'));
}
