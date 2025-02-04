document.addEventListener("DOMContentLoaded", function () {
    // 스크롤시 보이는 메뉴
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $(".headerArea").outerHeight();

    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        if (Math.abs(lastScrollTop - st) <= delta) return;

        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            $(".headerArea").removeClass("down").addClass("up");
            jQuery(".mega_menu").removeClass("on");
        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $(".headerArea").removeClass("up").addClass("down");
            }
            if (st < navbarHeight) {
                $(".headerArea").removeClass("down");
            }
        }
        lastScrollTop = st;
    }

    // 호버 시 상세 네비게이션 표시
    $(".headerArea").hover(
        function () {
            $(this).addClass("down").removeClass("up");
            $(".mega_menu").addClass("on");
        },
        function () {
            if ($(window).scrollTop() > navbarHeight) {
                $(this).removeClass("down").addClass("up");
                $(".mega_menu").removeClass("on");
            }
        }
    );
});

document.addEventListener("DOMContentLoaded", function () {
//     // 스크롤시 보이는 메뉴
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $(".headerArea").outerHeight();

    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        if (Math.abs(lastScrollTop - st) <= delta) return;

        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            $(".headerArea").removeClass("down").addClass("up");
            jQuery(".mega_menu").removeClass("on");
        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $(".headerArea").removeClass("up").addClass("down");
            }
            if (st < navbarHeight) {
                $(".headerArea").removeClass("down");
            }
        }
        lastScrollTop = st;
    }

    // 팝업
    function layer_open(no) {
        jQuery(".pop_wrap[layer=" + no + "]").fadeIn();
        $(".pop_wrap[layer=" + no + "] .pop").fadeIn();
        jQuery("body, html").addClass("on");
    };
    function layer_close() {
        jQuery(".pop_wrap, .pop_wrap .pop").fadeOut();
        jQuery("body, html").removeClass("on");
    };

    //해당 버튼 클릭시 해당 레이어팝업 호출
    jQuery(".open_pop").click(function() {
        var no = jQuery(this).attr("layer");
        layer_open(no);
        jQuery("body, html").addClass("on");
    });
    jQuery(".pop .close").click(function() {
        layer_close();
    });

    $(".nav-icon").click(function () {
        if ($(".navbar").hasClass("active") == true) {
            $(".mo .header_btn .language").addClass("on");
        } else {
            $(".mo .header_btn .language").removeClass("on");
        }
    });

    //MOBILE MENU
    jQuery("header .nav .nav-icon").click(function () {
        jQuery(this).toggleClass("active");
        jQuery("header .navbar").toggleClass("active");
        jQuery("html, body").toggleClass("hidden");

        // 현재페이지 메뉴 열기
        if ($(".navbar>li").hasClass("current-menu-ancestor") === true) {
           // $(".current-menu-ancestor").addClass("open");
            $(".current-menu-ancestor").addClass("active");
            jQuery(".navbar>li.current-menu-ancestor>.sub-menu").stop().slideDown();
        }
    });
    jQuery(document).on("click",".nav .navbar.active>li.menu-item-has-children > a",
        function () {
            jQuery(this).removeAttr("href");
            var is_display = jQuery(this).next(".sub-menu").css("display");
            if (is_display == "block") {
                jQuery(this).next(".navbar>li>.sub-menu").stop().slideUp();
                jQuery(this).parent("li").removeClass("active");
                jQuery(this).parent("li").removeClass("open");                           

            }  else {
                jQuery(".navbar>li>.sub-menu").stop().slideUp();
                jQuery(this).next(".navbar>li>.sub-menu").stop().slideDown();
                jQuery(".nav .navbar.active>li.menu-item-has-children").removeClass("active");
                jQuery(this).parent("li").addClass("active");
            }                   
            return false;
            
        }
    );

    //Top 버튼
    jQuery(".to-top").click(function () {
        jQuery("html, body").animate(
            {
                scrollTop: 0,
            },
            400
        );
        return false;
    });

    jQuery("textarea").change(function () {
        var current_val = jQuery(this).val();

        current_val = current_val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        current_val = current_val
            .replace(/'/g, "&quot;")
            .replace(/"/g, "&#39;");
        current_val = current_val.replace(/(<([^>]+)>)/gi, "");
        jQuery(this).val(current_val);
    });

    //게시판 검색
    jQuery("#keyword").keydown(function (key) {
        if (key.keyCode == 13) {
            jQuery("#keyword_btn").trigger("click");
        }
    });
    jQuery("#keyword_btn").click(function () {
        if (document.location.hash && document.location.hash != "#1") {
            document.location.hash = "#1";
        }
        jQuery(this).parents("form").submit();
    });



    //좋아요 버튼
    // jQuery(document).on("click", ".btn_like", function(event) {
    //     jQuery(this).addClass("on")
    // });
    // jQuery(document).on("click", ".btn_like.on", function(event) {
    //     jQuery(this).removeClass("on")
    // });

    //관심매장 버튼
    // jQuery(document).on("click", ".bookmark", function(event) {
    //     jQuery(this).addClass("on")
    // });
    // jQuery(document).on("click", ".bookmark.on", function(event) {
    //     jQuery(this).removeClass("on")
    // });

    // 북마크 버튼
    $(document).on(
        "click",
        "#post_list .btn-mybook, #post_list_nogrid .btn-mybook, #post_list_works .btn-mybook",
        function () {
            let post_id = $(this).data("post_id");
            let bookmark = getBookmark();
            // let bookmark = handleStorage.getStorage("bookmark");
            // if (!bookmark) {
            //     bookmark = [];
            // } else {
            //     // bookmark = bookmark.split(",");
            //     bookmark = getParamToArrayInt(bookmark); // 숫자로 된 배열로 리턴
            // }

            if (bookmark.indexOf(post_id) === -1) {
                bookmark.push(Number(post_id));
                $(this).addClass("on");
                console.log("add bookmark: ", bookmark);
                // #post_list .btn-mybook 클릭 시 #post_list_nogrid .btn-mybook 도 on 클래스 추가
                $("#post_list .btn-mybook[data-post_id=" + post_id + "]").addClass("on");
                $("#post_list_nogrid .btn-mybook[data-post_id=" + post_id + "]").addClass("on");
            } else {
                // post_id가 bookmark에 있으면 삭제
                deleteArray(bookmark, post_id);
                $(this).removeClass("on");
                console.log("delete bookmark: ", bookmark);
                $("#post_list .btn-mybook[data-post_id=" + post_id + "]").removeClass("on");
                $("#post_list_nogrid .btn-mybook[data-post_id=" + post_id + "]").removeClass("on");
            }
            handleStorage.setStorage("bookmark", bookmark);
            // console.log('after: ', bookmark);
            // console.log('getStorage: ', handleStorage.getStorage("bookmark"));
        }
    );

    // 전달 받은 파라미터를 ,로 구분하여 배열로 리턴, 배열 값은 숫자로 변환
    // function getParamToArrayInt(param) {
    //     if (!param) return [];
    //     return param.split(",").map(function (item) {
    //         return Number(item);
    //     });
    // }

    //해당 버튼 클릭시 해당 레이어팝업 호출
    // jQuery(".open_pop").click(function() {
    //     var no = jQuery(this).attr("layer");
    //     layer_open(no);
    //     jQuery("body, html").addClass("on");
    // });
    jQuery(".pop .close").click(function () {
        layer_close();
    });

    // 준비중
    $(".soon").click(function (event) {
        event.preventDefault();
        generateModalHTML(
            "<span>서비스 준비중입니다.</span><br>곧 오픈 예정이니 조금만 기다려 주세요."
        ); // common.js
    });

    // 레이어팝업 닫기 버튼 이벤트 핸들러 /template-parts/popup.html
    $(document).on(
        "click",
        "#btn_alert_close, .dim, .layer_close",
        function () {
            // $(".layer_alert").removeClass("on");
            // $(".dim").fadeOut();
            // // 0.5초 후 생성한 코드 삭제
            // setTimeout(function () {
            //     const container = document.getElementById("container_layer_alert");
            //     container.innerHTML = "";
            // }, 500);
        }
    );


    // 검섹
    $(document).on(
        "click",
        ".btn-search",
        function () {
            console.log('btn-search');
            // this 근처에 있는 input 태그의 값을 가져옴
            let search = $(this).siblings(".searck_box_keyword").val();
            // const search = $(".searck_box_keyword").val();
            // const search = document.getElementById("search-box-keyword").value;

            search = search.trim();

            if(!search) {
                if(ICL_LANGUAGE_CODE == 'ko') {
                    alert("검색어를 입력해주세요.");
                } else if (ICL_LANGUAGE_CODE == 'en') {    
                    alert("Please enter a search term.");
                }
                // generateModalHTML("SEARCH", "검색어를 입력해주세요.", 0, "alert"); // common.js
                // $(this).siblings(".searck_box_keyword").attr("placeholder", "검색어를 입력해주세요.");
                return false;
            }

            // search 인코딩
            // search = encodeURIComponent(search);
            
            // 검색어에 #이 포함되어 있으면 #을 제거
            if (search.indexOf("#") !== -1) {
                // search = encodeURIComponent(search);
                search = search.replace("#", "");
                if(ICL_LANGUAGE_CODE == 'ko') {
                    location.href = "/search/tag/" + search;
                } else if(ICL_LANGUAGE_CODE == 'en') {
                    location.href = "/en/search/tag/" + search;
                }
            }  else {
                // search = encodeURIComponent(search);
                if(ICL_LANGUAGE_CODE == 'ko') {
                    location.href = "/search/keyword/all/" + search;
                } else if (ICL_LANGUAGE_CODE == 'en') {
                    location.href = "/en/search/keyword/all/" + search;
                }
            }
        }

        
    );


    //xss 방지
    jQuery("input[type=text],input[type=tel], textarea").on(
        "propertychange change keyup paste input",
        function () {
            var current_value = jQuery(this).val();
            current_value = current_value.replace(/</gi, "");
            current_value = current_value.replace(/>/gi, "");
            current_value = current_value.replace("'", "");
            current_value = current_value.replace('"', "");
            jQuery(this).val(current_value);
        }
    );


    // 검색
    $(".searck_box_keyword").on("input", function () {
        const pattern = /[.,~!@$%^&*()_+|?:;{}\/]/g;
        
        let currentValue = $(this).val();
        let newValue = currentValue.replace(pattern, " ");
        
        // 연속된 공백을 하나의 공백으로 치환
        newValue = newValue.replace(/\s+/g, " ");
        
        // 앞뒤 공백 제거
        newValue = newValue.trim();
        
        if (currentValue !== newValue) {
            $(this).val(newValue);
        }
        
        if (event.keyCode === 13) {
            $(this).siblings(".btn-search").trigger("click");
        }
    });


    // $(".searck_box_keyword").keyup(function (key) {

    //     // 특수문자 제거 [] 포함
    //     // const pattern = /[.,~!@#$%^&*()_+|<>?:{}]/;
    //     // const pattern = /[.,~!@$%^&*()_+|<>?:;{}\[\]]/;
    //     // const pattern = /[.,~!@$%^&*+|?:;{}]/;
    //     // 특수문자 제거 "/" 포함
    //     // const pattern = /[.,~!@$%^&*()_+|<>?:;{}\/]/;
    //     const pattern = /[.,~!@$%^&*()_+|?:;{}\/]/;

    //     // 특수문자 입력 시 제거
    //     if (pattern.test($(this).val())) {
    //         $(this).val(
    //             $(this)
    //                 .val()
    //                 .replace(pattern, "")
    //         );
    //     }
        


    //     if (key.keyCode == 13) {
    //         // this 근처에 있는 .btn-search 버튼을 클릭
    //         $(this).siblings(".btn-search").trigger("click");
    //         // $(".btn-search").trigger("click");
    //     }
    // });

    // 검색 팝업 닫기
    $(document).on("click", "#btn_alert_close", function () {
                //닫기
                $(".pop_wrap, .pop_wrap .pop").fadeOut();
                $("body, html").removeClass("on");
        
    });

});

// get 파리미터 가져오기
function getUrlParam(name) {
    // 한글 파리미터 인코딩
    var search = unescape(encodeURIComponent(location.search));
    search = decodeURIComponent(search);

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var isEmpty = function (value) {
    if (
        value == "false" ||
        value == 0 ||
        value == "" ||
        value == null ||
        value == undefined ||
        (value != null &&
            typeof value == "object" &&
            !Object.keys(value).length)
    ) {
        return true;
    } else {
        return false;
    }
};

// 배열 내 모든값 변경
function updateArray(myArray, oldValue, newValue) {
    if (!myArray instanceof Array) return;
    myArray.forEach(function () {
        const index = myArray.indexOf(oldValue);
        if (index !== -1) myArray[index] = newValue;
    });
}

function deleteArray(myArray, value) {
    if (!myArray instanceof Array) return;
    // myArray.forEach(function(element, index, array) { // 파라미터 : 현재아이템, 인덱스, 배열
    //     if(element==value) myArray.splice(index, 1);
    // });
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i] === value) {
            myArray.splice(i, 1);
            i--; //forEach를 안쓰고 for를 쓰면서 i--;를 하는 이유는 배열 삭제 후 길이가 -1이 되기 때문
        }
    }
}

// 이메일 형식 체크
function check_email(user_email) {
    var reg = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg.test(user_email)) {
        return false;
    } else {
        return true;
    }
}
// 비밀번호체크 8~20 대소문자,숫자,특수문자
function check_password(user_password) {
    var reg =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!reg.test(user_password)) {
        return false; // 부적절한 조합
    } else {
        return true;
    }
}

// 휴대폰번호 체크
function check_phone_cell(user_phone_cell) {
    // var reg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/; // "-"가 있던 없던 무시
    var reg = /^010-?([0-9]{4})-?([0-9]{4})$/; // "-"가 있던 없던 무시
    if (!reg.test(user_phone_cell)) {
        return false; // 부적절한 조합
    } else {
        return true;
    }
}

// 인증번호 체크
function check_phone_cell_auth_number(user_phone_cell_auth_number) {
    // var reg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/; // "-"가 있던 없던 무시
    var reg = /^([0-9]{6})$/; // "-"가 있던 없던 무시
    if (!reg.test(user_phone_cell_auth_number)) {
        return false; // 부적절한 조합
    } else {
        return true;
    }
}

function replace_phone_cell(phone) {
    // 두번째 하이픈이 표시되지 않음
    if (phone)
        return phone
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
            .replace(/\-{1,2}$/g, ""); // xxx-xxxx-xxxx
    // if(phone) return phone.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, ""); // xx-xxxx-xxxx
    // return false;
}

function replace_phone(value) {
    if (!value) {
        return "";
    }

    value = value.replace(/[^0-9]/g, "");

    let result = [];
    let restNumber = "";

    // 지역번호와 나머지 번호로 나누기
    if (value.startsWith("02")) {
        // 서울 02 지역번호
        result.push(value.substr(0, 2));
        restNumber = value.substring(2);
    } else if (value.startsWith("1")) {
        // 지역 번호가 없는 경우
        // 1xxx-yyyy
        restNumber = value;
    } else {
        // 나머지 3자리 지역번호
        // 0xx-yyyy-zzzz
        result.push(value.substr(0, 3));
        restNumber = value.substring(3);
    }

    if (restNumber.length === 7) {
        // 7자리만 남았을 때는 xxx-yyyy
        result.push(restNumber.substring(0, 3));
        result.push(restNumber.substring(3));
    } else {
        result.push(restNumber.substring(0, 4));
        result.push(restNumber.substring(4));
    }

    return result.filter((val) => val).join("-");
}

// 날짜체크
function check_date(date) {
    var regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
    if (regex.text(date)) return true;
    return false;
}

function replace_date(date) {
    // 두번째 하이픈이 표시되지 않음
    date = date.replace(/[^0-9]/g, "");
    if (date.length > 8)
        return date
            .substring(0, date.length - 1)
            .replace(/^(\d{0,4})(\d{0,2})(\d{0,2})$/g, "$1-$2-$3")
            .replace(/\-{1,2}$/g, "");
    // console.log(date);
    // console.log(date.length);
    // if(date) return date.replace(/^(\d{0,4})(\d{0,2})(\d{0,2})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, ""); // xxx-xxxx-xxxx
    // if(date) return date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    if (date)
        return date
            .replace(/^(\d{0,4})(\d{0,2})(\d{0,2})$/g, "$1-$2-$3")
            .replace(/\-{1,2}$/g, ""); // xx-xxxx-xxxx
    // return false;
}

// 모바일확인
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

// 받침이 있는 문자인지 확인 함수
const isSingleCharacter = function (text) {
    var strGa = 44032; // 가
    var strHih = 55203; // 힣

    var lastStrCode = text.charCodeAt(text.length - 1);

    if (lastStrCode < strGa || lastStrCode > strHih) {
        return false; //한글이 아닐 경우 false 반환
    }
    return (lastStrCode - strGa) % 28 == 0;
};

// '로' 가 붙어야 하는지 '으로'가 붙어야 하는지 체크해주는 함수
const roChecker = function (text) {
    return text + (isSingleCharacter(text) ? "로" : "으로");
};
// '를' 이 붙어야 하는지 '을'이 붙어야 하는지를 체크해주는 함수
const rulChecker = function (text) {
    return text + (isSingleCharacter(text) ? "를" : "을");
};

const gaChecker = function (text) {
    return text + (isSingleCharacter(text) ? "가" : "이");
};

var getCookie = function (name) {
    var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    return value ? value[2] : null;
};

var setCookie = function (name, value, exp) {
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie =
        name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
};

var deleteCookie = function (name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1999 00:00:10 GMT;path=/";
};

/* 스토리지 제어 함수 정의 */
var handleStorage = {
    // 스토리지에 데이터 쓰기(이름, 만료일)
    setStorage: function (name, data) {
        // 만료 시간 구하기(exp를 ms단위로 변경)
        // var date = new Date();
        // date = date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);

        // 로컬 스토리지에 저장하기 (값을 따로 저장하지 않고 만료 시간을 저장)
        if(ICL_LANGUAGE_CODE == 'en') name = name + '_en';
        // console.log('setStorage: ', name);
        localStorage.setItem(name, data);
    },
    // 스토리지 읽어오기
    getStorage: function (name) {
        // var now = new Date();
        // now = now.setTime(now.getTime());
        // 현재 시각과 스토리지에 저장된 시각을 각각 비교하여 시간이 남아 있으면 true, 아니면 false 리턴
        // return parseInt(localStorage.getItem(name)) > now;
        // 현재 시각과 스토리지에 저장된 시각을 각각 비교하여 시간이 남아 있으면 저장된 값을 리턴, 아니면 false 리턴
        // if (parseInt(localStorage.getItem(name)) > now) {
        //     return localStorage.getItem(name);
        // } else {
        //     return false;
        // }
        
        if(ICL_LANGUAGE_CODE == 'en') name = name + '_en';
        // console.log('getStorage: ', name);
        return localStorage.getItem(name);
    },
};

function getBookmark() {

    let bookmark = handleStorage.getStorage("bookmark");

    if (!bookmark) {
        return [];
        // bookmark = [];
    } else {
        if (!bookmark) return [];
        return bookmark.split(",").map(function (item) {
            return Number(item);
        });
    }

    // console.log('getStorage: ', bookmark);
}

// 팝업
// function layer_open(no) {
//     jQuery(".pop_wrap[layer=" + no + "]").fadeIn();
//     $(".pop_wrap[layer=" + no + "] .pop").fadeIn();
//     jQuery("body, html").addClass("on");
// };
function layer_close() {
    jQuery(".pop_wrap, .pop_wrap .pop").fadeOut();
    jQuery("body, html").removeClass("on");
}

// 레이어팝업 생성
function generateModalHTML(title, message, data = "", action = "default") {
    fetch(modalFilePath)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // <p class="txt"> 요소의 내용을 가져옴
            // const txtContent = doc.querySelector("#modal_text").innerHTML;

            // 필요에 따라 내용을 수정
            // const content = '<a href="mailto:contact@jbrix.co.kr">contact@jbrix.co.kr</a>메일로<br>회원아이디와 비밀번호를 인증할 수 있는 메일이 발송되었습니다.';

            // <p class="txt"> 요소의 내용을 수정된 내용으로 변경
            doc.querySelector("#modal_title").innerHTML = title;
            doc.querySelector("#modal_text").innerHTML = message;

            // 수정된 내용이 적용된 HTML을 가져옴
            const dynamicHTML = doc.documentElement.innerHTML;

            // 동적으로 생성된 HTML을 컨테이너 요소에 추가
            const container = document.getElementById("container_layer_alert");
            container.innerHTML = dynamicHTML;
            // document.body.innerHTML += dynamicHTML; // body에 직접 추가

            // 어떤 팝업인지 구분하기 위해 container 에 data-action 속성 추가
            // document.getElementById("btn_alert_confirm").setAttribute("data-action", action);
            
            document
                .getElementById("btn_alert_confirm")
                .setAttribute("data-post_id", data);
            document
                .getElementById("btn_alert_confirm")
                .setAttribute("data-action", action);

            if(action == 'alert') {
                $("#btn_alert_cancel").hide();
                // $("#btn_alert_confirm").hide();
            }

            if(ICL_LANGUAGE_CODE == 'en') {
                $("#btn_alert_cancel").text("Cancel"); $("#btn_alert_confirm").text("Confirm");
            }

            // $(".layer_alert").addClass("on");
            // $(".dim").css("display", "block").animate({ opacity: 1 }, 300);

            $("#layer_modal, #layer_modal .pop").fadeIn();
            // $("#layer_modal .pop").fadeIn();
            $("body, html").addClass("on");
        })
        .catch((error) => console.error("HTML 가져오기 오류:", error));
}