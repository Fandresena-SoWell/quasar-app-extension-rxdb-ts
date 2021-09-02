import { inject } from "vue"
import PromptsInterface from "../interfaces/PromptsInterface"

export default () : PromptsInterface => {
  const prompts = inject<Record<"@sowell/rxdb", PromptsInterface>>("prompts")
  if (prompts == undefined) {
    throw Error("Could not inject prompts")
  }
  return prompts["@sowell/rxdb"]
}