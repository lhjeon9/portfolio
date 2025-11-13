$(document).ready(function () {
  // ============================================
  // 1. GNB 관련 기능
  // ============================================

  // 스크롤 이벤트로 GNB 크기 조절
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".gnb-fixed").addClass("scrolled");
    } else {
      $(".gnb-fixed").removeClass("scrolled");
    }
  });

  // GNB 클릭 시 부드러운 스크롤 이동
  $(".gnb a").click(function (e) {
    e.preventDefault();

    const target = $(this).attr("href");
    const gnbHeight = $(".gnb-fixed").outerHeight();

    // main 섹션일 경우 최상단으로 이동
    if (target === "#main") {
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        600
      );
    } else {
      // 다른 섹션은 GNB 바로 아래로 이동
      const targetOffset = $(target).offset().top - gnbHeight;
      $("html, body").animate(
        {
          scrollTop: targetOffset,
        },
        600
      );
    }
  });

  // 현재 섹션에 따라 GNB 메뉴 활성화
  $(window).scroll(function () {
    const scrollPos = $(window).scrollTop();
    const gnbHeight = $(".gnb-fixed").outerHeight();

    $(".gnb a").each(function () {
      const target = $(this).attr("href");
      if ($(target).length) {
        const targetTop = $(target).offset().top - gnbHeight - 10;
        const targetBottom = targetTop + $(target).outerHeight();

        if (scrollPos >= targetTop && scrollPos < targetBottom) {
          $(".gnb a").removeClass("active");
          $(this).addClass("active");
        }
      }
    });
  });

  // ============================================
  // 2. Portfolio 탭 기능
  // ============================================

  $(".portfolio-tabs .tab").click(function () {
    const tabNumber = $(this).data("tab");

    // 탭 활성화
    $(".portfolio-tabs .tab").removeClass("active");
    $(this).addClass("active");

    // 컨텐츠 표시
    $(".portfolio-content").removeClass("active");
    $('.portfolio-content[data-content="' + tabNumber + '"]').addClass(
      "active"
    );
  });

  // ============================================
  // 3. Design 섹션 가로 스크롤 기능
  // ============================================

  (function () {
    var $section = $("#design");
    var $slider = $(".design-slider");
    var $container = $(".design-img");
    var $items = $slider.children(".slide-item");
    var gap = 30; // 슬라이드 간 간격
    var count = $items.length;

    if (count === 0) return;

    // 도트 생성
    $(".slider-dots").empty();
    for (var i = 0; i < count; i++) {
      $(".slider-dots").append('<span class="dot"></span>');
    }

    // 슬라이드 복제 (무한 스크롤 효과용)
    $slider.append($items.clone());

    // 치수 계산 함수
    function calcSizes() {
      var itemWidth = $items.first().outerWidth();
      return {
        itemWidth: itemWidth,
        itemFull: itemWidth + gap,
        singleWidth: (itemWidth + gap) * count,
        containerWidth: $container.width(),
      };
    }

    var sizes = calcSizes();
    // 슬라이더 전체 너비 (원본 + 복제)
    $slider.css("width", sizes.singleWidth * 2 + "px");

    var offset = 0; // 현재 가로 스크롤 오프셋
    var maxOffset = Math.max(0, sizes.singleWidth - sizes.containerWidth);

    // 도트 업데이트 함수
    function updateDotsByOffset() {
      var idx = Math.floor(offset / sizes.itemFull) % count;
      $(".slider-dots .dot").removeClass("active").eq(idx).addClass("active");
    }

    updateDotsByOffset();

    // 이벤트 바인딩 상태 추적
    var bound = false;

    // Design 섹션 진입 시 이벤트 바인딩
    function enterDesign() {
      if (bound) return;
      bound = true;

      // 휠 이벤트 바인딩
      $(window).on("wheel.design", wheelHandler);

      // 터치 이벤트 바인딩
      $container
        .on("touchstart.design", touchStart)
        .on("touchmove.design", touchMove)
        .on("touchend.design", touchEnd);

      // 리사이즈 이벤트 바인딩
      $(window).on("resize.design", resizeHandler);
    }

    // Design 섹션 이탈 시 이벤트 언바인딩
    function leaveDesign() {
      if (!bound) return;
      bound = false;
      $(window).off("wheel.design");
      $container.off(".design");
      $(window).off("resize.design");
    }

    // 리사이즈 핸들러
    function resizeHandler() {
      sizes = calcSizes();
      $slider.css("width", sizes.singleWidth * 2 + "px");
      maxOffset = Math.max(0, sizes.singleWidth - $container.width());

      // 오프셋 범위 제한
      offset = Math.max(0, Math.min(offset, maxOffset));
      $slider.css("transform", "translateX(" + -offset + "px)");
      updateDotsByOffset();
    }

    // 휠 이벤트 핸들러
    function wheelHandler(e) {
      var delta = e.originalEvent.deltaY;

      // 가로 스크롤 가능한 경우
      if ((delta > 0 && offset < maxOffset) || (delta < 0 && offset > 0)) {
        e.preventDefault();
        offset += delta;
        offset = Math.max(0, Math.min(offset, maxOffset));
        $slider.css("transform", "translateX(" + -offset + "px)");
        updateDotsByOffset();
        return;
      }

      // 마지막까지 스크롤했고 아래로 스크롤 시 다음 섹션으로
      if (delta > 0 && offset >= maxOffset) {
        e.preventDefault();
        leaveDesign();
        var gnbH = $(".gnb-fixed").outerHeight() || 0;
        $("html, body").animate(
          {
            scrollTop: $("#contact").offset().top - gnbH,
          },
          400
        );
        return;
      }

      // 처음이고 위로 스크롤 시 이전 섹션으로
      if (delta < 0 && offset <= 0) {
        e.preventDefault();
        leaveDesign();
        var gnbH2 = $(".gnb-fixed").outerHeight() || 0;
        $("html, body").animate(
          {
            scrollTop: $("#portfolio").offset().top - gnbH2,
          },
          400
        );
        return;
      }
    }

    // 터치 이벤트 처리
    var touchStartY = 0;
    var touchStartOffset = 0;

    function touchStart(e) {
      if (!e.originalEvent.touches || !e.originalEvent.touches.length) return;
      touchStartY = e.originalEvent.touches[0].pageY;
      touchStartOffset = offset;
    }

    function touchMove(e) {
      if (!e.originalEvent.touches || !e.originalEvent.touches.length) return;
      var y = e.originalEvent.touches[0].pageY;
      var dy = touchStartY - y;

      // 가로 스크롤 가능한 경우
      if ((dy > 0 && offset < maxOffset) || (dy < 0 && offset > 0)) {
        e.preventDefault();
        offset = touchStartOffset + dy;
        offset = Math.max(0, Math.min(offset, maxOffset));
        $slider.css("transform", "translateX(" + -offset + "px)");
        updateDotsByOffset();
        return;
      }

      // 마지막까지 스크롤했고 아래로 스크롤 시
      if (dy > 0 && offset >= maxOffset) {
        e.preventDefault();
        leaveDesign();
        var gnbH3 = $(".gnb-fixed").outerHeight() || 0;
        $("html, body").animate(
          {
            scrollTop: $("#contact").offset().top - gnbH3,
          },
          400
        );
        return;
      }

      // 처음이고 위로 스크롤 시
      if (dy < 0 && offset <= 0) {
        e.preventDefault();
        leaveDesign();
        var gnbH4 = $(".gnb-fixed").outerHeight() || 0;
        $("html, body").animate(
          {
            scrollTop: $("#portfolio").offset().top - gnbH4,
          },
          400
        );
        return;
      }
    }

    function touchEnd(e) {
      // 필요시 추가 처리
    }

    // 이전/다음 버튼 클릭
    $(".prev-btn").on("click", function () {
      offset -= sizes.itemFull || calcSizes().itemFull;
      if (offset < 0) offset = 0;
      $slider.css("transform", "translateX(" + -offset + "px)");
      updateDotsByOffset();
    });

    $(".next-btn").on("click", function () {
      offset += sizes.itemFull || calcSizes().itemFull;
      maxOffset = Math.max(0, calcSizes().singleWidth - $container.width());
      if (offset > maxOffset) offset = maxOffset;
      $slider.css("transform", "translateX(" + -offset + "px)");
      updateDotsByOffset();
    });

    // 도트 클릭
    $(".slider-dots").on("click", ".dot", function () {
      var idx = $(this).index();
      var itemF = sizes.itemFull || calcSizes().itemFull;
      offset = idx * itemF;
      maxOffset = Math.max(0, calcSizes().singleWidth - $container.width());
      if (offset > maxOffset) offset = maxOffset;
      $slider.css("transform", "translateX(" + -offset + "px)");
      updateDotsByOffset();
    });

    // 스크롤 위치에 따라 Design 섹션 진입/이탈 감지
    function checkScrollForDesign() {
      var gnbH = $(".gnb-fixed").outerHeight() || 0;
      var scrollTop = $(window).scrollTop();
      var sectionTop = $section.offset().top - gnbH - 5;
      var sectionBottom = sectionTop + $section.outerHeight();

      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        enterDesign();
      } else {
        leaveDesign();
      }
    }

    $(window).on("scroll", checkScrollForDesign);
    checkScrollForDesign(); // 초기 체크
  })();

  // ============================================
  // 4. Top 버튼 기능
  // ============================================

  $(".top-btn").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      600
    );
  });

  // 스크롤 시 Top 버튼 표시/숨김
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".top-btn").fadeIn();
    } else {
      $(".top-btn").fadeOut();
    }
  });
});
