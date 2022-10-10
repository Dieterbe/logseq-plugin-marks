import '@logseq/libs'

async function main() {

  const markerName = "default"
  const markerPageName = "markings"

  logseq.Editor.registerSlashCommand(
    'mark', async () => {
      const page = await logseq.Editor.getCurrentPage()
      if (!page) {
        logseq.UI.showMsg("I don't know which page you're on. Click on the title and try again", "error")
        return
      }

      let markingsPage = await logseq.Editor.getPage(markerPageName)
      if (!markingsPage) {
        logseq.UI.showMsg("Could not get markings page. creating one", "warning")
        markingsPage = await logseq.Editor.createPage(markerPageName)
        if (markingsPage) {
          logseq.UI.showMsg("created a new markings page")
        } else {
          logseq.UI.showMsg("failed to create markings page", "error")
          return
        }
      }

      // change open page to markings page
      // luckily, seems this bug doesn't affect us.  https://github.com/logseq/logseq/issues/5090
      logseq.App.pushState('page', { name: markerPageName })
      const currentPage = await logseq.Editor.getCurrentPage()
      if (currentPage?.originalName !== markerPageName) throw new Error('page error')

      const pageBlocksTree = await logseq.Editor.getCurrentPageBlocksTree()

      const newContent = "marker " + markerName + " [[" + page.originalName + "]]"

      // iterate the blocks and find what we need
      for (var i in pageBlocksTree) {
        let b = pageBlocksTree[i]
        const sp = b.content.split(' ',3) // note that page name may contain white space

        if (sp.length === 3 && sp[0] === "marker" && sp[1] === markerName && sp[2].startsWith("[[")) {
          console.log("bingo on this line" + b.content)
          console.log("found marker " + sp[1] + " pointing to " + sp[2], "updating to " + page.originalName)
          logseq.Editor.updateBlock(b.uuid, newContent )
          return
        }
      }
      console.log("no marker found, creating one")

      // if we're still here, it means we didn't find our marker on the page. add it.
      //logseq.Editor.createBlock({ content: "marker default [[" + page.originalName + "]]" })
      const block = await logseq.Editor.appendBlockInPage(currentPage.name, newContent)
      console.log("added block", block)
    },
  )
}

// bootstrap
logseq.ready(main).catch(console.error)
