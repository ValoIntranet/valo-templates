function ValoNewsPrev(compId: string) {
  var firstElmFound = false;
  var elms = document.querySelectorAll("#" + compId + " .ms-sm4");
  // Check if elements were found
  if (elms && elms.length > 0) {
    var processedItems = 0;
    // Check if the first item of the list is shown, if not, the list can be moved
    if (elms[0].classList.contains("hidden")) {
      for (var i = 1; i < elms.length; i++) {
        var prevElm = elms[i - 1];
        var crntElm = elms[i];
        // First visible item needs to be hidden
        if (!firstElmFound && !crntElm.classList.contains("hidden")) {
          prevElm.classList.toggle("hidden");
          firstElmFound = true;
          processedItems = 2;
        } else if (firstElmFound) {
          processedItems++;
          // All items lower than 3 need to be shown
          if (processedItems <= 3) {
            crntElm.classList.remove("hidden");
          }
          // All greater than 3 need to be hidden
          if (processedItems > 3) {
            crntElm.classList.add("hidden");
          }
        }
      }
    }
  }
}

function ValoNewsNext(compId: string) {
  var firstElmFound = false;
  var elms = document.querySelectorAll("#" + compId + " .ms-sm4");
  // Check if elements were found
  if (elms && elms.length > 0) {
    var processedItems = 0;
    // Check if the last item of the list is shown, if not, the list can be moved
    if (elms[elms.length - 1].classList.contains("hidden")) {
      for (var i = 0; i < elms.length; i++) {
        var crntElm = elms[i];
        // First visible item needs to be hidden
        if (!firstElmFound && !crntElm.classList.contains("hidden")) {
          crntElm.classList.toggle("hidden");
          firstElmFound = true;
        } else if (firstElmFound) {
          processedItems++;
          // All items lower than 3 need to be shown
          if (processedItems <= 3) {
            crntElm.classList.remove("hidden");
          }
          // All greater than 3 need to be hidden
          if (processedItems > 3) {
            crntElm.classList.add("hidden");
          }
        }
      }
    }
  }
}
