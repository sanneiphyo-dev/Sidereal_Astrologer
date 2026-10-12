using System;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.AskAstrologyQuestion
{
    public static class AskAstrologyQuestionValidator
    {
        public static Result<bool> Validate(AskAstrologyQuestionRequest request)
        {
            if (request == null)
            {
                return Result<bool>.ValidationError("Request payload cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(request.Question))
            {
                return Result<bool>.ValidationError("Astrology question cannot be empty or whitespace.");
            }

            if (request.Question.Trim().Length < 3)
            {
                return Result<bool>.ValidationError("Please ask a question with at least 3 characters.");
            }

            return Result<bool>.Success(true);
        }
    }
}
