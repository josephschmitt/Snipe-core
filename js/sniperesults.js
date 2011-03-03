Snipe.Results = Class.extend({
    /**
     * Init method
     * @param options (Object) - Options for the method.
     *  Eg.
     *  options: {
     *      //Maximum number of results to display
     *      maxResults: 5,
     *
     *      select: function(winid, tabid) {
     *          //Method to handle what happens when an item is selected
     *      }
     *  }
     */
    init: function(element, options) {
        var self = this,
            items = element.querySelectorAll('li'),

            curSelection;

        self.element = element;


// PRIVATE METHODS ____________________________________________________________

        function updateLayout() {
            var height = 0;

            if (items.length > 0) {
                removeClass(element, 'invisible');

                for (var i = 0, length = items.length; i < length; i++) {
                    if (i < 5) {
                        height += items[i].clientHeight + 1;
                    }
                }

                element.style.maxHeight = height + 'px  !important';
            }
            else {
                addClass(element, 'invisible');
            }
        }

        function onItemSelect(e) {
            self.activateResult(e.target);
        }

        function onItemHover(e) {
            e.cancelBubble = true;

            var targ = e.target;
            //Hovering over child node
            if (!targ.children.length) {
                targ = targ.parentNode;
            }

            self.selectResult(targ);
        }

        function onItemLeave(e) {
            e.cancelBubble = true;

            var targ = e.target;
            //Hovering over child node
            if (!targ.children.length) {
                targ = targ.parentNode;
            }

            self.deselectResult(targ);
        }


// PRIVILEGED METHODS _________________________________________________________

        self.refresh = function(data) {
            if (!data) {
                element.innerHTML = '';
            }
            else {
                element.innerHTML = tmpl(
                    '<% for ( var i = 0; i < length; i++ ) { %>\
                        <li style="background-image:url(<%= results[i].favicon %>) !important;" data-index="<%= i %>" data-win="<%= results[i].winid %>" data-tab="<%= results[i].tabid %>">\
                            <%= results[i].title %>\
                            <em><%= results[i].url %></em>\
                        </li>\
                     <% } %>',
                    {results: data, length: Math.min(options.maxResults, data.length) || data.length}
                );

                items = element.querySelectorAll('li');

                for (var i = 0; i < items.length; i++) {
                    items[i].addEventListener('mouseover', onItemHover, false);
                    items[i].addEventListener('mouseout', onItemLeave, false);
                    items[i].addEventListener('click', onItemSelect, false);
                }
            }

            updateLayout();
            self.selectResult(items[0]);
        };

        self.selectResult = function(item) {
            if (!item) {return false;}
            
            if (curSelection) {
                self.deselectResult(curSelection);
            }

            addClass(item, 'active');
            self.curIndex = parseInt(item.getAttribute('data-index'));
            curSelection = items[self.curIndex];
        };

        self.deselectResult = function(item) {
            removeClass(item, 'active');
            curSelection = null;
            self.curIndex = null;
        };
        
        self.activateResult = function(item) {
            if (!item) {
                item = curSelection;
            }
            
            options.select.apply(null, [item.getAttribute('data-win'), item.getAttribute('data-tab')]);
        };

        self.destroy = function() {
            element.parentNode.removeChild(element);
        };
    }
});