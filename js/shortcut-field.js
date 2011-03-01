var ShortcutField = Class.extend({
    init: function(element, options) {
        options = options || {};
        
        var self = this,
            field = document.createElement('input'),
            clearBtn = document.createElement('button'),
            revertBtn = document.createElement('button'),

            savedModifiers,
            savedKey;

        self.element = element;

        field.setAttribute('type', 'text');
        field.setAttribute('placeholder', 'Click to record shortcut');

        addClass(clearBtn, 'clear');
        addClass(revertBtn, 'revert');

        element.appendChild(field);
        element.appendChild(clearBtn);
        element.appendChild(revertBtn);

        //Events
        field.addEventListener('focus', enterEditMode);

        function enterEditMode() {
            //Clear the field
            field.value = '';
            
            addKeyEvents();
            addClass(element, 'edit');
        }

        function exitEditMode() {
            removeKeyEvents();
            
            removeClass(element, 'edit');
            
            if (savedKey) {
                if (options.update) {
                    options.update.apply(null, []);
                }
            }
            
            field.blur();
        }

        function addKeyEvents() {
            field.addEventListener('keydown', onKeyDown)
            field.addEventListener('keyup', onKeyUp);
            field.addEventListener('blur', exitEditMode);
        }

        function removeKeyEvents() {
            field.removeEventListener('keydown', onKeyDown)
            field.removeEventListener('keyup', onKeyUp);
            field.removeEventListener('blur', exitEditMode);
        }

        function onKeyDown(e) {
            parseKeys(e.keyCode, e);
        }

        function onKeyUp(e) {
            // field.blur();
            if (savedKey) {
                exitEditMode();
            }
            else {
                parseKeys(e.keyCode, e);
            }
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
                if (savedModifiers.indexOf(keyName) > -1) {
                    modifiers.splice(savedModifiers.indexOf(keyName), 1);
                }
            }

            if (keyName && keyCode !== KEY_SHIFT && keyCode !== KEY_CTRL && keyCode !== KEY_ALT) {
                key = KEYMAP[keyCode];
            }

            updateField(key, modifiers);
            saveCombo(key, modifiers, e);
            
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

        function saveCombo(key, modifiers) {
            // console.log('saveCombo', key);
            savedModifiers = Array.prototype.slice.call(modifiers);
            savedKey = key;
            
            if (key) {
                exitEditMode();
            }
        }
    }
});