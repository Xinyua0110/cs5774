/*
 * xBind Project 3 behavior
 * All page behavior is defined here; no inline JavaScript is used.
 */

$(function () {
  renderSimulatedSearch();
  initializeThresholdInteraction();
  initializeComparisonInteraction();
});

/*
 * Simulated search requirement.
 * The GET parameter q is read from the URL. The defined keyphrase is "RNA"
 * (case-insensitive). jQuery creates either result cards or a friendly message.
 */
function renderSimulatedSearch() {
  const $output = $("#search-output");
  if ($output.length === 0) {
    return;
  }

  const parameters = new URLSearchParams(window.location.search);
  const phrase = (parameters.get("q") || "").trim();
  const $summary = $("#search-summary");

  if (phrase.toLowerCase() === "rna") {
    $summary.text('Showing simulated matches for "' + phrase + '".');

    const results = [
      {
        title: "RNA-binding pilot",
        description: "Completed prediction for ribosomal protein S7 with 12 candidate RNA-contact residues.",
        url: "detail.html"
      },
      {
        title: "RBP validation",
        description: "A completed RNA partner analysis shared by Dr. Lee.",
        url: "projects.html"
      }
    ];

    const $list = $("<div>", { class: "search-result-list" });
    $.each(results, function (_index, result) {
      const $article = $("<article>", { class: "project-card search-result" });
      $("<h3>").text(result.title).appendTo($article);
      $("<p>").text(result.description).appendTo($article);
      $("<a>", { href: result.url, text: "Open result" }).appendTo($article);
      $list.append($article);
    });
    $output.append($list);
  } else {
    const displayPhrase = phrase || "your search";
    $summary.text('No simulated matches were found for "' + displayPhrase + '".');
    $("<div>", {
      class: "notice no-results",
      text: 'Try the keyphrase "RNA", or return to Projects to browse all prediction work.'
    }).appendTo($output);
    $("<a>", {
      class: "button button-secondary",
      href: "projects.html",
      text: "Browse projects"
    }).appendTo($output);
  }
}

/*
 * Interaction 1: change event plus DOM traversal.
 * Moving and releasing the range input modifies existing analysis elements and
 * adds a new status element that did not previously exist.
 */
function initializeThresholdInteraction() {
  $("#analysis-threshold").on("change", function () {
    const threshold = Number($(this).val()).toFixed(2);
    const remaining = Math.max(0, Math.round((1 - Number(threshold)) * 40));

    const $panel = $(this).closest(".threshold-panel");
    const $analysisGrid = $panel.next(".analysis-grid");
    const $structurePanel = $analysisGrid.find(".structure-panel");

    $panel.find("output").text(threshold);
    $structurePanel.find("h2").text("Structure view at threshold " + threshold);
    $analysisGrid.find("#residue-title").text(remaining + " residues above " + threshold);
    $structurePanel.toggleClass("high-threshold", Number(threshold) >= 0.75);

    $panel.find(".threshold-feedback").remove();
    $("<div>", {
      class: "threshold-feedback",
      role: "status",
      text: remaining === 0
        ? "No residues meet this threshold. Try a lower value."
        : "Analysis updated: " + remaining + " residues remain visible."
    }).appendTo($panel);
  });

  $(".threshold-panel").on("submit", function (event) {
    event.preventDefault();
    $("#analysis-threshold").trigger("change");
  });
}

/*
 * Interaction 2: delegated click handler.
 * The handler is attached to the table body rather than each button. It
 * modifies the selected row/button and adds a new item to the comparison tray.
 */
function initializeComparisonInteraction() {
  $("#project-table tbody").on("click", ".compare-button", function () {
    const $button = $(this);
    const $row = $button.closest("tr");
    const projectName = $row.find("th[scope='row']").text();
    const $tray = $("#comparison-tray");

    if ($row.hasClass("selected-for-comparison")) {
      return;
    }

    $row.addClass("selected-for-comparison");
    $button.text("Selected").prop("disabled", true);
    $tray.find("p").text("Selected projects:");
    $("<li>").text(projectName).appendTo($tray.find("ul"));
  });
}
