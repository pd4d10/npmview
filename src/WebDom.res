type response
module Response = {
  type t = response
  @send external json: t => promise<Js.Json.t> = "json"
  @send external text: t => promise<string> = "text"
}
@val external fetch: string => promise<response> = "fetch"

@send external focus: Dom.element => unit = "focus"

module Intl = {
  module NumberFormat = {
    type t

    @scope("Intl") @new
    external make: (string, ~options: 'options) => t = "NumberFormat"

    @send external format: (t, int) => string = "format"
  }
}
