Snipe.Settings = Class.extend({
    /**
     * Init method
     * @param options (Object) - Options for the method.
     *  Eg.
     *  options: {
     *      change: function(new Settings) {
     *          //Handles when settings have been updated/changed
     *      },
     *
     *      submit: function() {
     *          //Handles what to do when done editing settings
     *      }
     *  }
     */
    init: function(element, options) {
        options = options || {};

        var self = this,
            field = new ShortcutField(document.createElement('span'), {update: onShortcutUpdated}),
            shortcutGroup = document.createElement('fieldgroup'),
            doneGroup = document.createElement('fieldgroup'),
            copyright = document.createElement('small'),
            doneBtn = document.createElement('input'),
            storedSettings;

        self.element = element;

        element.className = 'settings';
        shortcutGroup.innerHTML = '<label title="Click to edit the keyboard shortcut used to show/hide Snipe.">Shortcut</label>';
        copyright.innerHTML = '&copy; 2011 Joseph Schmitt | <a href="http://reusablebits.com">Reusable Bits</a>';
        
        shortcutGroup.setAttribute('class', 'shortcut');
        doneGroup.setAttribute('class', 'done');
        
        doneBtn.setAttribute('value', 'Done');
        doneBtn.setAttribute('type', 'button');
        doneBtn.setAttribute('class', 'done');

        shortcutGroup.appendChild(field.element);
        element.appendChild(shortcutGroup);
        
        doneGroup.appendChild(copyright);
        doneGroup.appendChild(doneBtn);
        element.appendChild(doneGroup);
        


// PRIVATE METHODS ____________________________________________________________

        function updateSettings() {
            if (options.change) {
                options.change.apply(null, [storedSettings]);
            }
        }


// PRIVILEGED METHODS __________________________________________________________

        self.set = function(newSettings) {
            storedSettings = newSettings;
            field.set(storedSettings.shortcut.key, storedSettings.shortcut.modifiers);
        };

        self.get = function() {
            return storedSettings;
        };


// EVENT SUBSCRIPTIONS ________________________________________________________

        element.addEventListener('submit', onSubmit);
        doneBtn.addEventListener('click', onDone);


// EVENT HANDLERS _____________________________________________________________

        function onShortcutUpdated(key, modifiers) {
            storedSettings['shortcut'] = {key: key, modifiers: modifiers};
            updateSettings();
        }

        function onSubmit(e) {
            console.log('settings submit');
            e.preventDefault();
        }

        function onDone(e) {
            console.log('onDone');
            if (options.submit) {
                options.submit.call(null);
            }

            e.preventDefault();
        }
    }
})