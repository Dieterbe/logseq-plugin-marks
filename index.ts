import '@logseq/libs'
import { SettingsSchema } from "./settingsSchema";

// returns an array of recommended mark names, i.e. "default" and any others the user has defined.
async function getMarks(): Promise<string[]> {
  const marksPageName = logseq.settings?.marks_page_name ?? 'marks'

  let marks = ["default"]

  const markBlocksTree = await logseq.Editor.getPageBlocksTree(marksPageName)
  if (markBlocksTree) {

    const moreMarks = markBlocksTree
      .map(b => b.content.split(' ', 3))
      .filter(sp => sp.length === 3 && sp[0] === "mark" && sp[1] != "default" && sp[2].startsWith("[["))
      .map(sp => sp[1])

    marks = marks.concat(moreMarks)
  }

  return marks.sort()
}

function registerCallback(markName: string) {
  logseq.Editor.registerSlashCommand(
    `mark ${markName}`, async () => {
      const marksPageName = logseq.settings?.marks_page_name ?? 'marks'

      const page = await logseq.Editor.getCurrentPage()
      if (!page) {
        logseq.UI.showMsg("I don't know which page you're on. Click on the title and try again", "error")
        return
      }

      let marksPage = await logseq.Editor.getPage(marksPageName)
      if (!marksPage) {
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
        const sp = b.content.split(' ', 3) // note that page name may contain white space

        if (sp.length === 3 && sp[0] === "mark" && sp[1] === markName && sp[2].startsWith("[[")) {
          console.log("logseq-plugin-marks: found mark " + sp[1] + " pointing to " + sp[2], "updating to " + page.originalName)
          logseq.Editor.updateBlock(b.uuid, newContent)
          return
        }
      }

      console.log(`logseq-plugin-marks: did not find mark ${markName}, creating it to point to ${page.originalName}`)
      const block = await logseq.Editor.appendBlockInPage(currentPage.name, newContent)
    },
  )
}

async function main() {

  logseq.useSettingsSchema(SettingsSchema)

  const marks = await getMarks()

  // for every mark name in the array, register the callback
  for (const markName of marks) {
    registerCallback(markName)
  }
}

// bootstrap
logseq.ready(main).catch(console.error)
