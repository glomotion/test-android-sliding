/**
 * 
 * Horizontal Pull to close
 * 
 * Author: Tim Paul
 * 
 * @param element: the element that has the touch event applied (that we also setup the hammer event listeners on)
 * @param scope: the angular scope instance (optional)
 *
 */

function PullClose(element, scope) {

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

    /**
     * destroy
     */
    this.destroy = function() {
        
        self.pullCloseHammer.off("touch tap dragleft dragright swipeleft release", self.pullCloseHandler);

    };


    this.pullCloseHandler = function(ev) {

        // stop browser scrolling
        // fixes much flakyness on Clank...
        ev.gesture.preventDefault();

        switch(ev.type) {
            
            case 'touch':
                rAF(function(){
                    $container.addClass('dont-animate');
                });
                break;

            case 'tap':
                self.resetMode();
                ev.gesture.stopDetect();
                break;

            case 'dragright':
            case 'dragleft':
                rAF(function(){
                    
                    var translateAmount = ev.gesture.deltaX * TRANSLATE_RATIO + BREAKPOINT;
                    var percentComplete = (Math.round(101 / BREAKPOINT * translateAmount * 10) / 10).toFixed();
                    // var opacitySteps = (1 / 100 * percentComplete).toFixed(2);

                    stayInPlace = false;

                    if (percentComplete >= 70) {
                        stayInPlace = true;
                    }

                    if (percentComplete <= 100 && percentComplete > 0) {
                        // animate thru the slide in/out process - following the user's finger
                        $container.css({
                            "transform" : "translate3d(" + translateAmount + "px,0,0)"
                        });

                        // if (opacitySteps <= .8) {
                        //     $blackout.css({
                        //         "opacity" : opacitySteps
                        //     });
                        // }
                    } 

                });
                break;

            // case 'swipeleft':
            //     ev.gesture.stopDetect();
            //     self.resetMode();
            //     break;

            // on release we check how far we dragged + reset if no mode change is present
            case 'release':
                rAF(function(){
                    // console.log(stayInPlace);
                    if (stayInPlace === true) {
                        $container.removeClass('dont-animate');
                        $container.attr('style','');
                    } else {
                        self.resetMode();
                    }
                });
                break;

        }

    };

    self.resetMode = function() {
        $container.removeClass('dont-animate');
        scope.$parent.$apply(function(){
            scope.$parent.uiService.menuOpen = false;
        });
        stayInPlace = false;
        
        // $blackout.css({
        //     "opacity" : '0'
        // });

        rAF(function(){
            $container.attr("style","");
            setTimeout( function(){ 
                // destroying the handler before the css animation is done causes undesired side effects... :P
                self.destroy();    
            },350);
        });
        
    }

    self.pullCloseHammer = new Hammer($element[0], { dragLockToAxis: true }).on("touch tap dragleft dragright swipeleft release", self.pullCloseHandler);
}



