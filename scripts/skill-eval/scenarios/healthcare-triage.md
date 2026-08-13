---
expected: possibly relevant
---

# User journey: symptom chatbot at a private clinic group

1. A patient in Lyon visits the website of a private clinic group to book an
   appointment.
2. A chat window opens automatically: "Hi! Tell me what's bothering you and
   I'll help you pick the right specialist." There is no statement about
   whether the chat is automated.
3. The patient types symptoms. The chat asks follow-up questions, then says
   "Based on what you describe, I recommend booking dermatology rather than
   general practice" and offers appointment slots.
4. The recommendation engine is a large language model hosted by a third-party
   provider; the clinic configured the prompts.
5. If the patient types "chest pain", the bot replies with an urgent-care
   phone number, decided by a keyword list the clinic maintains.
6. The clinic's marketing page calls the feature "your AI health assistant",
   but the chat window itself never mentions AI.
