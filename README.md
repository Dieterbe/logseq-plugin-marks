## Logseq Marks plugin

Manage marks (pointers) to track references to pages, from the page you want to be marked (pointed to).

E.g. if you do a periodic cleanup of your journals, for example a review which you may not always do exactly every week.
You may not remember exactly which was the last page that you finished.
This plugin lets you keep track of the last journal page that has been processed. When you're finished with your last journal page, just run "/mark"
to update the pointer to the current page.  Next time you can just check the marker and resume starting with the next page.

## How to use

* Use `/mark` to update the marking to point to your current page.
* Go to the "markings" page to see where your marking(s) point to.


![screenshot](./screenshot.png)

## Limitations

* uses hardcoded page name "markings" to append or modify markings records.  Be careful if you have an existing page with that name.  In future version the page name will be configurable.
* At this time there is only one marker, named default. In the future it will probably support multiple markers.
* only marks pages, not blocks.

### Running the code

- `npm install && npm run build` in terminal to install dependencies
