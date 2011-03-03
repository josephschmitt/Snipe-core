var ShortcutField = Class.extend({
    init: function(element, options) {
        options = options || {};

        var self = this,
            field = document.createElement('input'),
            clearBtn = document.createElement('button'),
            revertBtn = document.createElement('button'),
            
            setKey,
            setModifiers,
            
            savedKey,
            savedModifiers;

        self.element = element;

        field.setAttribute('type', 'text');
        
        addClass(element, 'shortcut-field')
        addClass(clearBtn, 'clear');
        addClass(revertBtn, 'revert');

        element.appendChild(field);
        element.appendChild(clearBtn);
        element.appendChild(revertBtn);
        
        exitEditMode();


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
            removeKeyEvents();

            if (setKey) {
                removeClass(element, 'empty');
                
                savedKey = setKey;
                savedModifiers = Array.prototype.slice.call(setModifiers);
                
                if (options.update && hasClass(element, 'edit')) {
                    options.update.apply(null, [savedKey, savedModifiers]);
                }
            }
            else {
                addClass(element, 'empty');
            }
            
            setInstruction('Click to record shortcut');
            removeClass(element, 'edit');
        }

        function addKeyEvents() {
            window.addEventListener('keydown', onKeyDown)
            window.addEventListener('keyup', onKeyUp);
            window.addEventListener('click', onClick);
        }

        function removeKeyEvents() {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp);
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
            
            setCombo(key, modifiers);
        }

        function setCombo(key, modifiers) {
            setModifiers = Array.prototype.slice.call(modifiers);
            setKey = key;

            if (key) {
                exitEditMode();
            }
        }
        
        
// PRIVILEGED METHODS _________________________________________________________
        
        self.set = function(key, modifiers) {
            updateField(key, modifiers);
        };


// EVENT SUBSCRIPTIONS ________________________________________________________

        //Events
        field.addEventListener('focus', function(e) {
            enterEditMode();
            field.blur();
        });
        
        clearBtn.addEventListener('click', function(e) {
            field.value = '';
            setKey = null;
            
            exitEditMode();
        });
        
        revertBtn.addEventListener('mouseover', function(e) {
            setInstruction('Use old shortcut');
        });
        
        revertBtn.addEventListener('mouseout', function(e) {
            setInstruction('Type shortcut');
        });
        
        revertBtn.addEventListener('click', function(e) {
            updateField(savedKey, Array.prototype.slice.call(savedModifiers))
        });


// EVENT HANDLERS _____________________________________________________________

        function onKeyDown(e) {
            if (e.keyCode == KEY_ESC) {
                return exitEditMode();
            }
            
            parseKeys(e.keyCode, e);
        }

        function onKeyUp(e) {
            if (setKey) {
                return exitEditMode();
            }
            
            parseKeys(e.keyCode, e);
        }
        
        function onClick(e) {
            if (!hasAncestor(e.target, element)) {
                exitEditMode();
            }
        }
    }
});