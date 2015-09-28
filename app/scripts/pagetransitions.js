var PageTransitions = (function() {

	var $container = $('#container'),
		$pages = $container.children( 'article.pg-page' ),
		$menu = $("#cat-list-items"),
		$menuItems = $('#cat-list-items > li'),
		$comprar = $('#icon-comprar, #btn-comprar'),
		$home = $('#home'),
		pagesCount = $pages.length,
		current = 0,
		currentMenu = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;
	
	function init() {
		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		});
		$pages.eq( current ).addClass( 'pg-page-current' );
		
		$menuItems.on("click",function() {
			console.log("menu: "+isAnimating);
			if( isAnimating ) {
				return false;
			}
			currentMenu = $(this).index() + 1;

			if (currentMenu==current) {
				return false;
			};
			if (currentMenu<current) {
				nextPage(2);
			}else{
				nextPage(1);
			};
		})

		$home.on('click', function() {
			if(current==0){
				return false;
			}
			if( isAnimating ) {
				return false;
			}
			nextPage(2,1);
			$menu.removeClass("cat-list-show");
		});
		$comprar.on('click', function() {
			if(current>0 && current<5){
				return false;
			}
			if( isAnimating ) {
				return false;
			}
			nextPage(1);
			$menu.addClass("cat-list-show");
		});

	}
	
	function nextPage(options,type) {
		var animation = (options.animation) ? options.animation : options;
		if( isAnimating ) {
			return false;
		}
		isAnimating = true;

		var $currPage = $pages.eq(current);

		if (type==1) {
			current = 0;
		}else{
			if(currentMenu==0){
				++current;
			}else{
				current=currentMenu;
			}
		};
		
		var $nextPage = $pages.eq( current ).addClass( 'pg-page-current' ),
			outClass = '', inClass = '';
		switch( animation ) {
			case 1:
				outClass = 'pg-page-moveToTop';
				inClass = 'pg-page-moveFromBottom';
				break;
			case 2:
				outClass = 'pg-page-moveToBottom';
				inClass = 'pg-page-moveFromTop';
				break;
		}
		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pg-page-current' );
	}

	init();

	return { 
		init : init,
		nextPage : nextPage,
	};

})();