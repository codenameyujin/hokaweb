/*** 모바일쇼핑몰 슬라이딩메뉴 ***/

var aCategory = [];
$(document).ready(function(){
/* var _arr; */
    var methods = {
        aCategory    : [],
        aSubCategory : {},
        get: function()
        {
             $.ajax({
                url : '/exec/front/Product/SubCategory',
                dataType: 'json',
                success: function(aData) {

                    if (aData == null || aData == 'undefined') {
                        methods.checkSub();
                        return;
                    }
                    for (var i=0; i<aData.length; i++)
                    {
                        var sParentCateNo = aData[i].parent_cate_no;
                        var sCateNo = aData[i].cate_no;
                        if (!methods.aSubCategory[sParentCateNo]) {
                            methods.aSubCategory[sParentCateNo] = [];
                        }
                        if (!aCategory[sCateNo]) {
                            aCategory[sCateNo] = [];
                        }
                        methods.aSubCategory[sParentCateNo].push( aData[i] );
                        aCategory[sCateNo] = aData[i];
                    }
                    methods.checkSub();
                    //methods.getMyCateList();
                    methods.showAll();
                }
            });
        },
        getParam: function(sUrl, sKey) {
            var aUrl         = sUrl.split('?');
            var sQueryString = aUrl[1];
            var aParam       = {};
            
            if (sQueryString) {
                var aFields = sQueryString.split("&");
                var aField  = [];
                for (var i=0; i<aFields.length; i++) {
                    aField = aFields[i].split('=');
                    aParam[aField[0]] = aField[1];
                }
            }
            return sKey ? aParam[sKey] : aParam;
        },

        show: function(overNode, iCateNo) {
        
            var oParentNode = overNode;
            var aHtml = [];

/*
			if (methods.aSubCategory[1]) {
			
				$(methods.aSubCategory[1]).each(function() {
				//console.log(methods.aSubCategory[1]);
                aHtml.push('<div>'+this.name+'</div>');
                
                });
			
			}
*/

			if (methods.aSubCategory[iCateNo] != undefined) {
                /* 2depth category */   

//                console.log(methods.aSubCategory[1]);
                
                $(methods.aSubCategory[1]).each(function() {
                    var xNo = this.name;
                    var xNo_no = this.cate_no;
                    
                    if (xNo_no == iCateNo) {
/*
	                    console.log(xNo);
	                    console.log(xNo_no);
	                    console.log(iCateNo);
*/
                    
	                   aHtml.push('<span class="mx_mo">'+xNo+'</span>');                   
                    }

                });
                    

                aHtml.push('<div class="mx_sh_nav_dp2" sub-sh-block="false"></div>');
                aHtml.push('<ul id="sub_nav" class="dp2">');
                
                aHtml.push('<li class="cate_item mx_mo"><span class="mx_back_c">BACK</span></li>');
                
                
                $(methods.aSubCategory[1]).each(function() {
                    var xNo = this.name;
                    var xNo_no = this.cate_no;
                    
                    if (xNo_no == iCateNo) {
	                   aHtml.push('<li class="cate_item mx_mo mb20">'); 
	                   aHtml.push('<a href="/product/list.html'+this.param+'">ALL<s>'+this.name+'</s></a>'); 
//	                   aHtml.push('<a href="/product/list.html'+this.param+'">'+this.name+'</a>'); 
	                   aHtml.push('</li>');               
                    }
                });


                $(methods.aSubCategory[iCateNo]).each(function() {
                
                    var sNextParentNo = this.cate_no;

	                    var xNo = this.name;
	                    var xNo_no = this.cate_no;
                        

                    if (methods.aSubCategory[sNextParentNo] != undefined) {
                        aHtml.push('<li id="cate'+this.cate_no+'" class="cate_item button">');
                        var sHref = this.param;
                    } else {
                        aHtml.push('<li id="cate'+this.cate_no+'" class="cate_item">');
                        var sHref = '#none';
                    }
                    
                    aHtml.push('<a href="/product/list.html'+this.param+'" class="viewdp2" cate="'+this.param+'">'+this.name+'</a>');
                    
                    //하위 추가
                    if (methods.aSubCategory[sNextParentNo] != undefined) {
						aHtml.push('<span class="mx_mo">'+xNo+'</span>');  
                    } 
	                

                    /* 3depth category */
                    if (methods.aSubCategory[sNextParentNo] != undefined) { 
	                    aHtml.push('<div class="mx_sh_nav_dp3" sub-sh-block="false"></div>');
                        aHtml.push('<ul class="dp3">');
                        
		                aHtml.push('<li class="cate_item mx_mo">');
		                aHtml.push('	<span class="mx_back_dp3">BACK</span>');
		                aHtml.push('</li>');  
		                
						aHtml.push('<li class="cate_item mx_mo mb20">'); 
						aHtml.push('<a href="/product/list.html'+this.param+'">ALL<s>'+this.name+'</s></a>'); 
						aHtml.push('</li>');    
		                
		                
                        $(methods.aSubCategory[sNextParentNo]).each(function() {
                            var sNextParentNo2 = this.cate_no;
                            
		                    var xNo = this.name;
		                    var xNo_no = this.cate_no;
                            
                            if (methods.aSubCategory[sNextParentNo2] != undefined) {
                                aHtml.push('<li id="cate'+this.cate_no+'" class="cate_item button">');
                                var sHref = '/product/list.html'+this.param;
                            } else {
                                aHtml.push('<li id="cate'+this.cate_no+'" class="cate_item">');
                                var sHref = '#none';
                            }
                            aHtml.push('<a href="/product/list.html'+this.param+'" class="viewdp3" cate="'+this.param+'">'+this.name+'</a>');
                            
                            //하위 추가
		                    if (methods.aSubCategory[sNextParentNo2] != undefined) {
								aHtml.push('<span class="mx_mo_">'+xNo+'</span>');  
		                    } 

                    /* 4depth category */
                            if (methods.aSubCategory[sNextParentNo2] != undefined) {
//                            if (methods.aSubCategory[sNextParentNo2] != undefined) {
	                            aHtml.push('<div class="mx_sh_nav_dp4" sub-sh-block="false"></div>');
	                            aHtml.push('<ul class="dp4">');
	                            
				                aHtml.push('<li class="cate_item mx_mo">');
				                aHtml.push('	<span class="mx_back_dp4">BACK</span>');
				                aHtml.push('</li>'); 
				                
								aHtml.push('<li class="cate_item mx_mo mb20">'); 
								aHtml.push('<a href="/product/list.html'+this.param+'">ALL<s>'+this.name+'</s></a>'); 
								aHtml.push('</li>');    
	                            
	                            
                                $(methods.aSubCategory[sNextParentNo2]).each(function() {

                                    aHtml.push('<li class="noChild" id="cate'+this.cate_no+'" class="cate_item">');
                                    aHtml.push('<a href="/product/list.html'+this.param+'" class="viewdp4" cate="'+this.param+'">'+this.name+'</a>');
                                    aHtml.push('</li>');
                                });
                                aHtml.push('</ul>');
                            }
                            
                            
                            aHtml.push('</li>');
                            
                        });
                        aHtml.push('</ul>');
                    }
                   
                    aHtml.push('</li>');

                });

                aHtml.push('</ul>');
            }

            $(oParentNode).append(aHtml.join(''));
            $('.mx_sh_nav_dp2').parent().addClass('subc'); //좌측메뉴 사용시
            $('.mx_sh_nav_dp3').parent().addClass('subc'); //좌측메뉴 사용시
            $('.mx_sh_nav_dp4').parent().addClass('subc'); //좌측메뉴 사용시
            

            
            
        },


       showAll: function() {
	       $('a.view').each(function(){
				var	iCateNo = Number(methods.getParam($(this).attr('cate'), 'cate_no'));
				if ($(this).parent().attr('class') != 'xans-record- ') {
					methods.show(this.parentNode, iCateNo);
					
				}
			});
			
			$('.mx_nav li.cate_item div.mx_sh_nav_dp2, .mx_nav li.cate_item div.mx_sh_nav_dp3, .mx_nav li.cate_item div.mx_sh_nav_dp4').click(function() {
			  $(this).parent().toggleClass('active');
			  $(this).next().slideToggle(200);
			});
			
		    $('.mx_back_c').click(function(){
			    $(this).parents('ul').find('.dp2').removeClass('on');
/*
			    $(this).parents('ul').find('.dp3').removeClass('on');
			    $(this).parents('ul').find('.dp4').removeClass('on');
*/
//			    console.log('bbb');
		    });
		    $('.mx_back_dp3').click(function(){
			    $(this).parents('ul').find('.dp3').removeClass('on');
//			    console.log('bbb');
		    });
		    $('.mx_back_dp4').click(function(){
			    $(this).parents('ul').find('.dp4').removeClass('on');
//			    console.log('bbb');
		    });
		    
		    $('.mx_mo').click(function(){
			    $(this).parent('li').find(' > ul').addClass('on');
//			    $('.cst_navi').addClass('on');
		    });
		    $('.mx_mo_').click(function(){
			    $(this).parent('li').find(' > ul.dp4').addClass('on');
//			    $('.cst_navi').addClass('on');
		    });
		    
		    
		    
		    
		    
	
			var mql = window.matchMedia("screen and (max-width: 900px)");
			
		    if(mql.matches) {	
				$('#cate_nav li').unbind("mouseenter");
				$('#cate_nav li').unbind("mouseleave");
				
				$('.cst_navi li').unbind("mouseenter");
				$('.cst_navi li').unbind("mouseleave");
		        //console.log('모바일 화면 입니다.');
		    } else {
				// 네비게이션 : 수동 코딩용 (기본셋팅)
				$('.dp2 > li').mouseenter(function() {
					$(this).addClass('on');
					$("> ul", this).addClass('on');
				}).mouseleave(function() {
					$(this).removeClass('on');
					$("> ul", this).removeClass('on');
				});
				$('.dp3 > li').mouseenter(function() {
					$(this).addClass('on');
					$("> ul", this).addClass('on');
				}).mouseleave(function() {
					$(this).removeClass('on');
					$("> ul", this).removeClass('on');
				});
		        //console.log('데스크탑 화면 입니다.');
		    }
		    
			mql.addListener(function(e) {
			    if(e.matches) {	
			    	$('#cate_nav li').unbind("mouseenter");
			    	$('#cate_nav li').unbind("mouseleave");
			    	
					$('.cst_navi li').unbind("mouseenter");
					$('.cst_navi li').unbind("mouseleave");
			        //console.log('모바일 화면 입니다.');
			    } else {
					// 네비게이션 : 수동 코딩용 (기본셋팅)
					$('.dp2 > li').mouseenter(function() {
						$(this).addClass('on');
						$("> ul", this).addClass('on');
					}).mouseleave(function() {
						$(this).removeClass('on');
						$("> ul", this).removeClass('on');
					});
					$('.dp3 > li').mouseenter(function() {
						$(this).addClass('on');
						$("> ul", this).addClass('on');
					}).mouseleave(function() {
						$(this).removeClass('on');
						$("> ul", this).removeClass('on');
					});

			    }
			});
		    
		    

			
        },

		//선택 카테고리 이외 하위 메뉴 삭제 
        close: function() {
	        $('.slideSubMenu').remove();
        },
        checkSub: function() {
            $('.cate').each(function(){
                var iCateNo = Number(methods.getParam($(this).attr('cate'), 'cate_no'));
                var result = methods.aSubCategory[iCateNo];
                console.log(result);
                if (result == undefined) {
                    if ($(this).closest('#slideProjectList').length) {
                        var sHref = '/product/project.html'+$(this).attr('cate');
                    } else {
                        //var sHref = '/product/list.html'+$(this).attr('cate');
                        var sHref = '/product/list.html'+$(this).attr('cate');
                    }
                    $(this).attr('href', sHref);
                    $(this).parent().attr('class', 'noChild');
                }
            });
        },

    };
    
    methods.get();
    
    

    
});













$(document).ready(function(){


	/* 중앙 레이어 활성 타임 설정: 시작 */
/*
	setTimeout(function() { 
	    $('.center_pop_div').fadeIn(100); 
		$('.center_pop_div').css('opacity', '1');	
		
	    $('.center_pop_div_img').fadeIn(100); 
		$('.center_pop_div_img').css('opacity', '1');	
	});
*/


    //레이어 팝업 쿠키 체크
    // 레이어 센터배너 
    if($.cookie('#center_pp') == 'hidden'){
    	$('.center_pop_div').remove();
    	$('.center_pop_div_img').remove();
    } else {
    	$('.center_pop_div').css('display','flex');
    	$('.center_pop_div_img').css('display','flex');
    }
    // 플로팅 좌측배너 
    if($.cookie('#floating_pp') == 'hidden'){
    	$('.floating_sw_div').remove();
    } else {
    	$('.floating_sw_div').css('display','block');
    }
	

	/* 중앙 레이어 팝업 닫기: 시작 */
	$('.center_pop_close').click(function(){				
		$('.center_pop_div').remove();
		$('.center_pop_div_img').remove();
	});
	$('.today_pop_close').click(function(e){
		e.preventDefault();
    	$.cookie('#center_pp','hidden',{expires : 1});
    	$('.center_pop_div').remove();
    	$('.center_pop_div_img').remove();
	});
	
	/* 플로팅 레이어 팝업 닫기: 시작 */
	$('.floating_sw_close').click(function(){				
		$('.floating_sw_div').remove();
	});
	$('.today_ft_close').click(function(e){
		e.preventDefault();
    	$.cookie('#floating_pp','hidden',{expires : 1});
    	$('.floating_sw_div').remove();
	});

	/* 플로팅 배너 닫기: 시작 */
	$('.floating_close').click(function(){				
		$('.floating_div').remove();
	});



	
	// 공통영역 : 네비게이션 
	
	// 네비게이션 설정 
	
	var mql = window.matchMedia("screen and (max-width: 900px)");
	
    if(mql.matches) {	
		$('#cate_nav li').unbind("mouseenter");
		$('#cate_nav li').unbind("mouseleave");
		
		$('.cst_navi li').unbind("mouseenter");
		$('.cst_navi li').unbind("mouseleave");
		
/*
		$('#cate_nav > li').unbind("mouseenter");
		$('#cate_nav > li').unbind("mouseleave");
		
		$('.cst_navi > li').unbind("mouseenter");
		$('.cst_navi > li').unbind("mouseleave");
*/
        //console.log('모바일 화면 입니다.');
    } else {
		// 네비게이션 : 수동 코딩용 (기본셋팅)
		$('.cst_navi > li').mouseenter(function() {
			$(this).addClass('active');
			$(this).children('div').addClass('on');
		});
		$('.cst_navi > li').mouseleave(function() {
			$(this).removeClass('active');
			$(this).children('div').removeClass('on');
		});
		// 네비게이션 : 자동 생성용(기본셋팅)
		$('#cate_nav > li').mouseenter(function() {
			$(this).addClass('on');
			$(this).addClass('selected');
			$("> ul", this).addClass('on');
		}).mouseleave(function() {
			$(this).removeClass('on');
			$(this).removeClass('selected');
			$("> ul", this).removeClass('on');
		});
		
/*
		$('.cate_item').mouseenter(function() {
			$(this).addClass('on');
			$(this).addClass('selected');
			$("> ul", this).addClass('on');
		}).mouseleave(function() {
			$(this).removeClass('on');
			$(this).removeClass('selected');
			$("> ul", this).removeClass('on');
		});
*/
        //console.log('데스크탑 화면 입니다.');
    }
	
	mql.addListener(function(e) {
	    if(e.matches) {	
	    	$('#cate_nav li').unbind("mouseenter");
	    	$('#cate_nav li').unbind("mouseleave");
	    	
			$('.cst_navi li').unbind("mouseenter");
			$('.cst_navi li').unbind("mouseleave");

/*
	    	$('#cate_nav > li').unbind("mouseenter");
	    	$('#cate_nav > li').unbind("mouseleave");
	    	
			$('.cst_navi > li').unbind("mouseenter");
			$('.cst_navi > li').unbind("mouseleave");
*/
	        //console.log('모바일 화면 입니다.');
	    } else {
			// 네비게이션 : 수동 코딩용 (기본셋팅)
			$('.cst_navi > li').mouseenter(function() {
				$(this).addClass('active');
				$(this).children('div').addClass('on');
			});
			$('.cst_navi > li').mouseleave(function() {
				$(this).removeClass('active');
				$(this).children('div').removeClass('on');
			});
			// 네비게이션 : 자동 생성용(기본셋팅)
			$('#cate_nav > li').mouseenter(function() {
				$(this).addClass('on');
				$(this).addClass('selected');
				$("> ul", this).addClass('on');
			}).mouseleave(function() {
				$(this).removeClass('on');
				$(this).removeClass('selected');
				$("> ul", this).removeClass('on');
			});
			
/*
			$('.cate_item').mouseenter(function() {
				$(this).addClass('on');
				$(this).addClass('selected');
				$("> ul", this).addClass('on');
			}).mouseleave(function() {
				$(this).removeClass('on');
				$(this).removeClass('selected');
				$("> ul", this).removeClass('on');
			});
*/
			
			$('.mx_nav ul').removeAttr("style");
			$('.mx_nav .cate_item').removeClass("active");
//			$('.mx_nav .dp2, .mx_nav .dp3, .mx_nav .dp4').removeAttr("style");
	        //console.log('데스크탑 화면 입니다.');
	    }
	});
	
	
	
	

	
	
	
	

	

	
	
	/* 모바일 서브 네비게이션 시작 -- */
	// 대메뉴 :: 하드코딩
	const mm_nav_items = document.querySelectorAll(".mx_mm_nav");
	
	function toggleAccordion_mm_nav() {
	const itemToggle_mm_nav = this.getAttribute('sub-nav-block');
		for (i = 0; i < mm_nav_items.length; i++) {
			mm_nav_items[i].setAttribute('sub-nav-block', 'false');
		}
		if (itemToggle_mm_nav == 'false') {
			this.setAttribute('sub-nav-block', 'true');
		}
	}
	mm_nav_items.forEach(item => item.addEventListener('click', toggleAccordion_mm_nav));
	
	/* -- 모바일 서브 네비게이션 끝 */
	
	
	
	/* 메뉴 선택 bar 시작 */
    $('#cat_title p, .shopcate_mobile').each(function(){
	    var px_cate = $(this).attr('ec-page-cate');
	    //console.log(px_cate);
	    
	    $('.cst_navi > li').each(function(){
		    var lx_cate = $(this).attr('nav-name-data');
		    //console.log(lx_cate);
		    if (lx_cate == px_cate ){
			    $(this).children('a').addClass('on');
			    $(this).children('span').addClass('on');
		    } 
		});
    });
	/* 메뉴 선택 bar 끝 */
	
	
    $('.cst_navi > li > span.mx_mo').click(function(){
	    $(this).parent('li').find('.sp_nav_wrap').addClass('on');
//	    $(this).parent('li').find('.sp_nav_wrap').addClass('onx');
	    $('.cst_navi').addClass('on');
	    

    });
    
    $('.mx_back').click(function(){
	   // $(this).parent('li').find('.sp_nav_wrap').removeClass('on');
	    $(this).parents('div').find('.sp_nav_wrap').removeClass('on');
	    $('.cst_navi').removeClass('on');
	   //console.log('aaa');
	    
    });
	
	
	
	
	
	// 공통영역 : 핫 키워드
	/* 웹 메인 흰색 bar 활성 */
/*
	$('#header').mouseenter(function() {
		$('.fix_header').addClass('on');
	});
	$('#header').mouseleave(function() {
		$('.fix_header').removeClass('on');
	});
*/

	
	// 타입별 : 모바일(배경)
	$(window).scroll(function(){
		if ($(this).scrollTop() > 1) {
			$('.skin_type_b .inner_bar').addClass('on');
		} else {
			$('.skin_type_b .inner_bar').removeClass('on');
		}
	});


	
	
	// 공통영역 : 탑버튼
	/* 화면 탑 시작 */
	$(window).scroll(function(){
		if ($(this).scrollTop() > 150) {
			$('.scTop').fadeIn();
			$('.qu_whis_wrap').addClass('on trans');
		} else {
			$('.scTop').fadeOut();
			$('.qu_whis_wrap').removeClass('on');
		}
	});

	$('.scTop').click(function(){
		$('html, body').animate({scrollTop : 0},500);
		return false;
	});
	/*  -- 화면 탑 끝 */
	
	
	// 공통영역 : 사이드 바 (웹 사용)
    /* 사이드 퀵바 토글 시작 -- */
	$('.side_q_open').click(function(){
		var quick_display = $(".sd_quick").css("right");
		//console.log(quick_display);	
		if (quick_display == "-140px") {
			$(".sd_quick").addClass('sd_qu_open trans');
			$(".side_q_open").addClass('sel');
			$(".w_dimmed").css('display','block');//사이드 메뉴 백그라운드
			
		}else{
			$(".sd_quick").removeClass('sd_qu_open');
			$(".side_q_open").removeClass('sel');
			$(".w_dimmed").css('display','none');//사이드 메뉴 백그라운드 비활성
		};
	});
	
	$('.w_dimmed').click(function(){
		$(".sd_quick").removeClass('sd_qu_open');
		$(".side_q_open").removeClass('sel');
		$(".w_dimmed").css('display','none');//사이드 메뉴 백그라운드 비활성
	});
    /* -- 사이드 퀵바 토글 끝 */



	// 상품상세 추가상품 열고 닫기
	
/*
	$('.additional .title').click( function() {
		$('.additional .product').toggle();
		$('.mx_add_product').toggleClass('on');
	});
*/
	
	//타입 2(상세설명: 사용)
	$('.mx_add_product_exp').click( function() {
		$('.mx_info_wrap .mx_simple_exp').toggle();
		$('.mx_add_product_exp').toggleClass('on');
	});



	// 게시판 영역 
	/* 보드 셀렉트 박스 아이콘 변환 : 모바일 적용 */
	$('.select_div > div > #board_category').addClass('cloud_gnb sort_icon');
	$('.select_div > div > #board_sort').addClass('cloud_gnb sort_icon');



	// 상품 리스트 
	/* 상품 리스트 항목 변환 시작 -- */
	$('.m_viewType li').click(function(){	
		//var typeDesc = '';				
		var tab_id = $(this).attr('data-tab');
		var list_type = $(this).attr('pro-list-type');
		var des_type = $(this).attr('data-des-type');

		$('.m_viewType li').removeClass('selected');		
		$(this).addClass('selected');

		$("#tab_layout_type").attr('class','xans-element- xans-product xans-product-listnormal vm_list_gride '+list_type);
		$("#tab_layout").attr('class','prdList '+tab_id);
		des_type_fn(des_type);
		
	});
	
	function des_type_fn(des_type){
		$('#tab_layout').find('.description').each(function() {
			$("#tab_layout .description").attr('class','description '+des_type);
		});	
	}
	/* -- 상품 리스트 항목 변환 끝 */
	
	
	
	/* 룩북 리스트 항목 변환 시작 -- */
	$('.look_grid_div li').click(function(){				
		var tab_look_grid = $(this).attr('ds-grid');
		
		$('.look_grid_div li').removeClass('on');
		$(this).addClass('on');
		
		$("#mx_grid_type").removeClass();
		$("#mx_grid_type").addClass(tab_look_grid);
	});
	
	/* -- 룩북 리스트 항목 변환 끝 */
	
	
	

	/* 메인 베스트 버튼 시작 -- */
	$('.md_cho_btn span').click(function(){						
		var tab_id = $(this).attr('data-tab');

		$('.md_cho_btn span').removeClass('on');		
		$('.md_cho_wrap').removeClass('on');		

		$(this).addClass('on');								
		$("#" + tab_id).addClass('on');
	})
	
	/* -- 메인 베스트 버튼 끝 */
	

	
	/* 아코디언 시작 -- */
	
	// 공통 영역
	// 푸터 아코디언 : 모바일 
	const items = document.querySelectorAll(".bot_nav");
	function toggleAccordion() {
	const itemToggle = this.getAttribute('aria-expanded');
		for (i = 0; i < items.length; i++) {
			items[i].setAttribute('aria-expanded', 'false');
		}
		if (itemToggle == 'false') {
			this.setAttribute('aria-expanded', 'true');
		}
	}
	items.forEach(item => item.addEventListener('click', toggleAccordion));
	
	
	
	// 개별 영역
	// 주문처리 현황
	const items_ret_btn = document.querySelectorAll(".del_ret_btn");
	function toggleAccordion_ret() {
	const itemToggle_ret = this.getAttribute('aria-expanded-mymore');
		for (i = 0; i < items_ret_btn.length; i++) {
			items_ret_btn[i].setAttribute('aria-expanded-mymore', 'false');
		}
		if (itemToggle_ret == 'false') {
			this.setAttribute('aria-expanded-mymore', 'true');
		}
	}
	items_ret_btn.forEach(item => item.addEventListener('click', toggleAccordion_ret));
	
	
	// 나의 적립금
	const my_point = document.querySelectorAll(".my_point");
	function toggleAccordion_mileage() {
	const itemToggle_mil = this.getAttribute('aria-expanded-mymileage');
		for (i = 0; i < my_point.length; i++) {
			my_point[i].setAttribute('aria-expanded-mymileage', 'false');
		}
		if (itemToggle_mil == 'false') {
			this.setAttribute('aria-expanded-mymileage', 'true');
		}
	}
	my_point.forEach(item => item.addEventListener('click', toggleAccordion_mileage));
	

	// 쇼핑 가이드
	const items_gu = document.querySelectorAll(".sinfo_nav");
	function toggleAccordion_guide() {
	const itemToggle_gu = this.getAttribute('aria-expanded-shop');
		for (i = 0; i < items_gu.length; i++) {
			items_gu[i].setAttribute('aria-expanded-shop', 'false');
			$(this).parent('div').removeClass('on');
		}
		if (itemToggle_gu == 'false') {
			this.setAttribute('aria-expanded-shop', 'true');
			$('.if_box .cont').removeClass('on');
			$(this).parent('div').addClass('on');
		}
	}
	items_gu.forEach(item => item.addEventListener('click', toggleAccordion_guide));
	
	
	// 보드 아코디언 
	const items_bo = document.querySelectorAll(".list_btn");
	function toggleAccordion_board() {
	const itemToggle = this.getAttribute('aria-expanded-board');
		for (i = 0; i < items_bo.length; i++) {
			items_bo[i].setAttribute('aria-expanded-board', 'false');
		}
		if (itemToggle == 'false') {
			this.setAttribute('aria-expanded-board', 'true');
//			alert('비밀글');
		}
	}
	items_bo.forEach(item => item.addEventListener('click', toggleAccordion_board));
	
	
	
	/* -- 아코디언 끝 */
	
	
	


	/* 숏 라이브 버튼 제어 시작 : 메인 */
    
	$('.mx_mov_control .mx_mov_btn_stop').click(function(){
		sel_mx_pause();
	});
	$('.mx_mov_control .mx_mov_btn_play').click(function(){
		sel_mx_play();
	});

    function sel_mx_pause() {
		var iframe_shot = document.getElementById("shot_video");	
		var player = new Vimeo.Player(iframe_shot);
		
		player.pause();
//		post('pause');
		$('.mx_mov_control .mx_mov_btn_play').addClass('on');
		$('.mx_mov_control .mx_mov_btn_stop').removeClass('on');
    }
    function sel_mx_play() {
		var iframe_shot = document.getElementById("shot_video");	
		var player = new Vimeo.Player(iframe_shot);
		
		player.play(); 
//		post('play');
		$('.mx_mov_control .mx_mov_btn_play').removeClass('on');
		$('.mx_mov_control .mx_mov_btn_stop').addClass('on');
    }
    
	/* 숏 라이브 버튼 제어 끝 : 메인 */


	


	/* 드롭박스 시작 */
    $(".dropdown img.flag").addClass("flagvisibility");

    $(".dropdown dt a").click(function() {
        $(".dropdown dd ul").toggle();
    });
                
    $(".dropdown dd ul li a").click(function() {
        var text = $(this).html();
        $(".dropdown dt a span").html(text);
        $(".dropdown dd ul").hide();
        $("#result").html("Selected value is: " + getSelectedValue("gd_sort_list"));
    });
                
    function getSelectedValue(id) {
        return $("#" + id).find("dt a span.value").html();
    }

    $(document).bind('click', function(e) {
        var $clicked = $(e.target);
        if (! $clicked.parents().hasClass("dropdown"))
            $(".dropdown dd ul").hide();
    });

    $("#flagSwitcher").click(function() {
        $(".dropdown img.flag").toggleClass("flagvisibility");
    });
    /* 드롭박스 끝 */



	/* 핫 키워드 팝업 레이어 활성(pc활성/모바일 비활성) */
	$('.nav_r_div_hotkey').mouseenter(function() {
	    if(mql.matches) {		
	        //console.log('모바일 화면 입니다.');
	    } else {
			$(this).children('div').addClass('on');
	        //console.log('데스크탑 화면 입니다.');
	    }//if
		mql.addListener(function(e) {
		    if(e.matches) {	
		        //console.log('모바일 화면 입니다.');
		    } else {
				$(this).children('div').addClass('on');
		        //console.log('데스크탑 화면 입니다.');
		    }
		});//if
	});
	$('.nav_r_div_hotkey').mouseleave(function() {
		$(this).children('div').removeClass('on');
	});
	

	
	// 공통영역 : 레이어(검색창)
	// 검색 전체창 열기
	
	$('.icon_nav_sear').click(function() {
		$("#fullSearch").css('opacity','1');
		$("#fullSearch").css('z-index','98');
		$("html").css('overflow','hidden');
		
		$(".top_navi_wrap").removeClass('on'); //대메뉴 원위치 
		$(".mx_nav_bg").removeClass('on'); //대메뉴 오픈배경 숨김
		$(".mx_nav_bg_back").removeClass('on'); //배경삭제(반투명)
		
		$(".na_mo_btn").removeClass('on'); //닫기
		$(".na_pc_btn").removeClass('on'); //닫기
		
		$(".mxmo_nav_bg").removeClass('on'); //닫기
		
		
		//메인적용(화이트 텍스트 => 블랙 텍스트)
/*
		if($("#main").is(".fp-viewing-brandmovie, .fp-viewing-info") === true) {
			//실버모드 변환
			$('.fix_header').addClass('bw');
			$('.fix_header').removeClass('bb');
        }
*/
		
	});
	
	// 검색 전체창 닫기 
	$('.search_box .closebtn').click(function() {
		$("#fullSearch").css('opacity','0');
		$("#fullSearch").css('z-index','-1');
		$("html").css('overflow','auto');
		
	});
	/*  -- 추천 검색어 레이어 활성 끝 */
	
	
	
	
    $('.na_mo_btn').click(function(){
    	//console.log('모바일 화면 입니다.');
    	
		var mx_nav_dis = $('.top_navi_wrap').css('opacity');
	
		if (mx_nav_dis == 0) {
			$(".top_navi_wrap").addClass('on'); //대메뉴 오픈 left:0
			//$(".mx_nav_bg").addClass('on'); //대메뉴 오픈 배경 
			$(".mxmo_nav_bg").addClass('on'); //대메뉴 오픈 배경 
			$(".mx_nav_bg_back").addClass('on'); //대메뉴 닫기 배경(반투명)
			
			$(".na_mo_btn").addClass('on'); //대메뉴 오픈시(닫기아이콘 변경)
			
//			$(".sp_nav_wrap").addClass('on'); //닫기
			$(".sp_nav_wrap").removeClass('onx'); //닫기
		
			
			$("html").css('overflow','hidden');
			
			//메인적용(화이트 텍스트 => 블랙 텍스트)
/*
			if($("#main").is(".fp-viewing-brandmovie, .fp-viewing-info") === true) {
				//실버모드 변환
				$('.fix_header').addClass('bb');
				$('.fix_header').removeClass('bw');
	        }
*/
			
		} else{
			$(".top_navi_wrap").removeClass('on'); //대메뉴 원위치 
			//$(".mx_nav_bg").removeClass('on'); //대메뉴 오픈배경 숨김
			$(".mxmo_nav_bg").removeClass('on'); //대메뉴 오픈 배경 
			$(".mx_nav_bg_back").removeClass('on'); //배경삭제(반투명)
			
			$(".na_mo_btn").removeClass('on'); //닫기
			
			
			//$(".sp_nav_wrap").css('display','none'); //닫기
//			$(".cst_navi").removeClass('on'); //닫기
//			$(".sp_nav_wrap").removeClass('on'); //닫기
			
			$(".cst_navi").removeClass('on'); //닫기
			$(".sp_nav_wrap").addClass('onx'); //닫기
			$(".sp_nav_wrap").removeClass('on'); //닫기
			
			
			$("#cate_nav li .dp2.on").removeClass('on'); //닫기
			$("#cate_nav li .dp3.on").removeClass('on'); //닫기
			$("#cate_nav li .dp4.on").removeClass('on'); //닫기
			
			
			
			
//	    $(this).parent('li').find('.sp_nav_wrap').addClass('on');
//	    $(this).parent('li').find('.sp_nav_wrap').addClass('onx');
			
			
			
			$("html").css('overflow','auto');
			
			//메인적용(블랙 텍스트 => 화이트 텍스트)
/*
			if($("#main").is(".fp-viewing-brandmovie, .fp-viewing-info") === true) {
				//실버모드 변환
				$('.fix_header').addClass('bw');
				$('.fix_header').removeClass('bb');
	        }
*/
			
		}//if

		
	});

	
	$('.na_pc_btn').click(function(){
    	//console.log('데스크탑 화면 입니다.');
	
		var pc_nav_display = $(".top_navi_wrap").css("left");
		
		if (pc_nav_display != "0px") {
			$(".top_navi_wrap").addClass('on'); //대메뉴 오픈 left:0
			$(".mx_nav_bg").addClass('on'); //대메뉴 오픈 배경 
			$(".mx_nav_bg_back").addClass('on'); //대메뉴 닫기 배경(반투명)
			
			$(".na_pc_btn").addClass('on'); //대메뉴 오픈시(닫기아이콘 변경)
			
			//메인적용(화이트 텍스트 => 블랙 텍스트)
/*
			if($("#main").is(".fp-viewing-brandmovie, .fp-viewing-info") === true) {
				//실버모드 변환
				$('.fix_header').addClass('bb');
				$('.fix_header').removeClass('bw');
	        }
*/
			
		} else{
			$(".top_navi_wrap").removeClass('on'); //대메뉴 원위치 
			$(".mx_nav_bg").removeClass('on'); //대메뉴 오픈배경 숨김
			$(".mx_nav_bg_back").removeClass('on'); //배경삭제(반투명)
			
			$(".na_pc_btn").removeClass('on'); //닫기
			
			//메인적용(블랙 텍스트 => 화이트 텍스트)
/*
			if($("#main").is(".fp-viewing-brandmovie, .fp-viewing-info") === true) {
				//실버모드 변환
				$('.fix_header').addClass('bw');
				$('.fix_header').removeClass('bb');
	        }
*/
			

		}//if
		
	});
	
	//pc네비 닫기(그레이 배경)
	$('.mx_nav_bg_back').click(function(){
	
		$(".top_navi_wrap").removeClass('on'); //대메뉴 원위치 
		$(".mx_nav_bg").removeClass('on'); //대메뉴 오픈배경 숨김
		$(".mxmo_nav_bg").removeClass('on'); //대메뉴 오픈 배경 
		$(".mx_nav_bg_back").removeClass('on'); //배경삭제(반투명)
		
		$(".na_pc_btn").removeClass('on'); //닫기
		
		$("html").css('overflow','auto');
		
/*
			if($("#main").is(".fp-viewing-brandmovie, .fp-viewing-info") === true) {
				//실버모드 변환
				$('.fix_header').addClass('bw');
				$('.fix_header').removeClass('bb');
	        }
*/
		
	});

	
	mql.addListener(function(e) {
	    if(e.matches) {	
	    
			$(".top_navi_wrap").removeClass('on'); //대메뉴 원위치 
			$(".mx_nav_bg").removeClass('on'); //대메뉴 오픈배경 숨김
			$(".mxmo_nav_bg").removeClass('on'); //대메뉴 오픈 배경 
			$(".mx_nav_bg_back").removeClass('on'); //배경삭제(반투명)
			
			$(".na_pc_btn").removeClass('on'); //닫기
			$(".na_mo_btn").removeClass('on'); //닫기
			
			$("html").css('overflow','auto');

//	        console.log('모바일 화면 입니다.');
	    } else {
	    
			$(".top_navi_wrap").removeClass('on'); //대메뉴 원위치 
			$(".mx_nav_bg").removeClass('on'); //대메뉴 오픈배경 숨김
			$(".mxmo_nav_bg").removeClass('on'); //대메뉴 오픈 배경 
			$(".mx_nav_bg_back").removeClass('on'); //배경삭제(반투명)
			
			$(".na_pc_btn").removeClass('on'); //닫기
			$(".na_mo_btn").removeClass('on'); //닫기
			
			$("html").css('overflow','auto');

//	        console.log('데스크탑 화면 입니다.');
	    }
	});
		
	/* -- 모바일 : 네비게이션 활성 끝	*/	
	
    
    
    
    
    
	/* 영문 정렬 시작 : 리스트 부분 */
	$('#type > li').each(function() {
		var _sort = $(this).children('a').text();

		switch (_sort){
			case '신상품' :
				$(this).children('a').text('NEW');
				break;
			case '상품명' :
				$(this).children('a').text('NAME');
				break;
			case '낮은가격' :
				$(this).children('a').text('LOW');
				break;
			case '높은가격' :
				$(this).children('a').text('HIGH');
				break;
			case '사용후기' :
				$(this).children('a').text('REVIEW');
				break;
			case '제조사' :
				$(this).children('a').text('MAKE');
				break;
			case '인기상품' :
				$(this).children('a').text('HOT');
				break;
			case '조회수' :
				$(this).children('a').text('HIT');
				break;
			case '좋아요' :
				$(this).children('a').text('LIKE');
				break;
			default :
				$(this).children('a').text('');
		}
	});	
	/* 영문 정렬 끝 */
	
	/* 영문 정렬 시작 : 검색부분 */
	$('.searchResult > ul > li').each(function() {
		var _sorts = $(this).text();

		switch (_sorts){
			case '신상품' :
				$(this).text('NEW');
				break;
			case '상품명' :
				$(this).text('NAME');
				break;
			case '낮은가격' :
				$(this).text('LOW');
				break;
			case '높은가격' :
				$(this).text('HIGH');
				break;
			case '사용후기' :
				$(this).text('REVIEW');
				break;
			case '제조사' :
				$(this).text('MAKE');
				break;
			case '인기상품' :
				$(this).text('HOT');
				break;
			case '조회수' :
				$(this).text('HIT');
				break;
			case '좋아요' :
				$(this).text('LIKE');
				break;
			default :
				$(this).text('');
		}
	});	
	/* 영문 정렬 끝 - 검색부분 */
	


    
});

// 메인 : 프리로더
var loader = $("#preloader");
window.addEventListener("load", function(){
	loader.css('opacity','0');
	loader.css('z-index','-1');
});


function lazyload_more()
{
	var lazyloadImages;    

	if ("IntersectionObserver" in window) {
		lazyloadImages = document.querySelectorAll(".lazy");
		var imageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var image = entry.target;
					image.src = image.dataset.src;
					image.onload = function(){ //로드 완료시
//						console.log('완료a');
						image.classList.remove("lazy");
					};
		//          image.classList.remove("lazy");
					imageObserver.unobserve(image);
		//          console.log(image);
				}//if
			});//foreach
		});
	
		lazyloadImages.forEach(function(image) {
			imageObserver.observe(image);
		});
		
	} else {  
	    var lazyloadThrottleTimeout;
	    lazyloadImages = document.querySelectorAll(".lazy");
	    
	    function lazyload() {
			if(lazyloadThrottleTimeout) {
				clearTimeout(lazyloadThrottleTimeout);
			}    
			lazyloadThrottleTimeout = setTimeout(function() {
				var scrollTop = window.pageYOffset;
				lazyloadImages.forEach(function(img) {
					if(img.offsetTop < (window.innerHeight + scrollTop)) {
						img.src = img.dataset.src;
						img.onload = function(){ //로드 완료시
//							console.log('완료b');
							img.classList.remove("lazy");
						};
			            //img.classList.remove('lazy');
					}//if
				});//foreach
	        
				if(lazyloadImages.length == 0) { 
					document.removeEventListener("scroll", lazyload);
					window.removeEventListener("resize", lazyload);
					window.removeEventListener("orientationChange", lazyload);
				}
	        
			}, 20);//setTimeout
		}//lazyload
	
	    document.addEventListener("scroll", lazyload);
	    window.addEventListener("resize", lazyload);
	    window.addEventListener("orientationChange", lazyload);
	}//if
	
	//메인
	var lazyloadBg;    

	if ("IntersectionObserver" in window) {
		lazyloadBg = document.querySelectorAll(".lazyb");
		var imageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var image = entry.target;
					//image.src = image.dataset.src;
					image.style = 'background-image:url('+image.dataset.src+')';
					image.classList.add("visible");
					image.classList.remove("lazyb");
//					console.log('완료c');

					imageObserver.unobserve(image);
				}//if
			});//foreach
		});
	
		lazyloadBg.forEach(function(image) {
			imageObserver.observe(image);
		});
		
	} else {  
	    var lazyloadThrottleTimeout;
	    lazyloadBg = document.querySelectorAll(".lazyb");
	    
	    function lazyload() {
			if(lazyloadThrottleTimeout) {
				clearTimeout(lazyloadThrottleTimeout);
			}    
			lazyloadThrottleTimeout = setTimeout(function() {
				var scrollTop = window.pageYOffset;
				lazyloadBg.forEach(function(img) {
					if(img.offsetTop < (window.innerHeight + scrollTop)) {
//						img.src = img.dataset.src;
						img.style = 'background-image:url('+image.dataset.src+')';
						img.classList.add("visible");
						img.classList.remove("lazyb");


			            //img.classList.remove('lazy');
					}//if
				});//foreach
	        
				if(lazyloadBg.length == 0) { 
					document.removeEventListener("scroll", lazyload);
					window.removeEventListener("resize", lazyload);
					window.removeEventListener("orientationChange", lazyload);
				}
	        
			}, 20);//setTimeout
		}//lazyload
	
	    document.addEventListener("scroll", lazyload);
	    window.addEventListener("resize", lazyload);
	    window.addEventListener("orientationChange", lazyload);
	}//if
	

}//lazyload_more


// 레이지 로드 : 리스트
document.addEventListener("DOMContentLoaded", function() {
	var lazyloadImages;      

	if ("IntersectionObserver" in window) {
		lazyloadImages = document.querySelectorAll(".lazy");
		var imageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var image = entry.target;
					image.src = image.dataset.src;
					image.onload = function(){ //로드 완료시
//						console.log('완료a');
						image.classList.remove("lazy");
					};
		//          image.classList.remove("lazy");
					imageObserver.unobserve(image);
		//          console.log(image);
				}//if
			});//foreach
		});
	
		lazyloadImages.forEach(function(image) {
			imageObserver.observe(image);
		});
		
	} else {  
	    var lazyloadThrottleTimeout;
	    lazyloadImages = document.querySelectorAll(".lazy");
	    
	    function lazyload() {
			if(lazyloadThrottleTimeout) {
				clearTimeout(lazyloadThrottleTimeout);
			}    
			lazyloadThrottleTimeout = setTimeout(function() {
				var scrollTop = window.pageYOffset;
				lazyloadImages.forEach(function(img) {
					if(img.offsetTop < (window.innerHeight + scrollTop)) {
						img.src = img.dataset.src;
						img.onload = function(){ //로드 완료시
//							console.log('완료b');
							img.classList.remove("lazy");
						};
			            //img.classList.remove('lazy');
					}//if
				});//foreach
	        
				if(lazyloadImages.length == 0) { 
					document.removeEventListener("scroll", lazyload);
					window.removeEventListener("resize", lazyload);
					window.removeEventListener("orientationChange", lazyload);
				}
	        
			}, 20);//setTimeout
		}//lazyload
	
	    document.addEventListener("scroll", lazyload);
	    window.addEventListener("resize", lazyload);
	    window.addEventListener("orientationChange", lazyload);
	}//if
});



// 레이지 로드 : 메인
document.addEventListener("DOMContentLoaded", function() {
	var lazyloadBg;    

	if ("IntersectionObserver" in window) {
		lazyloadBg = document.querySelectorAll(".lazyb");
		var imageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				
				if (entry.isIntersecting) {
					var image = entry.target;
					//image.src = image.dataset.src;
					image.style = 'background-image:url('+image.dataset.src+')';
					image.classList.add("visible");
					image.classList.remove("lazyb");
//					console.log('완료c');

					imageObserver.unobserve(image);
				}//if
				
			});//foreach
		});
	
		lazyloadBg.forEach(function(image) {
			imageObserver.observe(image);
		});
		
	} else {  
	    var lazyloadThrottleTimeout;
	    lazyloadBg = document.querySelectorAll(".lazyb");
	    
	    function lazyload() {
			if(lazyloadThrottleTimeout) {
				clearTimeout(lazyloadThrottleTimeout);
			}    
			lazyloadThrottleTimeout = setTimeout(function() {
				var scrollTop = window.pageYOffset;
				lazyloadBg.forEach(function(img) {
					if(img.offsetTop < (window.innerHeight + scrollTop)) {
//						img.src = img.dataset.src;
						img.style = 'background-image:url('+image.dataset.src+')';
						img.classList.add("visible");
						img.classList.remove("lazyb");


			            //img.classList.remove('lazy');
					}//if
				});//foreach
	        
				if(lazyloadBg.length == 0) { 
					document.removeEventListener("scroll", lazyload);
					window.removeEventListener("resize", lazyload);
					window.removeEventListener("orientationChange", lazyload);
				}
	        
			}, 20);//setTimeout
		}//lazyload
	
	    document.addEventListener("scroll", lazyload);
	    window.addEventListener("resize", lazyload);
	    window.addEventListener("orientationChange", lazyload);
	}//if
});

	
	
// 레이지 로드 : 리스트(페이지)
document.addEventListener("DOMContentLoaded", function() {
	var lazyloadPage;    

	if ("IntersectionObserver" in window) {
		lazyloadPage = document.querySelectorAll(".lazypage");
		
		var pageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				$(".typeMoreview a").trigger("onclick");
			});//foreach
		});
	
		lazyloadPage.forEach(function(page) {
			pageObserver.observe(page);
		});

		
	} else {  
	    var lazyloadThrottleTimeout;
		lazyloadPage = document.querySelectorAll(".lazypage");
	    
	    function lazypage() {
			if(lazypageThrottleTimeout) {
				clearTimeout(lazyloadThrottleTimeout);
			}    
			lazypageThrottleTimeout = setTimeout(function() {
				var scrollTop = window.pageYOffset;
				lazyloadPage.forEach(function(page) {
					if(page.offsetTop < (window.innerHeight + scrollTop)) {
						$(".typeMoreview a").trigger("onclick");
					}//if
				});//foreach
	        
				if(lazyloadPage.length == 0) { 
					document.removeEventListener("scroll", lazypage);
					window.removeEventListener("resize", lazypage);
					window.removeEventListener("orientationChange", lazypage);
				}
	        
			}, 20);//setTimeout
		}//lazyload
	
	    document.addEventListener("scroll", lazypage);
	    window.addEventListener("resize", lazypage);
	    window.addEventListener("orientationChange", lazypage);
	}//if
});
	

/**
 * 움직이는 배너 Jquery Plug-in
 * @author  cafe24
 */

(function($){

    $.fn.floatBanner = function(options) {
        options = $.extend({}, $.fn.floatBanner.defaults , options);

        return this.each(function() {
            var aPosition = $(this).position();
            var jbOffset = $(this).offset();
            var node = this;

            $(window).scroll(function() {
                var _top = $(document).scrollTop();
                _top = (aPosition.top < _top) ? _top : aPosition.top;

                setTimeout(function () {
                    var newinit = $(document).scrollTop();

                    if ( newinit > jbOffset.top ) {
                        _top -= jbOffset.top;
                        var container_height = $("#wrap").height();
                        var quick_height = $(node).height();
                        var cul = container_height - quick_height;
                        if(_top > cul){
                            _top = cul;
                        }
                    }else {
                        _top = 0;
                    }

                    $(node).stop().animate({top: _top}, options.animate);
                }, options.delay);
            });
        });
    };

    $.fn.floatBanner.defaults = {
        'animate'  : 500,
        'delay'    : 500
    };

})(jQuery);

/**
 * 문서 구동후 시작
 */
$(document).ready(function(){
	/* 로그인 탭메뉴 활성 */
	var log_url = location.search;
	var log_url_text = "noMemberOrder";
	var log_show = log_url.indexOf(log_url_text);
	//console.log($(ccc));

	if (log_show == 1){
		document.getElementById('login_box').style.display = "none";
		document.getElementById('login_tab').style.display = "block";
	}


    $('#banner:visible, #quick:visible').floatBanner();

    //placeholder
    $(".ePlaceholder input, .ePlaceholder textarea").each(function(i){
        var placeholderName = $(this).parents().attr('title');
        $(this).attr("placeholder", placeholderName);
    });
    /* placeholder ie8, ie9 */
    $.fn.extend({
        placeholder : function() {
            //IE 8 버전에는 hasPlaceholderSupport() 값이 false를 리턴
           if (hasPlaceholderSupport() === true) {
                return this;
            }
            //hasPlaceholderSupport() 값이 false 일 경우 아래 코드를 실행
            return this.each(function(){
                var findThis = $(this);
                var sPlaceholder = findThis.attr('placeholder');
                if ( ! sPlaceholder) {
                   return;
                }
                findThis.wrap('<label class="ePlaceholder" />');
                var sDisplayPlaceHolder = $(this).val() ? ' style="display:none;"' : '';
                findThis.before('<span' + sDisplayPlaceHolder + '>' + sPlaceholder + '</span>');
                this.onpropertychange = function(e){
                    e = event || e;
                    if (e.propertyName == 'value') {
                        $(this).trigger('focusout');
                    }
                };
                //공통 class
                var agent = navigator.userAgent.toLowerCase();
                if (agent.indexOf("msie") != -1) {
                    $(".ePlaceholder").css({"position":"relative"});
                    $(".ePlaceholder span").css({"position":"absolute", "padding":"0 4px", "color":"#878787"});
                    $(".ePlaceholder label").css({"padding":"0"});
                }
            });
        }
    });

    $(':input[placeholder]').placeholder(); //placeholder() 함수를 호출

    //클릭하면 placeholder 숨김
    $('body').delegate('.ePlaceholder span', 'click', function(){
        $(this).hide();
    });

    //input창 포커스 인 일때 placeholder 숨김
    $('body').delegate('.ePlaceholder :input', 'focusin', function(){
        $(this).prev('span').hide();
    });

    //input창 포커스 아웃 일때 value 가 true 이면 숨김, false 이면 보여짐
    $('body').delegate('.ePlaceholder :input', 'focusout', function(){
        if (this.value) {
            $(this).prev('span').hide();
        } else {
            $(this).prev('span').show();
        }
    });

    //input에 placeholder가 지원이 되면 true를 안되면 false를 리턴값으로 던져줌
    function hasPlaceholderSupport() {
        if ('placeholder' in document.createElement('input')) {
            return true;
        } else {
            return false;
        }
    }
});

/**
 *  썸네일 이미지 엑박일경우 기본값 설정
 */
$(window).load(function() {
    $("img.thumb,img.ThumbImage,img.BigImage").each(function($i,$item){
        var $img = new Image();
        $img.onerror = function () {
                $item.src="//img.echosting.cafe24.com/thumb/img_product_big.gif";
        }
        $img.src = this.src;
    });
        
});

/**
 *  tooltip
 */
$('.eTooltip').each(function(i){
    $(this).find('.btnClose').attr('tabIndex','-1');
});
//tooltip input focus
$('.eTooltip').find('input').focus(function() {
    var targetName = returnTagetName(this);
    targetName.siblings('.ec-base-tooltip').show();
});
$('.eTooltip').find('input').focusout(function() {
    var targetName = returnTagetName(this);
    targetName.siblings('.ec-base-tooltip').hide();
});
function returnTagetName(_this){
    var ePlacename = $(_this).parent().attr("class");
    var targetName;
    if(ePlacename == "ePlaceholder"){ //ePlaceholder 대응
        targetName = $(_this).parents();
    }else{
        targetName = $(_this);
    }
    return targetName;
}

/**
 *  eTab
 */
 $("body").delegate(".eTab a", "click", function(e){
    // 클릭한 li 에 selected 클래스 추가, 기존 li에 있는 selected 클래스는 삭제.
    var _li = $(this).parent("li").addClass("selected").siblings().removeClass("selected"),
    _target = $(this).attr("href"),
    _siblings = $(_target).attr("class"),
    _arr = _siblings.split(" "),
    _classSiblings = "."+_arr[0];

    //클릭한 탭에 해당하는 요소는 활성화, 기존 요소는 비활성화 함.
    $(_target).show().siblings(_classSiblings).hide();

    //preventDefault 는 a 태그 처럼 클릭 이벤트 외에 별도의 브라우저 행동을 막기 위해 사용됨.
    e.preventDefault();
});





//window popup script
function winPop(url) {
    window.open(url, "popup", "width=300,height=300,left=10,top=10,resizable=no,scrollbars=no");
}
/**
 * document.location.href split
 * return array Param
 */
function getQueryString(sKey)
{
    var sQueryString = document.location.search.substring(1);
    var aParam       = {};

    if (sQueryString) {
        var aFields = sQueryString.split("&");
        var aField  = [];
        for (var i=0; i<aFields.length; i++) {
            aField = aFields[i].split('=');
            aParam[aField[0]] = aField[1];
        }
    }

    aParam.page = aParam.page ? aParam.page : 1;
    return sKey ? aParam[sKey] : aParam;
};

$(document).ready(function(){

    // tab
    $.eTab = function(ul){
        $(ul).find('a').click(function(){
            var _li = $(this).parent('li').addClass('selected').siblings().removeClass('selected'),
                _target = $(this).attr('href'),
                _siblings = '.' + $(_target).attr('class');
            $(_target).show().siblings(_siblings).hide();
            return false
        });
    }
    if ( window.call_eTab ) {
        call_eTab();
    };

});

(function($){
$.fn.extend({
    center: function() {
        this.each(function() {
            var
                $this = $(this),
                $w = $(window);
            $this.css({
                position: "absolute",
                top: ~~(($w.height() - $this.outerHeight()) / 2) + $w.scrollTop() + "px",
                left: ~~(($w.width() - $this.outerWidth()) / 2) + $w.scrollLeft() + "px"
            });
        });
        return this;
    }
});
$(function() {
    var $container = function(){
    /*
	<div id="modalContainer">
	    <iframe id="modalContent" scroll="0" scrolling="no" frameBorder="0"></iframe>
	</div>');
	*/
	}.toString().slice(14,-3);
    $('body')
    .append($('<div id="modalBackpanel"></div>'))
    .append($($container));
    function closeModal () {
        $('#modalContainer').hide();
        $('#modalBackpanel').hide();
    }
    $('#modalBackpanel').click(closeModal);
    zoom = function ($piProductNo, $piCategoryNo, $piDisplayGroup) {
        var $url = '/product/image_zoom.html?product_no=' + $piProductNo + '&cate_no=' + $piCategoryNo + '&display_group=' + $piDisplayGroup;
        $('#modalContent').attr('src', $url);
        $('#modalContent').bind("load",function(){
            $(".header .close",this.contentWindow.document.body).bind("click", closeModal);
        });
        $('#modalBackpanel').css({width:$("body").width(),height:$("body").height(),opacity:.4}).show();
        $('#modalContainer').center().show();
    }
});
})(jQuery);
$(document).ready(function(){
    if (typeof(EC_SHOP_MULTISHOP_SHIPPING) != "undefined") {
        var sShippingCountryCode4Cookie = 'shippingCountryCode';
        var bShippingCountryProc = false;

        // 배송국가 선택 설정이 사용안함이면 숨김
        if (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShippingCountrySelection === false) {
            $('.xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist').hide();
            $('.xans-layout-multishoplist .xans-layout-multishoplistmultioption .xans-layout-multishoplistmultioptioncountry').hide();
        } else {
            $('.thumb .xans-layout-multishoplistitem').hide();
            var aShippingCountryCode = document.cookie.match('(^|;) ?'+sShippingCountryCode4Cookie+'=([^;]*)(;|$)');
            if (typeof(aShippingCountryCode) != 'undefined' && aShippingCountryCode != null && aShippingCountryCode.length > 2) {
                var sShippingCountryValue = aShippingCountryCode[2];
            }

            // query string으로 넘어 온 배송국가 값이 있다면, 그 값을 적용함
            var aHrefCountryValue = decodeURIComponent(location.href).split("/?country=");

            if (aHrefCountryValue.length == 2) {
                var sShippingCountryValue = aHrefCountryValue[1];
            }

            // 메인 페이지에서 국가선택을 안한 경우, 그 외의 페이지에서 셋팅된 값이 안 나오는 현상 처리
            if (location.href.split("/").length != 4 && $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val()) {
                $(".xans-layout-multishoplist .xans-layout-multishoplistmultioption a .ship span").text(" : "+$(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist option:selected").text().split("SHIPPING TO : ").join(""));

                if ($("#f_country").length > 0 && location.href.indexOf("orderform.html") > -1) {
                    $("#f_country").val($(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val());
                }
            }
            if (typeof(sShippingCountryValue) != "undefined" && sShippingCountryValue != "" && sShippingCountryValue != null) {
                sShippingCountryValue = sShippingCountryValue.split("#")[0];
                var bShippingCountryProc = true;

                $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val(sShippingCountryValue);
                $(".xans-layout-multishoplist .xans-layout-multishoplistmultioption a .ship span").text(" : "+$(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist option:selected").text().split("SHIPPING TO : ").join(""));
                var expires = new Date();
                expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30일간 쿠키 유지
                document.cookie = sShippingCountryCode4Cookie+'=' + $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val() +';path=/'+ ';expires=' + expires.toUTCString();
                if ($("#f_country").length > 0 && location.href.indexOf("orderform.html") > -1) {
                    $("#f_country").val(sShippingCountryValue).change();;
                }
            }
        }
        // 언어선택 설정이 사용안함이면 숨김
        if (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShippingLanguageSelection === false) {
            $('.xans-layout-multishopshipping .xans-layout-multishopshippinglanguagelist').hide();
            $('.xans-layout-multishoplist .xans-layout-multishoplistmultioption .xans-layout-multishoplistmultioptionlanguage').hide();
        } else {
            $('.thumb .xans-layout-multishoplistitem').hide();
        }

        // 배송국가 및 언어 설정이 둘 다 사용안함이면 숨김
        if (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShipping === false) {
            $(".xans-layout-multishopshipping").hide();
            $('.xans-layout-multishoplist .xans-layout-multishoplistmultioption').hide();
        } else if (bShippingCountryProc === false && location.href.split("/").length == 4) { // 배송국가 값을 처리한 적이 없고, 메인화면일 때만 선택 레이어를 띄움
            var sShippingCountryValue = $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val();
            $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val(sShippingCountryValue);
            $(".xans-layout-multishoplist .xans-layout-multishoplistmultioption a .ship span").text(" : "+$(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist option:selected").text().split("SHIPPING TO : ").join(""));
            // 배송국가 선택을 사용해야 레이어를 보이게 함
            if (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShippingCountrySelection === true) {
                $(".xans-layout-multishopshipping").show();
            }
        }

        $(".xans-layout-multishopshipping .close").bind("click", function() {
            $(".xans-layout-multishopshipping").hide();
        });

        $(".xans-layout-multishopshipping .ec-base-button a").bind("click", function() {
            var expires = new Date();
            expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30일간 쿠키 유지
            document.cookie = sShippingCountryCode4Cookie+'=' + $(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val() +';path=/'+ ';expires=' + expires.toUTCString();

            // 도메인 문제로 쿠키로 배송국가 설정이 안 되는 경우를 위해 query string으로 배송국가 값을 넘김
            var sQuerySting = (EC_SHOP_MULTISHOP_SHIPPING.bMultishopShippingCountrySelection === false) ? "" : "/?country="+encodeURIComponent($(".xans-layout-multishopshipping .xans-layout-multishopshippingcountrylist").val());

            location.href = '//'+$(".xans-layout-multishopshipping .xans-layout-multishopshippinglanguagelist").val()+sQuerySting;
        });
        $(".xans-layout-multishoplist .xans-layout-multishoplistmultioption a").bind("click", function() {
            $(".xans-layout-multishopshipping").show();
        });
    }
});
