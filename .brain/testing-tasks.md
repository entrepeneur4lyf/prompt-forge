# Prompt Forge Testing Tasks

## Initial Setup
- [x] Navigate to https://prompt-forge.replit.app/
  - [x] Verify initial page load time
  - [x] Check for any console errors on load
  - [ ] Test with different browsers (Chrome, Firefox, Safari)
  - [ ] Test with private/incognito mode
- [x] Open browser developer console for error monitoring
  - [x] Set up console filters for errors and warnings
  - [x] Enable network tab monitoring
  - [x] Monitor WebSocket connections if applicable
  - [x] Check for CORS issues
- [x] Configure Gemini API key in settings panel
  - [x] Test invalid API key format
  - [x] Test valid API key format
  - [x] Verify key storage security
  - [x] Test key masking in UI
  - [x] Verify key is not exposed in network requests
  - [x] Test API key rate limiting behavior

## Bug Report: Browser Automation Issues
1. Steps to reproduce:
   - Attempt to use browser-use tool for automated testing
   - Try to create new template using automation
   - Try to configure settings using automation
2. Expected behavior:
   - Browser automation should successfully navigate and interact with the application
3. Actual behavior:
   - Initial page navigation works but requires full https:// URL format
   - Settings configuration works with specific step-by-step instructions
   - Template creation automation still needs improvement
   - Some model responses fail to deserialize properly
   - Template enhancement fails silently
   - Actions not properly registered in UI
4. Console errors:
   - URL format errors when not using full https:// prefix
   - JSON deserialization errors with some model responses
   - Response format type `json_schema` unavailable errors in some cases
   - Resource exhaustion (429) errors with Google's API
   - JSON parsing errors in backend API key validation
5. Progress:
   - Successfully implemented settings panel automation
   - Successfully configured Gemini API key through automation
   - Improved element detection for settings workflow
   - Updated toolchain with structured provider configurations
   - Added specific model indices for each provider
   - Identified issues with browser session state consistency
   - Documented template management failures
6. Next steps:
   - Test template creation with each provider:
     - Deepseek (deepseek-chat)
     - Google (gemini-1.5-pro, gemini-2.0-flash)
     - OpenAI (gpt-4)
     - Anthropic (claude-3-5-sonnet variants)
   - Improve template creation automation
   - Add better error handling for URL formats
   - Test vision capabilities with supported providers
   - Add proper error handling for model response deserialization
   - Implement session recording for debugging complex workflows
   - Test headless mode for CI/CD integration
   - Fix browser session state inconsistencies
   - Implement proper action registration in UI
   - Add retry logic for API rate limiting
   - Improve JSON parsing error handling

## Provider-Specific Testing
- [ ] Test Deepseek provider (default)
  - [ ] Verify deepseek-chat model functionality
  - [ ] Test with and without vision capabilities
  - [ ] Benchmark performance and response quality
- [ ] Test Google provider
  - [ ] Compare gemini-1.5-pro vs gemini-2.0-flash
  - [ ] Test vision analysis capabilities
  - [ ] Verify model-specific features
- [ ] Test OpenAI provider
  - [ ] Verify gpt-4 integration
  - [ ] Test complex reasoning tasks
  - [ ] Evaluate response quality
- [ ] Test Anthropic provider
  - [ ] Compare different Claude model versions
  - [ ] Test context handling
  - [ ] Evaluate instruction following

## Template Creation Testing
- [ ] Create template: Code domain (OpenAI provider)
  - [ ] Test all available model options
  - [ ] Include TDD and SOLID principles methodologies
  - [ ] Test Developer role
  - [ ] Test with code snippets in prompt
  - [ ] Verify syntax highlighting if present
- [ ] Create template: General domain (Anthropic provider)
  - [ ] Test available Claude models
  - [ ] Test with no specific role
  - [ ] Test with maximum length content
  - [ ] Test with special characters
- [ ] Create template: Marketing domain (Gemini provider)
  - [ ] Verify Gemini model options
  - [ ] Test with custom instructions
  - [ ] Test with multilingual content
  - [ ] Test with emojis and special formatting
- [ ] Create template: Education domain (Replit provider)
  - [ ] Test available Replit models
  - [ ] Include BDD methodology
  - [ ] Test with educational markdown content
  - [ ] Test with mathematical formulas if supported
- [ ] Create template: Meta domain with Agent Enhanced mode
  - [ ] Test with Atomic Design methodology
  - [ ] Include Code Review methodology
  - [ ] Test nested agent instructions
  - [ ] Test complex prompt chains
- [ ] Verify form field validation for all required fields
  - [ ] Test empty submissions
  - [ ] Test invalid combinations
  - [ ] Verify error messages
  - [ ] Test field character limits
  - [ ] Test paste functionality
  - [ ] Test with rich text if supported
- [ ] Check template list display and pill indicators
  - [ ] Verify all metadata is correctly displayed
  - [ ] Test sorting/filtering if available
  - [ ] Check responsive behavior of pills
  - [ ] Test search functionality if present
  - [ ] Test bulk operations if available
  - [ ] Verify template count accuracy

## Meta Domain Specific Tests
- [ ] Verify Agent Type dropdown visibility for Meta domain
  - [ ] Check visibility rules for different domains
  - [ ] Test dropdown interaction states
  - [ ] Test keyboard navigation
  - [ ] Verify accessibility compliance
- [ ] Test Agent Enhanced mode toggle
  - [ ] Verify toggle state persistence
  - [ ] Test interaction with other form fields
  - [ ] Test with browser refresh
  - [ ] Test with multiple tabs open
- [ ] Create templates with different agent types:
  - [ ] Cursor agent
    - [ ] Test specific Cursor agent instructions
    - [ ] Verify Cursor-specific features
    - [ ] Test IDE integration points
    - [ ] Test code-specific prompts
  - [ ] Replit agent
    - [ ] Test Replit-specific configurations
    - [ ] Verify Replit agent behaviors
    - [ ] Test environment variables handling
    - [ ] Test deployment-related prompts
  - [ ] Claude agent
    - [ ] Test Claude-specific settings
    - [ ] Verify Claude agent capabilities
    - [ ] Test advanced reasoning tasks
    - [ ] Test context window limits
- [ ] Verify agent-specific instructions in enhancement prompts
  - [ ] Check instruction formatting
  - [ ] Verify agent context preservation
  - [ ] Test instruction conflicts
  - [ ] Test instruction priority ordering

## Template Editing
- [ ] Edit Code domain template
  - [ ] Verify populated fields
    - [ ] Check all field values match original
    - [ ] Test partial updates
    - [ ] Test undo/redo if available
    - [ ] Test copy/paste behavior
  - [ ] Save changes and confirm updates
    - [ ] Verify database persistence
    - [ ] Check update timestamps
    - [ ] Test concurrent edits
    - [ ] Test version history if available
- [ ] Edit Meta domain template
  - [ ] Check Agent Enhanced behavior
    - [ ] Test toggle state persistence
    - [ ] Verify agent type persistence
    - [ ] Test switching between agents mid-edit
  - [ ] Verify Agent Type persistence
    - [ ] Test switching between agent types
    - [ ] Verify settings retention
    - [ ] Test agent-specific validation rules
- [ ] Test template selection vs edit mode
  - [ ] Verify preview-only mode
  - [ ] Test edit mode activation
  - [ ] Test mode switching
  - [ ] Verify unsaved changes warnings
- [ ] Validate preview section updates
  - [ ] Check real-time preview updates
  - [ ] Verify formatting preservation
  - [ ] Test preview refresh behavior
  - [ ] Test preview with large content

## Prompt Enhancement
- [ ] Test enhancement for each domain type
  - [ ] Verify domain-specific enhancements
  - [ ] Test enhancement quality
  - [ ] Test with minimal input
  - [ ] Test with maximum length input
  - [ ] Test with edge case content
- [ ] Verify custom instructions integration
  - [ ] Test instruction formatting
  - [ ] Check instruction priority
  - [ ] Test instruction conflicts
  - [ ] Test instruction inheritance
- [ ] Test Meta domain with Agent Enhanced mode
  - [ ] Verify agent-specific enhancements
  - [ ] Test complex instruction combinations
  - [ ] Test nested agent scenarios
  - [ ] Test agent fallback behavior
- [ ] Validate enhancement prompt composition
  - [ ] Check placeholder handling
  - [ ] Verify context preservation
  - [ ] Test variable substitution
  - [ ] Test template inheritance
- [ ] Test "Save Enhanced Prompt as Template" feature
  - [ ] Verify metadata preservation
  - [ ] Test template conversion accuracy
  - [ ] Test naming conflicts
  - [ ] Test template categories
- [ ] Verify placeholder preservation
  - [ ] Test various placeholder formats
  - [ ] Check placeholder functionality
  - [ ] Test placeholder validation
  - [ ] Test placeholder defaults

## Error Handling
- [ ] Test blank required fields
  - [ ] Verify error messages
  - [ ] Test field highlighting
  - [ ] Test focus management
  - [ ] Test error message accessibility
- [ ] Attempt invalid domain/provider combinations
  - [ ] Test incompatible selections
  - [ ] Verify helpful error guidance
  - [ ] Test recovery suggestions
  - [ ] Test state after error
- [ ] Check error message display
  - [ ] Test message clarity
  - [ ] Verify error recovery steps
  - [ ] Test error message dismissal
  - [ ] Test error aggregation
- [ ] Verify application stability after errors
  - [ ] Test state recovery
  - [ ] Check data persistence
  - [ ] Test error boundary behavior
  - [ ] Test cleanup after errors

## Settings Panel
- [ ] Access settings panel
  - [ ] Test panel accessibility
  - [ ] Verify UI responsiveness
  - [ ] Test keyboard navigation
  - [ ] Test screen reader compatibility
- [ ] Test Gemini API key addition
  - [ ] Verify key validation
  - [ ] Test secure storage
  - [ ] Test key rotation
  - [ ] Test invalid key handling
- [ ] Verify key persistence
  - [ ] Test page reload
  - [ ] Check session handling
  - [ ] Test multiple browser tabs
  - [ ] Test session timeout
- [ ] Test key removal
  - [ ] Verify clean removal
  - [ ] Test related functionality
  - [ ] Test removal confirmation
  - [ ] Test post-removal state

## Cross-cutting Concerns
- [ ] Monitor console for errors
  - [ ] Log all errors and warnings
  - [ ] Document error patterns
  - [ ] Test error reporting
  - [ ] Verify error tracking
- [ ] Test responsive design
  - [ ] Check mobile layout
  - [ ] Test tablet layout
  - [ ] Verify desktop layout
  - [ ] Test orientation changes
  - [ ] Test with different font sizes
  - [ ] Test with browser zoom
- [ ] Verify data persistence
  - [ ] Test browser refresh
  - [ ] Check session storage
  - [ ] Test local storage limits
  - [ ] Test data synchronization
- [ ] Check loading states
  - [ ] Verify loading indicators
  - [ ] Test timeout handling
  - [ ] Test cancellation
  - [ ] Test recovery from interruption
- [ ] Test browser navigation
  - [ ] Check back/forward navigation
  - [ ] Test deep linking if available
  - [ ] Test browser history
  - [ ] Test URL parameters

## Performance Testing
- [ ] Measure initial load time
  - [ ] Test cold start
  - [ ] Test cached load
  - [ ] Test with different network conditions
- [ ] Test template list performance with 50+ templates
  - [ ] Test scrolling performance
  - [ ] Test search performance
  - [ ] Test filtering performance
- [ ] Monitor memory usage during extended sessions
  - [ ] Test for memory leaks
  - [ ] Test with multiple templates open
  - [ ] Test with large prompt content
- [ ] Test API response times
  - [ ] Measure enhancement latency
  - [ ] Test concurrent requests
  - [ ] Test rate limiting
- [ ] Verify UI responsiveness during background operations
  - [ ] Test during saves
  - [ ] Test during enhancements
  - [ ] Test during bulk operations

## Security Testing
- [ ] Test input sanitization
  - [ ] Test XSS prevention
  - [ ] Test SQL injection prevention
  - [ ] Test with malicious content
- [ ] Verify API key handling
  - [ ] Test key encryption
  - [ ] Test key transmission
  - [ ] Test key storage
- [ ] Test authentication if present
  - [ ] Test session management
  - [ ] Test permission levels
  - [ ] Test access controls
- [ ] Test data privacy
  - [ ] Verify prompt content privacy
  - [ ] Test template sharing if available
  - [ ] Test data isolation

## Accessibility Testing
- [ ] Test keyboard navigation
  - [ ] Verify tab order
  - [ ] Test keyboard shortcuts
  - [ ] Test focus management
- [ ] Test screen reader compatibility
  - [ ] Verify ARIA labels
  - [ ] Test dynamic content updates
  - [ ] Test error announcements
- [ ] Test color contrast
  - [ ] Verify WCAG compliance
  - [ ] Test high contrast mode
  - [ ] Test with different themes
- [ ] Test text scaling
  - [ ] Verify responsive text
  - [ ] Test minimum text size
  - [ ] Test with browser zoom

## Bug Documentation Template
For each issue found:
1. Steps to reproduce
   - Detailed step-by-step instructions
   - Environment information
   - User role/permissions
   - Browser/device details
   - Network conditions
2. Expected behavior
   - Clear description of intended functionality
   - Reference to requirements if applicable
   - Screenshots of correct behavior if available
3. Actual behavior
   - Precise description of the issue
   - Impact on user experience
   - Frequency of occurrence
   - Related issues if any
4. Screenshots/recordings
   - Before/after states
   - Error messages
   - UI anomalies
   - Video recording if applicable
   - Network requests if relevant
5. Console errors
   - Full error messages
   - Stack traces if available
   - Network request/response data
   - Browser console logs
   - Application logs if accessible
6. Improvement suggestions
   - Potential fixes
   - UX enhancement ideas
   - Performance optimization suggestions
   - Accessibility improvements
   - Security considerations
