declare module 'ssb-validate' {

  type Id = string;
  type FeedId = string;
  type MessageId = string;
  type State = {
    validated: number;
    queued: number;
    // Messages which have been validated and may now be written to database
    queue: ValidMessage[];
    feeds: Record<FeedId, HeadMessage>;
  };

  type HeadMessage = {
    id: MessageId;
    sequence: number;
    timestamp: number;
  };

  type ValidMessage = {
    previous: Id;
    sequence: number;
    author: Id;
    timestamp: number;
    hash: string;
    content: any;
    signature: string;
  };

  type FeedState = any;
  /**
   * Append and validate a message to state.
   * If the message is valid, it will appear at the end of state.queue it may now be written to the database.
   * hmac_key is optional - if provided, messages are hmac'd with it before signing,
   * which can be used to create a separate network in which messages cannot be copied to the main network.
   * Messages compatible with the main network have hmac_key = null
   * @param state
   * @param hmac
   * @param validMsg
   * @private
   */
  function append(state: State, hmac: string|null, validMsg: ValidMessage): State;
  function create(feedState: FeedState, keys, hmacKey: string|null, content: any, timestamp: Date): ValidMessage;
  function initial(): any;

  export {
    append,
    create,
    initial,
  };
}
