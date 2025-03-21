DOCUMENTATION_GUIDE.md
AI Instructions
Objective: Maintain this document with concise, high-quality summaries for each file in the project. Each summary should follow the “Layout/Structure” format below.

Add New Entries:

When asked to “Add a summary for [filename],” create a new section in this document under ## File Summaries (or whatever heading structure you choose).
Adhere to the required headings and bullet points described in the “Layout/Structure” section below.
Use the existing file summaries as examples for style and consistency.
Update Existing Entries:

When asked to update an existing file’s summary:
Locate the relevant summary under ## File Summaries.
Modify or add the requested details (Purpose, Key Functions, etc.) while keeping the section concise.
If code snippets are necessary, only include short snippets (less than 10–20 lines).
Maintain Consistency:

Use the same headings in the same order for all files.
Reference previously summarized files when relevant (e.g., “Uses the same User model as described in authController.js summary.”).
Avoid repeating large code blocks or entire file contents – the focus is on short explanations.
Minimize Redundancy:

If multiple files share the same responsibilities, data structures, or dependencies, note that once and reference it in other summaries.
Keep the writing concise to avoid exceeding context limits.
Formatting Rules:

Use Markdown headings (##, ###) and bullet points for clarity.
Bold key terms or function names when helpful for clarity.
Handle Edge Cases and TODOs:

Make sure each summary includes mention of any known issues or TODO items so that future developers or AI queries can quickly identify next steps.
Error or Incomplete Requests:

If a user request to update a summary is missing critical information (like the file name or the specific content changes), ask clarifying questions before proceeding.
Layout/Structure for File Summaries
Each file (or page) in the project should be summarized using the following sections. Summaries should be concise, focusing on the essentials needed for future development and continuity.

File Name

Example: authController.js
Purpose / High-Level Summary

A one- to two-sentence explanation of the file’s role in the project.
Example: “Handles user authentication, including login, logout, and token generation.”
Core Functions / Classes

Function/Class names and signatures
Example: loginUser(req, res)
Key responsibilities
Brief bullet points describing what the function/class does.
Mention relevant inputs/outputs.
Group smaller helper methods into a single bullet if they’re not central to the functionality.
Data Structures & Key Variables

Important constants, models, or enums.
Example: “Uses User model with properties { email, password, role }.”
If external references (e.g., environment variables, config files) are critical, include them here.
Dependencies & Imports

List out any significant third-party libraries or internal modules.
If other files in the app depend on this file, mention them (and vice versa).
Edge Cases / Special Handling

Describe any special exceptions, error handling, or concurrency issues.
Note performance optimizations or limitations.
Known Issues / TODOs

Summarize bugs, missing features, or next-phase tasks.
Keep it short but clear.
Short Code Snippets (Optional)

Only if a snippet is crucial to understanding or capturing a unique logic block.
Less than 10–20 lines, focusing on the logic that future maintainers must understand.
Summary / One-Liner

A final single sentence that reiterates the file’s main role.
File Summaries
(This is where the AI will place each file’s summary. Provide one “sample” to show the structure, then each subsequent file’s summary can follow the same pattern.)

Sample: authController.js
Purpose / High-Level Summary

Handles user authentication, including login, logout, and token generation.
Core Functions / Classes

loginUser(req, res)
Authenticates user credentials (email/password) against the User model.
Returns a JWT upon successful validation.
logoutUser(req, res)
Invalidates client tokens or clears session data.
verifyToken(token)
Parses and validates the JWT, checks for user privileges.
Data Structures & Key Variables

Depends on the User model (models/User.js) with fields { email, password, role }.
Dependencies & Imports

Uses bcrypt for password hashing.
Uses jsonwebtoken for token creation/verification.
Relies on userRoutes.js for endpoint mappings.
Edge Cases / Special Handling

Throws an InvalidTokenError if JWT is expired or invalid.
Caches user session data in memory for performance.
Known Issues / TODOs

TODO: Implement password reset flow.
TODO: Integrate 2FA.
Short Code Snippets (Optional)

js
Copy
Edit
// Basic structure for loginUser
async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).send("User not found");
  // Validate password and generate token...
}
Summary / One-Liner

Serves as the backbone for user authentication, ensuring secure login and session validation.
(Add Summaries for Additional Files Below)
(Each new file should follow the same layout and headings.)

How to Use This Guide
Reference: Whenever you need to summarize or update documentation for a file, open this guide.
Follow: Use the headings and bullet points as shown in the sample to ensure consistent, concise documentation.
Review: Keep an eye on overlapping details between files; reference previous entries to avoid duplication.
Ask: If something is unclear or ambiguous, ask for clarification or more context before updating the summaries.