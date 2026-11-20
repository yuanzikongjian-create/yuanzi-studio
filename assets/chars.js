(function () {
  var root = document.querySelector("[data-char-carousel]");
  if (!root) return;
  var list = root.querySelector(".char-data");
  if (!list) return;
  var items = [];
  var nodes = list.children;
  for (var n = 0; n < nodes.length; n++) {
    var li = nodes[n];
    if (!li || li.tagName !== "LI") continue;
    var h3 = li.querySelector("h3");
    var p = li.querySelector("p");
    var img = li.getAttribute("data-img") || "";
    var card = li.getAttribute("data-card") || img;
    items.push({
      name: h3 ? h3.textContent.replace(/\s+/g, " ").trim() : "",
      line: p ? p.textContent.replace(/\s+/g, " ").trim() : "",
      img: img,
      card: card
    });
  }
  var total = items.length;
  if (!total) return;

  var prevLabel = root.getAttribute("data-prev") || "Previous";
  var nextLabel = root.getAttribute("data-next") || "Next";
  var closeLabel = root.getAttribute("data-close") || "Close";

  var ui = document.createElement("div");
  ui.className = "char-ui";
  var prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "char-nav prev";
  prevBtn.setAttribute("aria-label", prevLabel);
  prevBtn.textContent = "‹";
  var stage = document.createElement("div");
  stage.className = "char-stage";
  var nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "char-nav next";
  nextBtn.setAttribute("aria-label", nextLabel);
  nextBtn.textContent = "›";
  ui.appendChild(prevBtn);
  ui.appendChild(stage);
  ui.appendChild(nextBtn);

  var caption = document.createElement("div");
  caption.className = "char-caption";
  var capName = document.createElement("h3");
  var capLine = document.createElement("p");
  caption.appendChild(capName);
  caption.appendChild(capLine);

  list.setAttribute("hidden", "");
  root.insertBefore(ui, list.nextSibling);
  root.insertBefore(caption, ui.nextSibling);
  root.classList.add("is-on");

  var index = 0;
  function wrap(k) { return ((k % total) + total) % total; }

  function makeSlot(pos, item) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "char-slot" + (pos === 0 ? " is-center" : pos < 0 ? " is-left" : " is-right");
    if (item.card) {
      var im = document.createElement("img");
      im.src = item.card;
      im.alt = item.name;
      im.decoding = "async";
      btn.appendChild(im);
    } else {
      var ph = document.createElement("span");
      ph.className = "char-ph";
      ph.textContent = item.name;
      btn.appendChild(ph);
    }
    if (pos === 0) {
      btn.setAttribute("aria-current", "true");
      btn.setAttribute("aria-label", item.name);
    } else {
      btn.setAttribute("aria-label", item.name);
    }
    btn.addEventListener("click", function () {
      if (swiped) return;
      if (pos === 0) openModal(item);
      else go(pos);
    });
    return btn;
  }

  function render() {
    while (stage.firstChild) stage.removeChild(stage.firstChild);
    if (total >= 2) stage.appendChild(makeSlot(-1, items[wrap(index - 1)]));
    stage.appendChild(makeSlot(0, items[wrap(index)]));
    if (total >= 3) stage.appendChild(makeSlot(1, items[wrap(index + 1)]));
    var cur = items[index];
    capName.textContent = cur.name;
    capLine.textContent = cur.line;
    var showNav = total > 1;
    prevBtn.hidden = !showNav;
    nextBtn.hidden = !showNav;
  }

  function go(delta) {
    index = wrap(index + delta);
    render();
  }

  prevBtn.addEventListener("click", function () { go(-1); });
  nextBtn.addEventListener("click", function () { go(1); });

  var startX = null, startY = null, swiped = false;
  stage.addEventListener("touchstart", function (e) {
    var t = e.changedTouches[0];
    startX = t.clientX;
    startY = t.clientY;
    swiped = false;
  }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (startX == null) return;
    var t = e.changedTouches[0];
    var dx = t.clientX - startX;
    var dy = t.clientY - startY;
    startX = null;
    startY = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swiped = true;
      go(dx < 0 ? 1 : -1);
    }
  });

  var modal = document.createElement("div");
  modal.className = "char-modal";
  modal.hidden = true;
  modal.innerHTML =
    '<div class="char-modal-backdrop" data-close="1"></div>' +
    '<div class="char-modal-box" role="dialog" aria-modal="true" aria-labelledby="char-modal-title">' +
    '<button type="button" class="char-modal-close" data-close="1"></button>' +
    '<div class="char-modal-img"></div>' +
    '<h3 id="char-modal-title"></h3>' +
    '<p></p></div>';
  modal.querySelector(".char-modal-close").setAttribute("aria-label", closeLabel);
  modal.querySelector(".char-modal-close").textContent = "×";
  document.body.appendChild(modal);
  var lastFocus = null;

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openModal(item) {
    lastFocus = document.activeElement;
    var wrapImg = modal.querySelector(".char-modal-img");
    while (wrapImg.firstChild) wrapImg.removeChild(wrapImg.firstChild);
    if (item.img) {
      var im = document.createElement("img");
      im.src = item.img;
      im.alt = item.name;
      wrapImg.appendChild(im);
    }
    modal.querySelector("h3").textContent = item.name;
    modal.querySelector("p").textContent = item.line;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".char-modal-close").focus();
  }
  modal.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-close")) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (!modal.hidden) {
      if (e.key === "Escape") closeModal();
      return;
    }
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  render();
})();
