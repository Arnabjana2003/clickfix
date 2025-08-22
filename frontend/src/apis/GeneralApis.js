import API, { handleApiError } from ".";

const GeneralApis = {
  getChatbotReply: async (userMsg) => {
    try {
      const response = await API.get(`/chat/reply?message=${userMsg}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default GeneralApis;
