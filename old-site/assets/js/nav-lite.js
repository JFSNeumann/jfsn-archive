/*! nav-lite.js: tiny navbar + dropdown for Bootstrap-like markup (2.1 KB) */
(function () {
  // Mobile navbar toggler
  document.addEventListener("click", function (e) {
    var tgl = e.target.closest(".navbar-toggler");
    if (!tgl) return;
    var targetSel = tgl.getAttribute("data-bs-target") || tgl.getAttribute("data-target");
    if (!targetSel) return;
    var el = document.querySelector(targetSel);
    if (!el) return;
    el.classList.toggle("show");
    tgl.setAttribute("aria-expanded", el.classList.contains("show") ? "true" : "false");
  });

  // Dropdowns
  var on = function (el, ev, fn){ el.addEventListener(ev, fn, false); };
  var isTouch = matchMedia("(pointer: coarse)").matches;

  document.querySelectorAll(".dropdown").forEach(function (dd) {
    var btn = dd.querySelector("[data-bs-toggle='dropdown'], .dropdown-toggle");
    var menu = dd.querySelector(".dropdown-menu");
    if (!btn || !menu) return;

    var toggle = function(){ menu.classList.toggle("show"); dd.classList.toggle("show"); 
      btn.setAttribute("aria-expanded", dd.classList.contains('show') ? "true" : "false"); }

    if (isTouch) {
      on(btn, "click", function (e){ e.preventDefault(); toggle(); });
      on(document, "click", function (e){ if(!dd.contains(e.target)) { menu.classList.remove("show"); dd.classList.remove("show"); btn.setAttribute("aria-expanded","false"); }});
    } else {
      on(dd, "mouseenter", function(){ menu.classList.add("show"); dd.classList.add("show"); btn.setAttribute("aria-expanded","true"); });
      on(dd, "mouseleave", function(){ menu.classList.remove("show"); dd.classList.remove("show"); btn.setAttribute("aria-expanded","false"); });
      on(btn, "click", function (e){ e.preventDefault(); toggle(); });
    }
  });
})();
