import { type Completion } from "@codemirror/autocomplete";

export interface Autocompletion<TListing> extends Completion {
  label: keyof TListing & string;
}
