//NOTE: ENTER doesnt work for some reason. Hit END instead to get results

function alignImageMiddleHorizontally(ID) {
	$(ID).css({left: ($(ID).parent().width() / 2) - ($(ID).width() / 2)});
}

function alignImageMiddleVertically(ID) {
	$(ID).css({top: ($(ID).parent().height() / 2) - ($(ID).height() / 2)});
}


//---------------SEARCHBAR STUFF------------------


function setSearchBarActive() {
	removeHandle();

	$("#line-on-search-bar").one("animationend", function() {

		expandSearchBar();

		$("#search-bar").one("animationend", function() {
			makeCrossVisible();
			addCross();

			$("#cross-on-search-bar-line-1").one("animationend", function() {
				activateTextField();
				hideExplanationText();
				$("#search-bar").off("click");

				$("#text-field").keypress(function(event) {
					// for some reason "13" which is ENTER doesn't have any effect.
					// "35" which is END works totally fine. 
					if (event.keyCode == 35) {
						fetchInfoFromWikipedia($("#text-field").val());
					}
				}); 

				$("#cross").on("click", function() {
					removeWikipediaResults();
					setSearchBarInactive();
				});
			});
		});
	});
}

function setSearchBarInactive() {
	removeCross();
	$("#cross-on-search-bar-line-1").one("animationend", function() {
		makeCrossInvisible();
		contractSearchBar();

		$("#search-bar").one("animationend", function() {
			addHandle();

			deactivateTextField();
			showExplanationText();

			$("#cross").off("click");
			$("#search-bar").on("click", function() {
				setSearchBarActive();
			});
		});
	});
}

function expandSearchBar() {
	$("#search-bar").css({"animation-name": "expand",
						  "animation-duration": "0.2s",
						  "animation-iteration-count": "1",
						  "animation-timing-function": "linear"
						 });

	$("#search-bar").css({"width": "200px"});
	$("#search-bar").css({"left": "0px"});
}
function contractSearchBar() {
	$("#search-bar").css({"animation-name": "contract",
						  "animation-duration": "0.2s",
						  "animation-iteration-count": "1",
						  "animation-timing-function": "linear"
						 });

	$("#search-bar").css({"width": "40px"});
	$("#search-bar").css({"left": "80px"});
}

function removeHandle() {
	$("#line-on-search-bar").css({"animation-name": "remove",
								  "animation-duration": "0.2s",
								  "animation-iteration-count": "1",
								  "animation-timing-function": "linear"
								 });

	$("#line-on-search-bar").css({"width": "0px"});
	$("#line-on-search-bar").css({"border-width": "0px"});
}

function addHandle() {
	$("#line-on-search-bar").css({"animation-name": "add",
								  "animation-duration": "0.2s",
								  "animation-iteration-count": "1",
								  "animation-timing-function": "linear"
								 });

	$("#line-on-search-bar").css({"width": "15px"});
	$("#line-on-search-bar").css({"border-width": "1px"});
}

function addCross() {
	$("#cross-on-search-bar-line-1").css({"animation-name": "moveFromBottomLeft",
										  "animation-duration": "0.2s",
										  "animation-iteration-count": "1",
										  "animation-timing-function": "linear"
										 });
	
	$("#cross-on-search-bar-line-2").css({"animation-name": "moveFromTopLeft",
										  "animation-duration": "0.2s",
										  "animation-iteration-count": "1",
										  "animation-timing-function": "linear"
										 });

	$("#cross-on-search-bar-line-1").css({"transform": "translateX(2px) translateY(8px) rotate(45deg)"});
	$("#cross-on-search-bar-line-2").css({"transform": "translateX(2px) translateY(6px) rotate(135deg)"});
}

function removeCross() {
	$("#cross-on-search-bar-line-1").css({"animation-name": "moveToBottomLeft",
										  "animation-duration": "0.2s",
										  "animation-iteration-count": "1",
										  "animation-timing-function": "linear"
										 });
	
	$("#cross-on-search-bar-line-2").css({"animation-name": "moveToTopLeft",
										  "animation-duration": "0.2s",
										  "animation-iteration-count": "1",
										  "animation-timing-function": "linear"
										 });

	$("#cross-on-search-bar-line-1").css({"transform": "translateX(-73px) translateY(24px) rotate(45deg)"});
	$("#cross-on-search-bar-line-2").css({"transform": "translateX(-73px) translateY(-16px) rotate(135deg)"});
}

function makeCrossInvisible() {
	$("#cross-on-search-bar-line-1").css({"border-color": "transparent"});
	$("#cross-on-search-bar-line-2").css({"border-color": "transparent"});
}

function makeCrossVisible() {
	$("#cross-on-search-bar-line-1").css({"border-color": "rgba(255, 165, 0, 1)"});
	$("#cross-on-search-bar-line-2").css({"border-color": "rgba(255, 165, 0, 1)"});
}

function activateTextField() {
	$("#text-field").css({"display": "inline",
						  "visibility": "visible"
						 });
}

function deactivateTextField() {
	$("#text-field").css({"display": "none",
						  "visibility": "hidden"
						 });
}

function hideExplanationText() {
	$("#explanation-text").html("");
}

function showExplanationText() {
	$("#explanation-text").html("Click icon to search");
}


//---------------WIKIPEDIA STUFF------------------

var searchResults = [];
var wikipediaEvent = new Event("retrievedAllWikipediaInfo");
var NUMBER_OF_WIKIPEDIA_ARTICLES = 10;

function fetchInfoFromWikipedia(searchWord) {
	var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + searchWord + "&srlimit=" + NUMBER_OF_WIKIPEDIA_ARTICLES + "srprop=&origin=*&format=json";
	getWikipediaData(url, getSnippetResponsesFromWikipedia);
}

function getSnippetResponsesFromWikipedia(data) {
	var titles = data.query.search.map(function(value) {
		return value.title;
	});

	for (var i = 0; i < titles.length; i++) {
		var url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=1&titles=" + titles[i] + "&origin=*&format=json";
		getWikipediaData(url, addWikipediaInfo);
	} 
}

function addWikipediaInfo(data) {
	var id = Object.keys(data.query.pages)[0];
	var title = data.query.pages[id].title;
	var rawSnippet = data.query.pages[id].extract;

	var processedSnippet = trimSnippet(rawSnippet);

	var link = "https://en.wikipedia.org/?curid=" + id;

	searchResults.push({id: id, data: {title: title, snippet: processedSnippet, link: link}});

	if (searchResults.length == NUMBER_OF_WIKIPEDIA_ARTICLES) {
		document.dispatchEvent(wikipediaEvent);
	}
}

function trimSnippet(snippet) {
	var newSnippet = "";
	var code = false;
	for (var i = 0; i < snippet.length; i++) {
		if (snippet[i] == "<") {
			code = true;
			continue;
		}
		if (snippet[i] == ">") {
			code = false;
			continue;
		}
		if (code) {
			continue;
		}
		newSnippet += snippet[i];
	}
	return newSnippet;
}


function getWikipediaData(url, callback) {
	var info = new XMLHttpRequest();
    // Asynchronous HTTP request
    info.open( "GET", url, true );
    info.send();
    info.onreadystatechange = function(error) {
        if (info.readyState == 4 && info.status == 200) {
            console.log("successfully retrieved response from the server");
            var data = JSON.parse(info.responseText);

            callback(data);
        }
        else {
            //console.error("Error", error);
        }
    }
}

function renderWikipediaResults() {
	$("#initial-page").css({top: "40px"});

	var height = (NUMBER_OF_WIKIPEDIA_ARTICLES * 130) + 400;
	$("#background").css({height: height});

	var listHtml = "";

	for (var i = 0; i < searchResults.length; i++) {
		listHtml += "<li>" + renderOneWikipediaResult(searchResults[i].data.title, searchResults[i].data.snippet, searchResults[i].data.link) + "</li>\n";
	}
	alignImageMiddleHorizontally("#wikipedia-list");
	$("#wikipedia-list").html(listHtml);

	$("#wikipedia-list").css({display:"inline"});

	createOrangeHover();
}

function createOrangeHover() {
	$(".list-item").hover(function() {
		$(this).find(".active-bar").css({"background-color": "orange"});
	}, function() {
		$(this).find(".active-bar").css({"background-color": "white"});
	});
}

function renderOneWikipediaResult(title, text, link) {
	var html = "";
	html += "<a class=black-text-link href=" + link + " style=text-decoration:none>";
	html += "<div class=list-item>";
	html += "<div class=active-bar></div>";
	html += "<div class=list-title>" + title + "</div>";
	html += "<div class=list-text>" + text + "</div>";
	html += "</div>";
	html += "</a>";
	return html;
}

function removeWikipediaResults() {
	searchResults = [];
	$("#wikipedia-list").css({display:"none"});
	$("#background").css({height: "100%"});
	alignImageMiddleVertically("#initial-page");
}


$(document).ready(function() {

	document.addEventListener("retrievedAllWikipediaInfo", renderWikipediaResults); 

	alignImageMiddleHorizontally("#initial-page");
	alignImageMiddleVertically("#initial-page");
	alignImageMiddleHorizontally("#search-bar");

	$("#search-bar").on("click", function() {
		setSearchBarActive();
	});
});