## Logseq Marks plugin

Manage marks (pointers) to track references to pages, from the page you want to be marked (pointed to).

E.g. if you do a periodic cleanup of your journals, for example a review which you may not always do exactly every week.
You may not remember exactly which was the last page that you finished.
This plugin lets you keep track of the last journal page that has been processed. When you're finished with your last journal page, just run "/mark"
to update the pointer to the current page.  Next time you can just check the mark and resume starting with the next page.

## How to use

* In Plugin settings, configure which page you want to use to manage the marks (default: "marks")
* Use `/mark` to update the mark to point to your current page.
* Go to the marks page to see where your mark(s) point to.


![screenshot-marks-page](./screenshot-marks-page.png)
![screenshot-menu](./screenshot-menu.png)

## Limitations

* Limited support for multiple marks: at startup, we add menu shortcuts for all defined marks (as well as "default") 
  In the future, I want to add a menu to create new marks from the menu.  For now you have to manually add it to the marks page once and reload logseq (or the plugin), from then on you can always update the mark via the slash menu.
* only marks pages, not blocks.

### Running the code

- `npm install && npm run build` in terminal to install dependencies
