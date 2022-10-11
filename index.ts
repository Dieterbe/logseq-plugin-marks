import '@logseq/libs'
import { SettingsSchema } from "./settingsSchema";


async function main() {

  logseq.useSettingsSchema(SettingsSchema)

  const markName = "default"

  logseq.Editor.registerSlashCommand(
    'mark', async () => {
      const marksPageName = logseq.settings?.marks_page_name ?? 'marks'

      const page = await logseq.Editor.getCurrentPage()
      if (!page) {
        logseq.UI.showMsg("I don't know which page you're on. Click on the title and try again", "error")
        return
      }

      let marksPage = await logseq.Editor.getPage(marksPageName)
      if (!marksPage) {
        logseq.UI.showMsg("Could not get marks page. creating one", "warning")
        marksPage = await logseq.Editor.createPage(marksPageName)
        if (marksPage) {
          logseq.UI.showMsg("created a new marks page")
        } else {
          logseq.UI.showMsg("failed to create marks page", "error")
          return
        }
      }

      // change open page to marks page
      // luckily, seems this bug doesn't affect us.  https://github.com/logseq/logseq/issues/5090
      logseq.App.pushState('page', { name: marksPageName })
      const currentPage = await logseq.Editor.getCurrentPage()
      if (currentPage?.originalName !== marksPageName) throw new Error('page error')

      const pageBlocksTree = await logseq.Editor.getCurrentPageBlocksTree()

      const newContent = "mark " + markName + " [[" + page.originalName + "]]"

      // iterate the blocks and find what we need
      for (var i in pageBlocksTree) {
        let b = pageBlocksTree[i]
        const sp = b.content.split(' ',3) // note that page name may contain white space

        if (sp.length === 3 && sp[0] === "mark" && sp[1] === markName && sp[2].startsWith("[[")) {
          console.log("bingo on this line" + b.content)
          console.log("found mark " + sp[1] + " pointing to " + sp[2], "updating to " + page.originalName)
          logseq.Editor.updateBlock(b.uuid, newContent )
          return
        }
      }
      console.log("no mark found, creating one")

      // if we're still here, it means we didn't find our mark on the page. add it.
      //logseq.Editor.createBlock({ content: "mark default [[" + page.originalName + "]]" })
      const block = await logseq.Editor.appendBlockInPage(currentPage.name, newContent)
      console.log("added block", block)
    },
  )
}

// bootstrap
logseq.ready(main).catch(console.error)
