import { inject } from "vue"

export interface PromptsInterface {
  server_graphql_base_url: string,
  server_graphql_base_url_subscription: string,
  vuex_getters_token: string,
  vuex_getters_db_name: string
}

export default () => {
  const prompts = inject<Record<"@sowell/rxdb", PromptsInterface>>("prompts")
  if (prompts == undefined) {
    throw Error("Could not inject prompts")
  }
  return prompts["@sowell/rxdb"]
}