$(document).ready(function () {
  // GNB 스크롤 이벤트
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();

    // main 섹션을 벗어나면 GNB 크기 변경
    if (scroll > $(window).height()) {
      $(".gnb-fixed").addClass("scrolled");
    } else {
      $(".gnb-fixed").removeClass("scrolled");
    }

    // 스크롤 다운 표시 숨김 처리 (50px 이상 스크롤 시)
    if (scroll > 300) {
      $(".scroll-down").addClass("hidden");
    } else {
      $(".scroll-down").removeClass("hidden");
    }
  });

  // GNB 링크 클릭 이벤트 - 부드러운 스크롤
  $(".gnb a").click(function (e) {
    e.preventDefault();

    var target = $(this).attr("href");
    var targetOffset = $(target).offset().top;

    $("html, body").animate(
      {
        scrollTop: targetOffset,
      },
      800
    ); // 800ms 동안 부드럽게 스크롤
  });

  // 포트폴리오 섹션 탭메뉴

  $(".portfolio-tabs .tab").click(function () {
    var tabNumber = $(this).attr("data-tab");

    // 모든 탭에서 active 클래스 제거
    $(".portfolio-tabs .tab").removeClass("active");

    // 클릭한 탭에 active 클래스 추가
    $(this).addClass("active");

    // 모든 콘텐츠 숨김
    $(".portfolio-content").removeClass("active");

    // 해당 번호의 콘텐츠만 표시
    $('.portfolio-content[data-content="' + tabNumber + '"]').addClass(
      "active"
    );
  });

  // 디자인섹션 스와이퍼
  var currentSlide = 0;
  var totalSlides = $(".slide-item").length;
  var slideWidth = 530; // 이미지 width(500px) + gap(30px)

  // 인디케이터 dots 생성
  for (var i = 0; i < totalSlides; i++) {
    $(".slider-dots").append('<span class="dot"></span>');
  }

  // 첫 번째 dot 활성화
  $(".slider-dots .dot").first().addClass("active");

  // 슬라이드 위치 업데이트 함수
  function updateSlide() {
    var translateX = -(currentSlide * slideWidth);
    $(".design-slider").css("transform", "translateX(" + translateX + "px)");

    // dot 활성화 업데이트
    $(".slider-dots .dot").removeClass("active");
    $(".slider-dots .dot").eq(currentSlide).addClass("active");
  }

  // 다음 버튼 클릭
  $(".next-btn").click(function () {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlide();
    }
  });

  // 이전 버튼 클릭
  $(".prev-btn").click(function () {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlide();
    }
  });

  // dot 클릭 이벤트
  $(".slider-dots").on("click", ".dot", function () {
    currentSlide = $(this).index();
    updateSlide();
  });

  // 터치/스와이프 이벤트 (모바일)
  var startX = 0;
  var moveX = 0;
  var isDragging = false;

  $(".design-img").on("mousedown touchstart", function (e) {
    isDragging = true;
    startX =
      e.type === "mousedown" ? e.pageX : e.originalEvent.touches[0].pageX;
    $(".design-slider").css("transition", "none");
  });

  $(document).on("mousemove touchmove", function (e) {
    if (!isDragging) return;

    moveX = e.type === "mousemove" ? e.pageX : e.originalEvent.touches[0].pageX;
    var diff = moveX - startX;
    var translateX = -(currentSlide * slideWidth) + diff;

    $(".design-slider").css("transform", "translateX(" + translateX + "px)");
  });

  $(document).on("mouseup touchend", function (e) {
    if (!isDragging) return;

    isDragging = false;
    $(".design-slider").css("transition", "transform 0.5s ease");

    var diff = moveX - startX;

    // 50px 이상 움직였을 때만 슬라이드 변경
    if (diff > 50 && currentSlide > 0) {
      currentSlide--;
    } else if (diff < -50 && currentSlide < totalSlides - 1) {
      currentSlide++;
    }

    updateSlide();
    moveX = 0;
  });

  //

  // 키보드 화살표 키 지원
  $(document).keydown(function (e) {
    if (e.keyCode === 37 && currentSlide > 0) {
      // 왼쪽 화살표
      currentSlide--;
      updateSlide();
    } else if (e.keyCode === 39 && currentSlide < totalSlides - 1) {
      // 오른쪽 화살표
      currentSlide++;
      updateSlide();
    }
  });
});
