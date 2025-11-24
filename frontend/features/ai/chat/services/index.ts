// Cached queries
export {
  // getCachedSession, // ❌ REMOVED - Security vulnerability (session leakage)
  getCachedUserById,
  getCachedUser,
  getCachedChatById,
  getCachedChatsByUserId,
  getCachedMessagesByChatId,
  getCachedVotesByChatId,
  getCachedDocumentById,
  getCachedDocumentsById,
  getCachedSuggestionsByDocumentId,
} from "./cached-queries";

// Direct queries
export {
  getUser,
  getUserSubscriptionType,
  createUser,
  createGuestUser,
  ensureUserProfile,
  saveChat,
  deleteChatById,
  getChatsByUserId,
  getChatById,
  saveMessages,
  getMessagesByChatId,
  voteMessage,
  getVotesByChatId,
  saveDocument,
  getDocumentsById,
  getDocumentById,
  deleteDocumentsByIdAfterTimestamp,
  saveSuggestions,
  getSuggestionsByDocumentId,
  getMessageById,
  deleteMessagesByChatIdAfterTimestamp,
  updateChatVisiblityById,
  updateChatTitleById,
  updateChatLastContextById,
  getMessageCountByUserId,
  createStreamId,
  getStreamIdsByChatId,
} from "./queries";
