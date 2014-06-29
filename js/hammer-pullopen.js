/**
 * 
 * Horizontal Pull open menu from screen
 * 
 * Author: Tim Paul
 * 
 * @param element: the element that has the touch event applied (that we also setup the hammer event listeners on)
 * @param scope: the angular scope instance (optional)
 *
 */

function PullOpen(element, scope) {

    var self = this;

    // some misc global vars that can update (switches mostly)
    var stayInPlace;

    // create the JQ dom objects that we'll be operating on
    var $element = $(element);
    var $container = $element.closest('ion-tabs');
    // var $blackout = $container.find('#blackout');

    // establish some fixed variables (basic settings)
    var BREAKPOINT = $container.find('> .tabs').width();
    var TRANSLATE_RATIO = .6;

    /**
     * initialise
     */
    this.init = function() {
        
    };

    this.pullOpenHandler = function(ev) {

        // stop browser scrolling
        // fixes much flakyness on Clank...
        ev.gesture.preventDefault();

        switch(ev.type) {
            
            case 'touch':
                $container.addClass('dont-animate');
                break;

            case 'dragright':
            case 'dragleft':
                rAF(function(){

                    var translateAmount = ev.gesture.deltaX * TRANSLATE_RATIO;
                    var percentComplete = (Math.round(101 / BREAKPOINT * translateAmount * 10) / 10).toFixed();

                    stayInPlace = false;
                    
                    if (percentComplete >= 50) {
                        stayInPlace = true;
                    }
                    
                    if (percentComplete <= 100 && percentComplete > 0) {

                        // animate thru the slide in/out process - following the user's finger
                        $container.css({
                            "transform" : "translate3d(" + translateAmount + "px,0,0)"
                        });
                    } 

                });
                break;

            case 'swiperight':
                
                break;

            // on release we check how far we dragged + reset if no mode change is present
            case 'release':
                rAF(function(){
                    if (stayInPlace === true) {
                        self.enterMode();
                    } else {
                        // reset mode and go back to start...
                        stayInPlace = false;
                        $container.removeClass('dont-animate');
                        $container.css({
                            "transform" : "translate3d(0,0,0)"
                        });
                        $container.attr('style','');
                        // $blackout.css({
                        //     "opacity" : '0'
                        // });
                        scope.$parent.$apply(function(){
                            scope.$parent.uiService.menuOpen = false;
                        });
                    }
                });
                break;

        }

    };

    self.enterMode = function() {

        // innit the interactions needed to close the menu ...
        scope.$parent.appMenuBtn();

        rAF(function(){
        
            // put back css animation
            $container.removeClass('dont-animate').css({
                "transform" : "translate3d(" + BREAKPOINT + "px,0,0)"
            });

            $container.attr('style','');

        });

        // update global uiService settings
        scope.$parent.$apply(function(){
            scope.$parent.uiService.menuOpen = true;
        });
        
    }

    self.pullCloseHammer = new Hammer($element[0], { dragLockToAxis: true }).on("touch dragleft dragright swiperight release", self.pullOpenHandler);
}



