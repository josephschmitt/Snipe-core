Snipe.Settings = Class.extend({
    init: function(element) {
        var self = this,
            field = new ShortcutField(document.createElement('span'), {
                update: function() {
                    
                }
            });
        
        self.element = element;
        
        element.className = 'settings';
        element.innerHTML = '<fieldgroup id="snipe-settings-shortcut">\
                                <label title="Click to edit the keyboard shortcut used to show Snipe.">Shortcut</label>\
                             </fieldgroup>\
                             <small>&copy; 2011 Joseph Schmitt | <a href="http://reusablebits.com">Reusable Bits</a></small>\
                             ';
                             
        element.querySelector('#snipe-settings-shortcut').appendChild(field.element);
        
        element.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
})