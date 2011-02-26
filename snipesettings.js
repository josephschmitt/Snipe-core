Snipe.Settings = Class.extend({
    init: function(element) {
        var self = this,
            form = document.createElement('form');
        
        self.element = element;
        
        element.className = 'settings';
        element.appendChild(form);
        
        form.innerHTML = '<fieldgroup><legend>Key Command</legend> </fieldgroup>'
    }
})