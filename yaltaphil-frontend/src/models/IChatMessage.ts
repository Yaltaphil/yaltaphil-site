export default interface IChatMessage {
  /** Mongo's `_id`. The wire spelling is normalised in src/api/chat.ts, so nothing
   *  downstream has to know which key the backend happened to use. */
  id: string
  text: string
  author: string
  /** ISO-8601 UTC from Mongoose `timestamps: true` — always `SSS.mmm`, so plain
   *  string comparison sorts chronologically. */
  createdAt: string
}
