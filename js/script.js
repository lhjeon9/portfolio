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
});
