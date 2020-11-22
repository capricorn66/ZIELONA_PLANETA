import $ from 'jquery';
import debounce from 'lodash.debounce';

$.fn.navScroll = function(config) {
    const options = $.extend({
        swipeLength: 150,
        swipeTime: 200,
        root: 'window',
    }, config);

    return this.each(function() {
        const $this = $(this);
        if ( $this.hasClass('nav-scroll-init')) {
            return false;
        }
        const $swipeNav = $this.find('.nav-scroll-container');
        const $swipeNavContent = $swipeNav.find('.nav');
        const $swipeNavItemDropdown = $swipeNavContent.find('.nav-item .dropdown');
        const $swipeBtnLeft = $this.find('.nav-scroll-btn-left');
        const $swipeBtnRight = $this.find('.nav-scroll-btn-right');
        const $activeNavItem = $swipeNavContent.find('.active');
        const swipeState = {
            swipeMoving: false,
            swipeDirection: '',
        };
        let $dropdownMenu;
        let swiping = false;

        if ($swipeNavItemDropdown.length) {
            $swipeNavItemDropdown.on('show.bs.dropdown', function(e) {
                $dropdownMenu = $(e.target).find('.dropdown-menu');
                const eOffset = $(e.target).offset();

                $dropdownMenu.css({
                    'top': eOffset.top + $(e.target).outerHeight(),
                    'left': eOffset.left - $dropdownMenu.outerWidth() + $(e.target).outerWidth(),
                    'width': $dropdownMenu.outerWidth(),
                    'min-width': $dropdownMenu.outerWidth(),
                });

                $('body').append($dropdownMenu.detach());
            });

            $this.on('hide.bs.dropdown', function(e) {
                $(e.target).append($dropdownMenu.detach());
                $dropdownMenu.attr('style', '');
            });
        }

        const swipeDirection = function() {
            const navSize = $swipeNav.get(0).getBoundingClientRect();
            const navSizeRight = Math.floor(navSize.right);
            const navSizeLeft = Math.floor(navSize.left);
            const contentSize = $swipeNavContent.get(0).getBoundingClientRect();
            const contentSizeRight = Math.floor(contentSize.right) -1;
            const contentSizeLeft = Math.floor(contentSize.left);

            if (navSizeLeft > contentSizeLeft && navSizeRight < contentSizeRight) {
                return 'both';
            } else if (contentSizeLeft < navSizeLeft) {
                return 'left';
            } else if (contentSizeRight > navSizeRight) {
                return 'right';
            } else {
                return 'none';
            }
        };

        const swipeTo = function(direction, newDirection, length) {
            if (swipeState.swipeMoving === true) {
                return;
            }
            if (swipeDirection() === direction || swipeDirection() === 'both') {
                swipeState.swipeMoving = true;
                $swipeNav.animate({
                    scrollLeft: $swipeNav.scrollLeft() + length,
                }, options.swipeTime, function() {
                    swipeState.swipeDirection = '';
                    swipeState.swipeMoving = false;
                    options.swipeTime = 200;
                });
                swipeState.swipeDirection = newDirection;
            }
        };

        $swipeBtnRight.on('click', function() {
            $('> li', $swipeNavContent).each( function() {
                const $right = $(this);
                if ( $right.position().left + $right.outerWidth(true) > $right.width() ) {
                    options.swipeLength = $right.position().left + $right.outerWidth(true) - $right.width() + 20;
                    return false;
                }
            });

            swipeTo('right', 'left', options.swipeLength);
        });
        $swipeBtnLeft.on('click', function() {
            $('> li', $swipeNavContent).each( function() {
                const $left = $(this);
                if ( $left.position().left + $left.outerWidth(true) - 20 > 0 && $left.position().left +
                    $left.outerWidth(true) - 20 < $left.outerWidth(true) ) {
                    options.swipeLength = -($left.position().left - 40);
                    return false;
                }
            });

            swipeTo('left', 'right', -options.swipeLength);
        });

        $swipeNav.scroll( function() {
            if (!swiping) {
                window.requestAnimationFrame(function() {
                    $this.attr('data-overflowing', swipeDirection());
                    swiping = false;
                });
            }
            swiping = true;

            if ($swipeNavItemDropdown.length && $('body > .dropdown-menu').length) {
                $swipeNavContent.find('.nav-item .dropdown.show').
                    append($dropdownMenu.detach()).
                    dropdown('hide');
                $dropdownMenu.attr('style', '');
            }
        });

        $this.attr('data-overflowing', swipeDirection());

        const showActiveItem = function() {
            if ($activeNavItem.length) {
                const activeNavItemPos = ($activeNavItem.offset().left - $swipeNav.offset().left) +
                    $activeNavItem.width();

                if ( activeNavItemPos > $swipeNav.width() - 60 ) {
                    options.swipeTime = 0;
                    swipeTo('right', 'left', ( activeNavItemPos - $swipeNav.width() ) + 50 );
                }
            }
        };

        showActiveItem();

        $this.addClass('nav-scroll-init');

        const navScrollToggle = debounce(function() {
            $this.attr('data-overflowing', swipeDirection());
            showActiveItem();
            if ($swipeNavItemDropdown.length) {
                $('[data-toggle="dropdown"]', $this).dropdown('hide');
            }
        }, 250);

        window.addEventListener('resize', navScrollToggle);
    });
};
