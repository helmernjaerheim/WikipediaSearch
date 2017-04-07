# WikipediaSearch

Web application for searching for wikipedia articles. It's a task specified by [freecodecamp](https://www.freecodecamp.com/). 

You can type a search word and get an arbitrary amount of search results of wikipedia articles related to the search word. The amount of search results can be modified by changing the variable called "NUMBER_OF_WIKIPEDIA_ARTICLES".

It works fine in Firefox.

In Google Chrome the search function doesn't work.

In Internet Explorer nothing works. Even the alignment fails. 

### Wikipedia API

[The Wikipedia search API](https://www.mediawiki.org/wiki/API:Search) provides a good overview of search parameters to use. In this case two types of API calls are made.

The first one returns a list of result titles based on a search word:
https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={search_word}&srlimit={number_search_results}srprop=&origin=&ast&format=json

* action=query: Allows us to get informaton about wikipedia articles.
* list=search: States that we want a list of wikipedia articles.
* srsearch={search_word}: Searches for wikipedia articles related to search_word.
* srlimit={number_search_results}: Returns an amount of wikipedia articles equal to number_search_results.
* srprop=: States what information we want about each article. Now we only get title.
* origin=&ast: This avoids the cross-domain issue when using the wikipedia API.
* format=json: Specifies that the result will be returned as a JSON object.

The second one is run for every title that is returned by the first call:
https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=1&titles={title}&origin=&ast&format=json

* prop=extracts: Specifies that we want the intro text.
* exsentences=1: Specifies that we only want the first sentence of the intro text.
* titles={title}: Get the information from the wikipedia article with this title.

### NOTE!

Normally you would press enter when you want to search after typing in the search word, but for some reason the enter button has no effect. Hence, right now the END button is used as a substitute. 
