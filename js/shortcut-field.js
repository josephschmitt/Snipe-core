var ShortcutField = Class.extend({
    init: function(element, options) {
        options = options || {};

        var self = this,
            field = document.createElement('input'),
            clearBtn = document.createElement('button'),
            revertBtn = document.createElement('button'),

            setModifiers,
            setKey;

        self.element = element;

        field.setAttribute('type', 'text');

        addClass(clearBtn, 'clear');
        addClass(revertBtn, 'revert');

        element.appendChild(field);
        element.appendChild(clearBtn);
        element.appendChild(revertBtn);
        
        setInstruction('Click to record shortcut');


// PRIVATE METHODS ____________________________________________________________

        function enterEditMode() {
            if (hasClass(element, 'edit')) {
                return false;
            }
            
            //Clear the field
            field.value = '';

            addKeyEvents();
            addClass(element, 'edit');
            
            setInstruction('Type shortcut');
        }
        
        function exitEditMode() {
            if (!hasClass(element, 'edit')) {
                return false;
            }
            
            removeKeyEvents();
            removeClass(element, 'edit');

            if (setKey) {
                if (options.update) {
                    options.update.apply(null, []);
                }
            }
            
            setInstruction('Click to record shortcut');
        }

        function addKeyEvents() {
            window.addEventListener('keydown', onKeyDown)
            window.addEventListener('keyup', onKeyUp);
            window.addEventListener('click', onClick);
            // field.addEventListener('blur', exitEditMode);
        }

        function removeKeyEvents() {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp);
            // field.removeEventListener('blur', exitEditMode);
        }
        
        function setInstruction(text) {
            field.setAttribute('placeholder', text);
        }
        
        function parseKeys(keyCode, e) {
            //Get modifier keys
            var modifiers = [],
                keyName = KEYMAP[keyCode],
                key;

            if (e.shiftKey || keyCode == KEY_SHIFT) {
                modifiers.push(KEYMAP[KEY_SHIFT]);
            }
            if (e.ctrlKey || keyCode == KEY_CTRL) {
                modifiers.push(KEYMAP[KEY_CTRL]);
            }
            if (e.altKey || keyCode == KEY_ALT) {
                modifiers.push(KEYMAP[KEY_ALT]);
            }

            if (e.type == 'keyup') {
                //If the modifier key was released, remove it
                if (setModifiers.indexOf(keyName) > -1) {
                    modifiers.splice(setModifiers.indexOf(keyName), 1);
                }
            }

            if (keyName && keyCode !== KEY_SHIFT && keyCode !== KEY_CTRL && keyCode !== KEY_ALT) {
                key = KEYMAP[keyCode];
            }

            updateField(key, modifiers);
            setCombo(key, modifiers, e);

            e.preventDefault();
        }

        function updateField(key, modifiers) {
            var text = '';

            modifiers.forEach(function(modifier) {
                text += modifier.name + ' ';
            });

            if (key) {
                text += key.name;
            }

            field.value = text;
        }

        function setCombo(key, modifiers) {
            setModifiers = Array.prototype.slice.call(modifiers);
            setKey = key;

            if (key) {
                exitEditMode();
            }
        }
        
        function saveCombo(key, modifiers) {
            
        }


// EVENT SUBSCRIPTIONS ________________________________________________________

        //Events
        field.addEventListener('focus', function(e) {
            enterEditMode();
            field.blur();
        });
        clearBtn.addEventListener('click', function(e) {
            enterEditMode();
        });
        revertBtn.addEventListener('mouseover', function(e) {
            setInstruction('Use old shortcut');
        });
        revertBtn.addEventListener('mouseout', function(e) {
            setInstruction('Type shortcut');
        });


// EVENT HANDLERS _____________________________________________________________

        function onKeyDown(e) {
            if (e.keyCode == KEY_ESC) {
                return exitEditMode();
            }
            
            parseKeys(e.keyCode, e);
        }

        function onKeyUp(e) {
            // field.blur();
            if (setKey) {
                exitEditMode();
            }
            else {
                parseKeys(e.keyCode, e);
            }
        }
        
        function onClick(e) {
            if (!hasAncestor(e.target, element)) {
                exitEditMode();
            }
        }
    }
});