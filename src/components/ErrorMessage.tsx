interface ErrorMessageProps {
  message: string;
  suggestions?: string[];
  technicalDetails?: string;
}

export default function ErrorMessage({ message, suggestions, technicalDetails }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <h3>Something Went Wrong</h3>
      <p className="error-main-message">{message}</p>

      {suggestions && suggestions.length > 0 && (
        <div className="error-suggestions">
          <h4>Here's what you can try:</h4>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {!suggestions && (
        <p className="error-fallback">Please try again or check your connection.</p>
      )}

      {technicalDetails && (
        <details className="error-technical">
          <summary>Technical Details</summary>
          <p>{technicalDetails}</p>
        </details>
      )}
    </div>
  );
}