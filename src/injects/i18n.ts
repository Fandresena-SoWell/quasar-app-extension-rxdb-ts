import { inject } from "vue"
import { I18n } from "vue-i18n"

export default () => {
  const i18n = inject<I18n>("i18n")
  if (i18n == undefined) {
    throw Error("Could not inject i18n")
  }
  return i18n
}