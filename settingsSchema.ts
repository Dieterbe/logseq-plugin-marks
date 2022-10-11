import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const SettingsSchema: Array<SettingSchemaDesc> = [
  {
    title: 'Marks page name',
    key: 'marks_page_name',
    description: 'Page name to store your marks',
    default: 'marks',
    type: "string"
  }
]