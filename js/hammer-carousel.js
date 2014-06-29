/**
* super simple carousel
* animation between panes happens with css transitions
*/
function Carousel(element, scope) {
    
    var self = this;
    element = $(element);

    var ANIMATION_CSS_TIME = 300;

    var container = $("ul", element);
    var panes = $("ul>li", element);
    var pane_width = 0;
    var pane_count = panes.length;

    var current_pane = 0;

    /**
     * initial
     */
    this.init = function(startSlide) {
        setPaneDimensions();        
        $(window).on("load resize orientationchange", function() {
            setPaneDimensions();
        });
    };


    /**
     * set the pane dimensions and scale the container
     */
    function setPaneDimensions() {
        pane_width = element.width();
        
        // incase carousel slides have been updated, re-index them
        panes = $("ul>li", element);
        pane_count = panes.length;

        panes.each(function() {
            $(this).width(pane_width);
        });
        container.width(pane_width*pane_count);
    };


    /**
     * show pane by index
     */
    this.showPane = function(index, animate) {
        // between the bounds
        index = Math.max(0, Math.min(index, pane_count - 1));
        current_pane = index;
        var offset = -((100/pane_count)*current_pane);
        setContainerOffset(offset, animate);
    };


    function setContainerOffset(percent, animate) {
        container.removeClass("animate");
        if(animate) {
            container.addClass("animate");
        }
        container.css({
            "transform" : "translate3d("+ percent +"%,0,0)"
        });
    }

    this.slideCallback = function(new_pane, pane_count) {
        // once the slide animation has happened, trigger a load of new cards
        setTimeout(function() {
            scope.$parent.$apply(function(){
                scope.$parent.slideControllerCallback(new_pane, pane_count);
            });
        }, ANIMATION_CSS_TIME);
    }

    this.next = function() { 
        var new_pane = current_pane + 1;
        this.slideCallback(new_pane, pane_count);
        return this.showPane(new_pane, true); 
    };
    
    this.prev = function() { 
        var new_pane = current_pane - 1;
        this.slideCallback(new_pane, pane_count);
        return this.showPane(new_pane, true); 
    };


    function horizPullHandler(ev) {

        // stop browser scrolling
        // fixes much flakyness on Clank...
        ev.gesture.preventDefault();

        switch(ev.type) {
            case 'dragright':
            case 'dragleft':
                // stick to the finger
                var pane_offset = -(100/pane_count)*current_pane;
                var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                // slow down at the first and last pane
                if((current_pane == 0 && ev.gesture.direction == "right") ||
                    (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
                    drag_offset *= .4;
                }

                setContainerOffset(drag_offset + pane_offset);
                break;

            case 'swipeleft':
                self.next();
                ev.gesture.stopDetect();
                break;

            case 'swiperight':
                self.prev();
                ev.gesture.stopDetect();
                break;

            case 'release':
                // more then 50% moved, navigate
                if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                    if(ev.gesture.direction == 'right') {
                        self.prev();
                    } else {
                        self.next();
                    }
                }
                else {
                    self.showPane(current_pane, true);
                }
                break;
        }
    }

    self.hammerHandler = new Hammer(element[0], { dragLockToAxis: true }).on("release dragleft dragright swipeleft swiperight", horizPullHandler);
}