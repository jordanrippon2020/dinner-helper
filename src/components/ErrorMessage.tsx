interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <h3>Something Went Wrong</h3>
      <p>{message}</p>
      <p>Please try again or check your connection.</p>
    </div>
  );
}