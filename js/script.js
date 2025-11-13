$(document).ready(function () {
  // GNB 고정 높이 변수 설정 (부드러운 스크롤 계산에 사용)
  // CSS의 .gnb-fixed 높이와 일치해야 합니다.
  const GNB_HEIGHT = 80;

  // ============================================
  // 1. GNB 관련 기능
  // ============================================
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".gnb-fixed").addClass("scrolled");
    } else {
      $(".gnb-fixed").removeClass("scrolled");
    }

    // 스크롤 시 GNB 활성화 및 Top 버튼 체크 함수 호출 (아래 3번 항목)
    updateGNBActive();
    checkTopButtonVisibility();
  });

  // 2. GNB 클릭 시 부드러운 스크롤 이동
  $(".gnb a").click(function (e) {
    e.preventDefault();

    const target = $(this).attr("href");

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
      const targetOffset = $(target).offset().top - GNB_HEIGHT;
      $("html, body").animate(
        {
          scrollTop: targetOffset,
        },
        600
      );
    }
  });

  // 3. 현재 섹션에 따라 GNB 메뉴 활성화
  function updateGNBActive() {
    const scrollPos = $(window).scrollTop();

    $("section").each(function () {
      const offsetTop = $(this).offset().top;
      // GNB 높이를 고려하여 섹션의 시작점을 조정
      const sectionStart = offsetTop - GNB_HEIGHT - 10; // 10px 여유 공간
      const sectionEnd = sectionStart + $(this).outerHeight();
      const sectionId = $(this).attr("id");

      if (scrollPos >= sectionStart && scrollPos < sectionEnd) {
        $(".gnb a").removeClass("active");
        $('.gnb a[href="#' + sectionId + '"]').addClass("active");
      }
    });
    // 최상단 (main 섹션) 특별 처리
    if (scrollPos < GNB_HEIGHT) {
      $(".gnb a").removeClass("active");
      $('.gnb a[href="#main"]').addClass("active");
    }
  }

  // 초기 로드 시 및 스크롤 시 호출
  updateGNBActive();

  // 스크롤 다운 표시 숨김 처리 (300px 이상 스크롤 시)
  if (scroll > 150) {
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
    0.8
  ); // 800ms 동안 부드럽게 스크롤
});

// ============================================
// 2. Portfolio 섹션 탭 기능
// ============================================

$(".portfolio-tabs .tab").click(function () {
  var tabNumber = $(this).data("tab");

  // 탭 활성화

  // 모든 탭에서 active 클래스 제거
  $(".portfolio-tabs .tab").removeClass("active");
  // 클릭한 탭에 active 클래스 추가
  $(this).addClass("active");

  // 컨텐츠 표시
  // 모든 콘텐츠 숨김
  $(".portfolio-content").removeClass("active");
  // 해당 번호의 콘텐츠만 표시
  $('.portfolio-content[data-content="' + tabNumber + '"]').addClass("active");
});

// ============================================
// 3. Design 섹션 가로 스크롤 기능
// ============================================

(function () {
  const $section = $(".design");
  const $slider = $(".design-slider");
  const $container = $(".design-img");
  let offset = 0;
  let totalItems = 0;
  let maxOffset = 0;
  let sizes = {}; // 크기 정보를 저장할 객체

  // 크기 계산 함수
  const calcSizes = () => {
    const itemWidth = $slider.find(".slide-item").first().outerWidth(true);
    const containerWidth = $container.width();
    totalItems = $slider.find(".slide-item").length;
    const totalWidth = itemWidth * totalItems; // 슬라이더 전체 길이

    // 슬라이드 하나의 너비 (itemFull)
    const itemF = itemWidth;

    // 전체 슬라이더가 뷰포트를 넘어가는 총 너비
    const singleWidth = totalWidth;

    // Max Offset (최대 스크롤 가능 거리: 전체 너비 - 뷰포트 너비)
    maxOffset = Math.max(0, singleWidth - containerWidth);

    sizes = {
      itemWidth,
      containerWidth,
      totalItems,
      singleWidth,
      itemFull: itemF, // 슬라이더 이동 단위
      maxOffset,
    };
    return sizes;
  };

  // 슬라이더 초기화 및 도트 생성
  const initSlider = () => {
    sizes = calcSizes();
    $slider.css("width", sizes.singleWidth); // 슬라이더 전체 너비 설정

    // 도트 생성
    const $dots = $(".slider-dots");
    $dots.empty();
    // 슬라이드 아이템 개수만큼 도트 생성 (단, 뷰포트에 꽉 차는 경우 1개만 생성)
    // 여기서는 뷰포트와 무관하게 아이템 개수만큼 생성합니다.
    for (let i = 0; i < sizes.totalItems; i++) {
      $dots.append('<div class="dot" data-index="' + i + '"></div>');
    }
    updateDotsByOffset();
  };

  // 현재 오프셋에 따라 도트 활성화 업데이트
  const updateDotsByOffset = () => {
    const { itemFull } = sizes;
    if (!itemFull) return;

    // 현재 오프셋을 아이템 너비로 나누어 현재 활성화된 아이템 인덱스를 추정
    // 소수점 반올림을 사용하여 가장 가까운 아이템 인덱스를 찾습니다.
    const currentIdx = Math.round(offset / itemFull);

    $(".slider-dots .dot").removeClass("active");
    // 현재 인덱스가 유효한 범위 내에 있는지 확인
    if (currentIdx >= 0 && currentIdx < totalItems) {
      $('.slider-dots .dot[data-index="' + currentIdx + '"]').addClass(
        "active"
      );
    } else if (currentIdx >= totalItems) {
      // 마지막 아이템 초과 시 마지막 아이템 활성화
      $(".slider-dots .dot:last").addClass("active");
    } else {
      // 0 미만 시 첫 번째 아이템 활성화
      $(".slider-dots .dot:first").addClass("active");
    }
  };

  // Design 섹션 진입 시 슬라이드 활성화 (가로 스크롤 대체)
  const enterDesign = () => {
    $("body").addClass("horizontal-scrolling");
    // Design 섹션 내부에서만 스크롤 이벤트를 가로 슬라이드로 변환하는 로직 추가 가능
  };

  // Design 섹션 이탈 시 슬라이드 비활성화
  const leaveDesign = () => {
    $("body").removeClass("horizontal-scrolling");
  };

  // 창 크기 변경 시 재계산
  $(window).on("resize", function () {
    initSlider(); // 크기 재계산 및 도트 재생성
    // 오프셋을 재계산된 maxOffset 범위 내로 조정
    offset = Math.min(offset, calcSizes().maxOffset);
    $slider.css("transform", "translateX(" + -offset + "px)");
    updateDotsByOffset();
  });

  // 초기화 호출
  initSlider();

  // 다음 버튼 클릭
  $(".next-btn").on("click", function () {
    const { itemFull, maxOffset } = sizes;
    if (!itemFull || maxOffset === 0) return; // 아이템 크기 없거나 스크롤할 내용이 없으면 중단

    // 한 번에 한 아이템 너비만큼 이동
    offset += itemFull;

    // 최대 오프셋을 넘지 않도록 보정
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    $slider.css("transform", "translateX(" + -offset + "px)");
    updateDotsByOffset();
  });

  // 이전 버튼 클릭
  $(".prev-btn").on("click", function () {
    const { itemFull } = sizes;
    if (!itemFull) return;

    // 한 번에 한 아이템 너비만큼 이동
    offset -= itemFull;

    // 0 미만으로 내려가지 않도록 보정
    if (offset < 0) {
      offset = 0;
    }
    $slider.css("transform", "translateX(" + -offset + "px)");
    updateDotsByOffset();
  });

  // 도트 클릭
  $(".slider-dots").on("click", ".dot", function () {
    const idx = $(this).data("index");
    const { itemFull, maxOffset } = sizes;
    if (!itemFull) return;

    offset = idx * itemFull;

    // 최대 오프셋을 넘지 않도록 보정
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    $slider.css("transform", "translateX(" + -offset + "px)");
    updateDotsByOffset();
  });

  // 스크롤 위치에 따라 Design 섹션 진입/이탈 감지
  function checkScrollForDesign() {
    const scrollTop = $(window).scrollTop();
    // GNB 높이를 고려하여 섹션의 시작점 계산
    const sectionTop = $section.offset().top - GNB_HEIGHT - 5;
    const sectionBottom = sectionTop + $section.outerHeight();

    if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
      enterDesign();
    } else {
      leaveDesign();
    }
  }

  $(window).on("scroll", checkScrollForDesign);
  checkScrollForDesign(); // 초기 체크

  // ============================================
  // 4. Top 버튼 기능
  // ============================================

  const TOP_BUTTON_THRESHOLD = 500; // 500px 이상 스크롤 시 버튼 표시

  function checkTopButtonVisibility() {
    if ($(window).scrollTop() > TOP_BUTTON_THRESHOLD) {
      $(".top-btn").fadeIn(300);
    } else {
      $(".top-btn").fadeOut(300);
    }
  }

  $(".top-btn").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      600
    );
  });

  // 초기 체크
  checkTopButtonVisibility();
});
